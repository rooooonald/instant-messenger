import { useContext, useEffect, useState } from "react";
import useInput from "@/hook/use-input";
import { useRouter } from "next/navigation";

import { db, auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { AuthContext } from "@/store/auth-context";

import styles from "./register-form.module.css";
import { m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

export default function RegisterForm({
  onClose,
  inputtedPassword,
  inputtedEmail,
}) {
  const router = useRouter();

  const [isExpired, setIsExpired] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => setIsExpired(true), 3000);

    return () => clearTimeout(timer);
  }, []);

  const {
    value: email,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    resetHandler: emailResetHandler,
    isTouched: emailIsTouched,
  } = useInput(
    (value) => value.trim().length !== 0 && value.includes("@"),
    inputtedEmail
  );

  const {
    value: username,
    valueIsValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
  } = useInput((value) => value.trim().length !== 0 && value.length <= 12);

  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim().length !== 0, inputtedPassword);

  const formIsValid = emailIsValid && passwordIsValid && usernameIsValid;

  const registerHandler = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(db, "users", `${user.uid}`), {
          email: user.email,
          username,
        });

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const foundUser = userDoc.data();
        authCtx.changeUserHandler({ userId: user.uid, ...foundUser });

        onClose();
        router.push("/messenger");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          setErrorMsg("❌ Error: Email is registered already! ❌");
        }

        if (errorCode === "auth/invalid-email") {
          setErrorMsg("❌ Error: Invalid Email! ❌");
        }

        if (errorCode === "auth/weak-password") {
          setErrorMsg("❌ Error: Password is not strong enough! ❌");
        }
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.intro}>
        <h1>Register</h1>
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
            You can set a timer to expire your message ... 🤭
          </m.div>
          <m.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 },
            }}
            className={`${styles.message2}  ${styles.message}`}
          >
            {isExpired ? (
              <div className={styles.expired}>
                <FontAwesomeIcon icon={faBomb} /> <span>Forgotten</span>
              </div>
            ) : (
              "Let's Chat! 🥳"
            )}
          </m.div>
          <m.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 },
            }}
            className={` ${styles.message3}  ${styles.message}`}
          >
            {errorMsg ? errorMsg : "That's good for gossiping 💩"}
          </m.div>
        </m.div>
      </div>
      <form className={styles.form} onSubmit={registerHandler}>
        <div className={styles["input-block"]}>
          <label htmlFor="register-email">
            {emailHasError && <span>Invalid </span>} Email
          </label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-email"
            type="email"
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
        </div>
        <div className={styles["input-block"]}>
          <label htmlFor="register-password">
            {passwordHasError && <span>Invalid</span>} Password
          </label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-password"
            type="password"
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
        </div>
        <div className={styles["input-block"]}>
          <label htmlFor="register-username">
            {usernameHasError && <span>Invalid </span>} Username
          </label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-username"
            type="text"
            value={username}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
          />
        </div>
        <m.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500 }}
          className={`${styles["submit-button"]} ${
            !formIsValid ? styles.disabled : ""
          }`}
          disabled={!formIsValid}
        >
          Register
        </m.button>
      </form>
    </div>
  );
}
