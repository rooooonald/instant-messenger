import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import Image from "next/image";

import { db } from "@/lib/firebase";
import { onSnapshot, doc } from "firebase/firestore";

import styles from "./notification.module.css";
import { m } from "framer-motion";

export default function Notification({
  title,
  sender,
  content,
  isImage,
  onSelectConversation,
}) {
  const [senderUsername, setSenderUsername] = useState("");

  useEffect(() => {
    onSnapshot(doc(db, "users", sender), (userDoc) => {
      const foundUser = userDoc.data();
      setSenderUsername(foundUser.username);
    });
  }, [sender]);

  return ReactDOM.createPortal(
    <m.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      className={styles["notification-box"]}
      onClick={onSelectConversation}
    >
      <div className={styles.heading}>
        <m.p
          animate={{ x: "-50%" }}
          transition={{ duration: 6 }}
          className={styles["heading-text"]}
        >
          {"NEW MESSAGE!".repeat(10)}
        </m.p>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>
          <span className={styles.name}>{senderUsername}:</span>{" "}
          {isImage ? (
            <div>
              <Image
                src={`${content}`}
                alt="conversation-image"
                className={styles["message-img"]}
                fill
              />
            </div>
          ) : (
            `${content.slice(0, 50)} ${content.length > 50 ? "..." : ""}`
          )}
        </div>
      </div>
    </m.div>,
    document.getElementById("notification")
  );
}
