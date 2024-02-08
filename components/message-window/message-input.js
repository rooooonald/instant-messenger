import { useContext, useRef } from "react";
import useInput from "@/hook/use-input";
import { AuthContext } from "@/store/auth-context";

import styles from "./message-input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { m } from "framer-motion";

export default function MessageInput({ id, onSend }) {
  const contentRef = useRef();

  const {
    value: timeAllowed,
    valueChangeHandler: timeAllowedChangeHandler,
    blurHandler: timeAllowedBlurHandler,
    hasError: timeAllowedHasError,
  } = useInput(
    (timeAllowed) => +timeAllowed >= 5 || timeAllowed.trim().length === 0
  );

  const authCtx = useContext(AuthContext);

  const clickHandler = (e) => {
    e && e.preventDefault();

    const enteredMessage = contentRef.current.value;
    if (
      !enteredMessage ||
      enteredMessage.trim().length === 0 ||
      timeAllowedHasError
    ) {
      return;
    }

    const sendTime = Date.now();
    onSend(id, {
      sender: authCtx.userId,
      content: enteredMessage,
      sendTime,
      timeAllowed: timeAllowed ? +timeAllowed * 1000 : 10000,
    });
    contentRef.current.value = "";
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      clickHandler();
    }
  };

  return (
    <div className={styles.wrapper}>
      <m.textarea
        initial={{ scale: 0.95 }}
        whileFocus={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
        className={styles.input}
        type="text"
        id="message"
        ref={contentRef}
        onKeyDown={keyDownHandler}
      ></m.textarea>

      <div className={styles["submit-box"]}>
        <div className={styles["time-input"]}>
          <label htmlFor="message-time-allowed">Forgotten in</label>
          <input
            id="message-time-allowed"
            type="number"
            value={timeAllowed}
            onChange={timeAllowedChangeHandler}
            onBlur={timeAllowedBlurHandler}
            placeholder="10"
            min={5}
          ></input>
          <span>s</span>
        </div>
        <m.button
          whileHover={{ backgroundColor: "var(--fourth-color)" }}
          className={styles["submit-btn"]}
          onClick={clickHandler}
          disabled={timeAllowedHasError}
        >
          {timeAllowedHasError ? (
            "Invalid Time (Min. 5s)"
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
          )}
        </m.button>
      </div>
    </div>
  );
}
