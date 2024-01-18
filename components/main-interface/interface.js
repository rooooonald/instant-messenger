"use client";

import { useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { AuthContext } from "@/store/auth-context";
import { NotificationContext } from "@/store/notification-context";

import ConversationList from "../conversation-list/conversation-list";
import MessageWindow from "../message-window/message-window";
import Loading from "../loading/loading";
import Starting from "../message-window/starting";
import Notification from "../ui/notification";

import styles from "./interface.module.css";
import { AnimatePresence } from "framer-motion";
import { LazyMotion, domAnimation } from "framer-motion";

export default function MessengerInterface() {
  const [selectedConversation, setSelectedConversation] = useState();
  const [currConversationId, setCurrConversationId] = useState();
  const [conversationList, setConversationList] = useState();

  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  useEffect(() => {
    if (conversationList) {
      const selectedConversation = conversationList.find(
        (conversation) => conversation.id === currConversationId
      );
      setSelectedConversation(selectedConversation);
    }
  }, [currConversationId, conversationList]);

  useEffect(() => {
    if (authCtx.userEmail) {
      const q = query(
        collection(db, "conversation"),
        where("participants", "array-contains", authCtx.userEmail)
      );
      onSnapshot(q, (querySnapshot) => {
        const conversationArray = [];

        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const updatedConversation = change.doc.data();

            const lastMessage =
              updatedConversation.messages[
                updatedConversation.messages.length - 1
              ];

            notificationCtx.addNotification({
              id: change.doc.id,
              title: updatedConversation.title,
              sender: lastMessage.sender,
              content: lastMessage.content,
            });
          }
        });

        querySnapshot.forEach((doc) => {
          const conversation = doc.data();
          conversationArray.push({ id: doc.id, ...conversation });
        });

        const sortedConversationList = conversationArray.sort(
          (a, b) => b.lastUpdate - a.lastUpdate
        );

        setConversationList(sortedConversationList);
      });
    }
  }, [authCtx, notificationCtx.addNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      notificationCtx.removeNotification();
    }, 3000);

    return () => clearTimeout(timer);
  }, [notificationCtx.notification]);

  // Adding new conversation

  async function addConversationHandler(conversationInfo) {
    try {
      const docRef = await addDoc(collection(db, "conversation"), {
        ...conversationInfo,
        messages: [],
        lastUpdate: Date.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Sending new messages

  async function sendMessageHandler(conversationId, newMessage) {
    const conversationRef = doc(db, "conversation", conversationId);

    await updateDoc(conversationRef, {
      lastUpdate: Date.now(),
      messages: arrayUnion(newMessage),
    });
  }

  // Selecting conversation

  function selectConversationHandler(conversationId) {
    setCurrConversationId(conversationId);
  }

  if (!conversationList) {
    return <Loading />;
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.wrapper}>
        <div className={styles.conversation}>
          {conversationList && (
            <ConversationList
              list={conversationList}
              activeId={currConversationId}
              onSelectConversation={selectConversationHandler}
              onAddConversation={addConversationHandler}
            />
          )}
        </div>

        <div className={styles.message}>
          {!selectedConversation && <Starting />}
          {selectedConversation && (
            <MessageWindow
              conversation={selectedConversation}
              onSend={sendMessageHandler}
            />
          )}
        </div>
        <AnimatePresence>
          {notificationCtx.notification &&
            notificationCtx.notification.id !== currConversationId &&
            notificationCtx.notification.sender !== authCtx.userEmail && (
              <Notification
                title={notificationCtx.notification.title}
                sender={notificationCtx.notification.sender}
                content={notificationCtx.notification.content}
                onSelectConversation={() => {
                  selectConversationHandler(notificationCtx.notification.id);
                  notificationCtx.removeNotification();
                }}
              />
            )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
