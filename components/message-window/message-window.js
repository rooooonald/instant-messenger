import { useState } from "react";

import MessageOutput from "./message-output";
import MessageInput from "./message-input";
import Modal from "../ui/modal";
import ConversationParticipantList from "./conversation-participants";

import styles from "./message-window.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, m } from "framer-motion";

export default function MessageWindow({ conversation, onSend }) {
  const [showParticipantListModal, setShowParticipantListModal] =
    useState(false);

  const showParticipantListHandler = () => {
    setShowParticipantListModal(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["title-container"]}>
        <m.p
          key={conversation.title}
          initial={{ x: 40, y: -200, rotate: 90 }}
          animate={{ x: 40, y: 0, rotate: 90 }}
          className={styles.title}
        >
          {conversation.title}
        </m.p>
        <div className={styles["participants-list-btn"]}>
          <FontAwesomeIcon
            icon={faUsers}
            size="xl"
            style={{ position: "absolute", bottom: "20px", cursor: "pointer" }}
            onClick={showParticipantListHandler}
          />
        </div>
      </div>
      <m.div
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1 }}
        className={styles["message-window"]}
      >
        <MessageOutput
          title={conversation.title}
          messages={conversation.messages}
        />
        <MessageInput id={conversation.id} onSend={onSend} />
      </m.div>
      <AnimatePresence>
        {showParticipantListModal && (
          <Modal
            onClose={() => {
              setShowParticipantListModal(false);
            }}
          >
            <ConversationParticipantList
              participants={conversation.participants}
              title={conversation.title}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
