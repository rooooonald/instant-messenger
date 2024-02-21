import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/store/auth-context";

import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import styles from "./message-box.module.css";
import { FaBomb } from "react-icons/fa";
import { m } from "framer-motion";

export default function MessageBox({ message }) {
  const [senderUsername, setSenderUsername] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const { timeAllowed, sendTime, sender, content, isImage } = message;

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (Date.now() < timeAllowed + sendTime) {
      const timer = setTimeout(
        () => setIsExpired(true),
        sendTime + timeAllowed - Date.now()
      );
      return () => {
        clearTimeout(timer);
        setIsExpired(false);
      };
    } else {
      setIsExpired(true);
    }

    return () => setIsExpired(false);
  }, [message]);

  useEffect(() => {
    const extractUsername = async () => {
      onSnapshot(doc(db, "users", sender), (userDoc) => {
        const foundUser = userDoc.data();
        setSenderUsername(foundUser.username);
      });
    };

    extractUsername();
  }, []);

  const displayTime = new Intl.DateTimeFormat("en-CA", {
    timeStyle: "short",
  }).format(sendTime);

  const senderIsYou = authCtx.userId === sender;

  let messageContent;
  if (isExpired) {
    messageContent = (
      <div className={styles.expired}>
        <FaBomb />
        <span>Forgotten</span>
      </div>
    );
  } else {
    messageContent = (
      <>
        <div className={styles.message}>
          {!senderIsYou && <div className={styles.name}>{senderUsername}:</div>}
          {isImage ? (
            <Link href={content} target="_blank">
              <img
                src={`${content}`}
                alt="conversation-image"
                className={styles["message-img"]}
              />
            </Link>
          ) : (
            <div>{content}</div>
          )}
        </div>
        <div className={styles.sendtime}>{displayTime}</div>
      </>
    );
  }

  return (
    <m.div
      transition={{ duration: 1, type: "spring", stiffness: 500 }}
      whileHover={{ scale: 1.05 }}
      className={`${styles.wrapper} ${
        senderIsYou ? styles["your-message"] : styles["others-message"]
      }`}
    >
      {messageContent}
    </m.div>
  );
}
