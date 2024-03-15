import { useEffect, useState } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

import styles from "./conversation-participant-tag.module.css";
import { m } from "framer-motion";

export default function ConversationParticipantTag({ participant }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), where("email", "==", participant));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsername(doc.data().username);
      });
    });
  }, [participant]);

  return (
    <m.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
      whileHover={{ scale: 1.05 }}
      className={styles.wrapper}
    >
      <p>{username}</p>
      <p>{participant}</p>
    </m.div>
  );
}
