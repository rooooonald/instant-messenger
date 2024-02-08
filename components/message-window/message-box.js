import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/auth-context";

import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import styles from "./message-box.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { m } from "framer-motion";

export default function MessageBox({ message }) {
  const authCtx = useContext(AuthContext);
  const [senderUsername, setSenderUsername] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (Date.now() < message.timeAllowed + message.sendTime) {
      const timer = setTimeout(
        () => setIsExpired(true),
        message.sendTime + message.timeAllowed - Date.now()
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
      // const q = query(
      //   collection(db, "users"),
      //   where("email", "==", message.sender)
      // );

      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   const foundUser = doc.data();
      //   setSenderUsername(foundUser.username);
      // });

      onSnapshot(doc(db, "users", message.sender), (userDoc) => {
        const foundUser = userDoc.data();
        setSenderUsername(foundUser.username);
      });
    };

    extractUsername();
  }, []);

  const displayTime = new Intl.DateTimeFormat("en-CA", {
    timeStyle: "short",
  }).format(message.sendTime);

  let messageContent;
  if (isExpired) {
    messageContent = (
      <div className={styles.expired}>
        <FontAwesomeIcon icon={faBomb} />
        <span>Forgotten</span>
      </div>
    );
  } else {
    messageContent = (
      <>
        <div className={styles.message}>
          {message.sender !== authCtx.userId && (
            <div className={styles.name}>{senderUsername}:</div>
          )}
          <div>{message.content}</div>
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
        authCtx.userId === message.sender
          ? styles["your-message"]
          : styles["others-message"]
      }`}
    >
      {messageContent}
    </m.div>
  );
}
