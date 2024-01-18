import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import styles from "./conversation-thumbnail.module.css";
import { m } from "framer-motion";

export default function ConversationThumbnail({
  onSelectConversation,
  id,
  lastMessage,
  activeId,
  title,
  backgroundColorIndex,
}) {
  const [isActive, setIsActive] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
  const [isLastMessageExpired, setIsLastMessageExpired] = useState(false);

  useEffect(() => {
    const extractUsername = async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", lastMessage.sender)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const foundUser = doc.data();
        setSenderUsername(foundUser.username);
      });
    };
    if (lastMessage) {
      extractUsername();
    }
  }, [lastMessage]);

  useEffect(() => {
    setIsActive(false);
    if (activeId === id) {
      setIsActive(true);
    }
  }, [activeId]);

  useEffect(() => {
    if (
      lastMessage &&
      Date.now() < lastMessage.timeAllowed + lastMessage.sendTime
    ) {
      const timer = setTimeout(
        () => setIsLastMessageExpired(true),
        lastMessage.sendTime + lastMessage.timeAllowed - Date.now()
      );

      return () => {
        clearTimeout(timer);
        setIsLastMessageExpired(false);
      };
    }
  }, [lastMessage]);

  const clickHandler = (id) => {
    onSelectConversation(id);
  };

  const colors = [
    "linear-gradient(180deg, rgba(238,119,82,1) 30%, rgba(238,119,82,0.3) 100%)",
    "linear-gradient(180deg, rgba(122,0,252,1) 30%, rgba(122,0,252,0.3) 100%)",
    "linear-gradient(180deg, rgba(231,60,126,1) 30%, rgba(231,60,126,0.3) 100%)",
    "linear-gradient(180deg, rgba(35,166,213,1) 30%, rgba(35,166,213,0.3) 100%)",
    "linear-gradient(180deg, rgba(35,213,171,1) 30%, rgba(35,213,171,0.3) 100%)",
  ];

  return (
    <m.div
      whileHover={{
        x: 20,
        scale: 1.1,
      }}
      transition={{ duration: 0.5, type: "spring" }}
      className={styles.wrapper}
      style={{ background: colors[backgroundColorIndex % colors.length] }}
      onClick={() => clickHandler(id)}
    >
      <div className={styles.conversation}>
        <div className={styles.title}>{title}</div>
        {lastMessage &&
          Date.now() < lastMessage.timeAllowed + lastMessage.sendTime &&
          !isLastMessageExpired && (
            <div className={styles.lastMessage}>
              {senderUsername}: {lastMessage.content}
            </div>
          )}
      </div>
      <div className={styles.status}>
        {isActive && <div className={styles.active}></div>}
      </div>
    </m.div>
  );
}
