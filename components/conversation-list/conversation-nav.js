import { useContext, useState, useEffect } from "react";
import useInput from "@/hook/use-input";
import { redirect } from "next/navigation";
import { AuthContext } from "@/store/auth-context";

import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import NewConversation from "./new-conversation";

import styles from "./conversation-nav.module.css";
import { FaRightFromBracket, FaCommentMedical } from "react-icons/fa6";
import { AnimatePresence, m } from "framer-motion";

export default function ConversationNav({ onAddConversation }) {
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [showChangeUsernameInstruction, setShowChangeUsernameInstruction] =
    useState(false);
  const [currentUsername, setCurrentUsername] = useState(null);

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
    <div className={styles.wrapper}>
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
        <div
          className={styles.username}
          onClick={() => setIsChangingUsername(true)}
          onMouseOver={() => setShowChangeUsernameInstruction(true)}
          onMouseOut={() => setShowChangeUsernameInstruction(false)}
        >
          {showChangeUsernameInstruction ? (
            <p>Click to change username</p>
          ) : (
            <>
              <p>Welcome</p> <p>{currentUsername}</p>
            </>
          )}
        </div>
      )}

      <div className={styles["btn-group"]}>
        <button onClick={signOutHandler}>
          <FaRightFromBracket style={{ fontSize: "1.25rem" }} />
        </button>
        <button onClick={() => setShowNewConvoModal(true)}>
          <FaCommentMedical style={{ fontSize: "1.25rem" }} />
        </button>
      </div>
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
