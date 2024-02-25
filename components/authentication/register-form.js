import { useContext, useEffect, useState } from "react";
import useInput from "@/hook/use-input";
import { useRouter } from "next/navigation";

import { db, auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { AuthContext } from "@/store/auth-context";

import styles from "./register-form.module.css";
import { m } from "framer-motion";
import { FaBomb } from "react-icons/fa";

export default function RegisterForm({
  onClose,
  inputtedPassword,
  inputtedEmail,
}) {
  const router = useRouter();

  const [isExpired, setIsExpired] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => setIsExpired(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const {
    value: email,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
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
          setErrorMsg("⚠️ Email is registered already");
        }

        if (errorCode === "auth/invalid-email") {
          setErrorMsg("⚠️ Invalid Email");
        }

        if (errorCode === "auth/weak-password") {
          setErrorMsg("⚠️ Password is not strong enough");
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
                <FaBomb /> <span>Forgotten</span>
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
            That's good for gossiping 💩
          </m.div>
        </m.div>
      </div>
      <form className={styles.form} onSubmit={registerHandler}>
        <div className={styles["input-group"]}>
          <label htmlFor="register-email">Email</label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-email"
            type="email"
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && (
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
        <div className={styles["input-group"]}>
          <label htmlFor="register-password">Password</label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-password"
            type="password"
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordHasError && (
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", transition: 0.3 }}
              className={styles.error}
            >
              ⚠️ Invalid Password
            </m.div>
          )}
        </div>
        <div className={styles["input-group"]}>
          <label htmlFor="register-username">Username</label>
          <m.input
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            id="register-username"
            type="text"
            value={username}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
          />
          {usernameHasError && (
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", transition: 0.3 }}
              className={styles.error}
            >
              ⚠️ Invalid Username
            </m.div>
          )}
        </div>
        <m.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500 }}
          disabled={!formIsValid}
        >
          {!errorMsg ? "Register" : errorMsg}
        </m.button>
      </form>
    </div>
  );
}
