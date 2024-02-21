import { useContext, useState, useEffect } from "react";
import useInput from "@/hook/use-input";
import { redirect, useRouter } from "next/navigation";
import { AuthContext } from "@/store/auth-context";

import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import NewConversation from "./new-conversation";

import styles from "./conversation-nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, m } from "framer-motion";

export default function ConversationNav({ onAddConversation }) {
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [showChangeUsernameInstruction, setShowChangeUsernameInstruction] =
    useState(false);
  const [currentUsername, setCurrentUsername] = useState(null);

  const router = useRouter();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.userId) {
      onSnapshot(doc(db, "users", authCtx.userId), (userDoc) => {
        const foundUser = userDoc.data();
        setCurrentUsername(foundUser.username);
      });
    }
  }, [authCtx]);

  const {
    value: username,
    valueChangeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    hasError: usernameHasError,
  } = useInput(
    (username) => username.trim().length !== 0,
    currentUsername ? currentUsername : authCtx.username
  );

  const showModalHandler = () => {
    setShowNewConvoModal((prev) => !prev);
  };

  const signOutHandler = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        return;
      });

    redirect("/");
  };

  const changeUsernameHandler = async () => {
    if (usernameHasError || username === currentUsername) {
      setIsChangingUsername(false);
      setShowChangeUsernameInstruction(false);
      return;
    }

    const userRef = doc(db, "users", authCtx.userId);
    await updateDoc(userRef, {
      username,
    });
    setIsChangingUsername(false);
    setShowChangeUsernameInstruction(false);
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      changeUsernameHandler();
    }
  };

  return (
    <m.div
      whileHover={{
        x: 10,
        // scale: 1.05,
      }}
      transition={{ duration: 0.5 }}
      className={styles.wrapper}
    >
      {isChangingUsername ? (
        <m.input
          whileFocus={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500 }}
          id="change-username"
          type="text"
          value={username}
          className={styles["change-username-input"]}
          onChange={(e) => {
            usernameChangeHandler(e);
            usernameBlurHandler(e);
          }}
          onBlur={changeUsernameHandler}
          onKeyDown={keyDownHandler}
        />
      ) : (
        <m.h1
          whileHover={{ fontWeight: 400 }}
          transition={{ duration: 1 }}
          className={styles.username}
          onClick={() => setIsChangingUsername(true)}
          onMouseOver={() => setShowChangeUsernameInstruction(true)}
          onMouseOut={() => setShowChangeUsernameInstruction(false)}
        >
          {showChangeUsernameInstruction
            ? "Click to change username."
            : `Welcome, ${currentUsername}!`}
        </m.h1>
      )}

      <div className={styles["btn-group"]}>
        <button onClick={signOutHandler}>
          <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
        </button>
        <button onClick={showModalHandler}>
          <FontAwesomeIcon icon={faCommentMedical} size="xl" />
        </button>
      </div>
      <AnimatePresence>
        {showNewConvoModal && (
          <NewConversation
            onAddConversation={onAddConversation}
            onClose={showModalHandler}
          />
        )}
      </AnimatePresence>
    </m.div>
  );
}
