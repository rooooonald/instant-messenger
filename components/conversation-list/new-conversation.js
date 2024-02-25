import { useState, useContext } from "react";
import useInput from "@/hook/use-input";
import { AuthContext } from "@/store/auth-context";

import Modal from "../ui/modal";

import styles from "./new-conversation.module.css";
import { FaCircleMinus, FaPlus } from "react-icons/fa6";
import { m } from "framer-motion";

export default function NewConversation({ onAddConversation, onClose }) {
  const [participantList, setParticipantList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const authCtx = useContext(AuthContext);

  const {
    value: title,
    hasError: titleHasError,
    valueIsValid: titleIsValid,
    valueChangeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
  } = useInput(
    (title) => title.trim().length !== 0 && title.trim().length <= 20
  );

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
      setErrorMsg("⚠️ Please add at least one participant");
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
              <div className={styles["input-group"]}>
                <label htmlFor="title">Group Name</label>
                <m.input
                  whileFocus={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  type="text"
                  id="title"
                  value={title}
                  onChange={titleChangeHandler}
                  onBlur={titleBlurHandler}
                  placeholder="Max. 20 Characters"
                />
                {titleHasError && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", transition: 0.3 }}
                    className={styles.error}
                  >
                    ⚠️ Invalid Group Name
                  </m.div>
                )}
              </div>
              <div className={styles["input-group"]}>
                <label htmlFor="title">Participant's Email</label>
                <div className={styles["participant-input-group"]}>
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
                    transition={{ duration: 0.5, type: "spring" }}
                    type="button"
                    onClick={addParticipantHandler}
                  >
                    <FaPlus style={{ fontSize: "1.25rem" }} />
                  </m.button>
                </div>
                {participantHasError && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", transition: 0.3 }}
                    className={styles.error}
                  >
                    ⚠️ Invalid Email
                  </m.div>
                )}
              </div>
              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                type="button"
                onClick={submitHandler}
                disabled={participantList.length < 1 || !titleIsValid}
              >
                Submit
              </m.button>
            </form>
          </m.div>
        </div>
        <div className={styles["participant-panel"]}>
          <h2>Participant List ({participantList.length})</h2>
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
                      <FaCircleMinus />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
