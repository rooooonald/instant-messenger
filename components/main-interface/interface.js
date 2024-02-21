"use client";

import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";

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
import {
  getDownloadURL,
  ref as storageRef,
  uploadString,
} from "firebase/storage";

import { db, storage } from "@/lib/firebase";
import { AuthContext } from "@/store/auth-context";
import { NotificationContext } from "@/store/notification-context";

import ConversationList from "../conversation-list/conversation-list";
import MessageWindow from "../message-window/message-window";
import WelcomeScreen from "../message-window/welcome-screen";
import Notification from "../ui/notification";
import { v4 as uuidv4 } from "uuid";

import styles from "./interface.module.css";
import { AnimatePresence } from "framer-motion";
import { LazyMotion, domAnimation } from "framer-motion";

export default function MessengerInterface() {
  const [selectedConversation, setSelectedConversation] = useState();
  const [currConversationId, setCurrConversationId] = useState();
  const [conversationList, setConversationList] = useState();

  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const notification = notificationCtx.notification;

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
              isImage: lastMessage.isImage,
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
  }, [notification]);

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

    let photoUrl;
    if (newMessage.isImage) {
      photoUrl = await uploadFile(newMessage.content);
      newMessage.content = photoUrl;
    }

    await updateDoc(conversationRef, {
      lastUpdate: Date.now(),
      messages: arrayUnion(newMessage),
    });
  }

  // Uploading photo

  const uploadFile = async (imgAfterCrop) => {
    if (imgAfterCrop === null) {
      return;
    }
    const imageRef = storageRef(storage, `messages/${uuidv4()}`);

    const res = await uploadString(imageRef, imgAfterCrop, "data_url");
    const url = await getDownloadURL(res.ref);

    return url;
  };

  // Selecting conversation

  function selectConversationHandler(conversationId) {
    setCurrConversationId(conversationId);
  }

  if (authCtx.status === "unauthenticated") {
    return redirect("/");
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
          {!selectedConversation && <WelcomeScreen />}
          {selectedConversation && (
            <MessageWindow
              conversation={selectedConversation}
              onSend={sendMessageHandler}
            />
          )}
        </div>
        <AnimatePresence>
          {notification &&
            notification.id !== currConversationId &&
            notification.sender !== authCtx.userEmail && (
              <Notification
                title={notification.title}
                sender={notification.sender}
                content={notification.content}
                isImage={notification.isImage}
                onSelectConversation={() => {
                  selectConversationHandler(notification.id);
                  notificationCtx.removeNotification();
                }}
              />
            )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
