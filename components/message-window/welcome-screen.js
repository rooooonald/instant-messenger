import { useState } from "react";

import NewConversation from "../conversation-list/new-conversation";

import styles from "./welcome-screen.module.css";
import { m } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { FaCommentMedical } from "react-icons/fa";
import Image from "next/image";

export default function WelcomeScreen({ onAddConversation }) {
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Image
        src={"/logo-home.svg"}
        alt="Logo"
        width={50}
        height={50}
        className={styles.logo}
        style={{ margin: "0 auto" }}
      />
      <h1>What are you waiting for?</h1>
      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewConvoModal(true)}
      >
        <FaCommentMedical /> Start a conversation
      </m.button>
      <AnimatePresence>
        {showNewConvoModal && (
          <NewConversation
            onAddConversation={onAddConversation}
            onClose={() => setShowNewConvoModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
