import { useState, useContext } from "react";
import useInput from "@/hook/use-input";
import { AuthContext } from "@/store/auth-context";

import Modal from "../ui/modal";

import styles from "./new-conversation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { m } from "framer-motion";

export default function NewConversation({ onAddConversation, onClose }) {
  const [participantList, setParticipantList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const authCtx = useContext(AuthContext);

  const {
    value: title,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
  } = useInput((title) => title.trim().length !== 0);

  const validateParticipantInput = (participant) => {
    return (
      participant.trim().length !== 0 &&
      participant.includes("@") &&
      participant.trim() !== authCtx.userEmail &&
      !participantList.includes(participant)
    );
  };

  const {
    value: participant,
    hasError: participantHasError,
    valueChangeHandler: participantChangeHandler,
    blurHandler: participantBlurHandler,
    resetHandler: participantResetHandler,
  } = useInput(validateParticipantInput);

  function addParticipantHandler() {
    if (participantHasError) {
      return;
    }

    setParticipantList((prev) => [...prev, participant]);
    participantResetHandler();
  }

  function removeHandler(removedParticipant) {
    setParticipantList((prev) => {
      return prev.filter((participant) => participant !== removedParticipant);
    });
  }

  function submitHandler() {
    if (participantList.length < 1) {
      setErrorMsg("❌ Please add at least one participant! ❌");
      return;
    }
    onAddConversation({
      title,
      participants: [authCtx.userEmail, ...participantList],
    });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          <h1>New Conversation</h1>
          <m.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.5,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className={styles["message-list"]}
          >
            <m.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
              }}
              className={`${styles.message1}  ${styles.message}`}
            >
              Add your friend's email to chat with them! 🫂
            </m.div>
            <m.div
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
              }}
              className={`${styles.message2}  ${styles.message}`}
            >
              {errorMsg
                ? errorMsg
                : "Please make sure your friend's email is also registered. 🤭"}
            </m.div>
            <form className={styles.form} onSubmit={submitHandler}>
              <div className={styles["input-block"]}>
                <label htmlFor="title">
                  {titleHasError && <span>Invalid</span>} Group Name
                </label>
                <m.input
                  whileFocus={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  type="text"
                  id="title"
                  value={title}
                  onChange={titleChangeHandler}
                  onBlur={titleBlurHandler}
                />
              </div>
              <div className={styles["input-block"]}>
                <label htmlFor="title">
                  {participantHasError && <span>Invalid</span>} Participant's
                  Email
                </label>
                <div className={styles["participant-input-block"]}>
                  <m.input
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    type="text"
                    id="participant"
                    value={participant}
                    onChange={participantChangeHandler}
                    onBlur={participantBlurHandler}
                    placeholder="abc@gmail.com"
                  />
                  <m.button
                    whileHover={{
                      rotate: 360,
                    }}
                    transition={{ duration: 1, type: "spring" }}
                    type="button"
                    onClick={addParticipantHandler}
                  >
                    <FontAwesomeIcon icon={faPlus} size="xl" />
                  </m.button>
                </div>
              </div>
            </form>
          </m.div>
        </div>
        <div className={styles["participant-panel"]}>
          <div className={styles["participant-list"]}>
            {participantList &&
              participantList.map((participant) => {
                return (
                  <div key={participant} className={styles["participant-tag"]}>
                    <p>{participant}</p>
                    <button
                      type="button"
                      onClick={() => removeHandler(participant)}
                    >
                      <FontAwesomeIcon icon={faCircleMinus} />
                    </button>
                  </div>
                );
              })}
          </div>
          <m.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            onClick={submitHandler}
            className={`${styles["submit-button"]} ${
              participantList.length < 1 ? styles.disabled : ""
            }`}
            disabled={participantList.length < 1}
          >
            Submit
          </m.button>
        </div>
      </div>
    </Modal>
  );
}
