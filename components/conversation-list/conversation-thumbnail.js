import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { onSnapshot, doc } from "firebase/firestore";

import styles from "./conversation-thumbnail.module.css";
import { m } from "framer-motion";
import { IoImageOutline } from "react-icons/io5";

export default function ConversationThumbnail({
  onSelectConversation,
  id,
  lastMessage,
  activeId,
  title,
  onCloseMobileNav,
}) {
  const [isActive, setIsActive] = useState(false);
  const [senderUsername, setSenderUsername] = useState("");
  const [isLastMessageExpired, setIsLastMessageExpired] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      onSnapshot(doc(db, "users", lastMessage.sender), (userDoc) => {
        const foundUser = userDoc.data();
        setSenderUsername(foundUser.username);
      });
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
    onCloseMobileNav && onCloseMobileNav();
  };

  return (
    <m.div
      whileHover={{
        x: 20,
      }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`${styles.wrapper} gradient-bg`}
      style={{ opacity: isActive ? 1 : 0.5 }}
      onClick={() => clickHandler(id)}
    >
      <div className={styles.conversation}>
        <div className={styles.title}>{title}</div>
        {lastMessage &&
          Date.now() < lastMessage.timeAllowed + lastMessage.sendTime &&
          !isLastMessageExpired && (
            <div className={styles.lastMessage}>
              <span>{senderUsername}: </span>
              {lastMessage.isImage ? (
                <div>
                  <IoImageOutline /> <em>Image</em>
                </div>
              ) : (
                <p>{lastMessage.content}</p>
              )}
            </div>
          )}
      </div>
      <div className={styles.status}>
        {isActive && <div className={styles.active}></div>}
      </div>
    </m.div>
  );
}
