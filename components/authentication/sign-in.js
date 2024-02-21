"use client";

import { useContext, useState } from "react";
import useInput from "@/hook/use-input";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthContext } from "@/store/auth-context";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import Modal from "../ui/modal";
import RegisterForm from "./register-form";
import TestAccInfo from "./test-acc-info";

import styles from "./sign-in.module.css";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";

export default function SignIn() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTestAccModal, setShowTestAccModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const authCtx = useContext(AuthContext);

  const {
    value: email,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    resetHandler: emailResetHandler,
  } = useInput((value) => value.trim().length !== 0 && value.includes("@"));

  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    resetHandler: passwordResetHandler,
  } = useInput((value) => value.trim().length !== 0);

  const signInHandler = () => {
    if (emailHasError || passwordHasError) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {})
      .catch((error) => {
        const errorCode = error.code;
        console.log(error);
        if (errorCode === "auth/invalid-credential") {
          setErrorMsg("⚠️ Incorrect Email/Password ... What's wrong with you?");
        }

        if (errorCode === "auth/invalid-email") {
          setErrorMsg("⚠️ Invalid Email! What's wrong with you?");
        }

        if (errorCode === "auth/missing-password") {
          setErrorMsg("⚠️ Missing Password! What's wrong with you?");
        }
      });
  };

  if (authCtx.userId) {
    return redirect("/messenger");
  }
  const formIsValid = emailIsValid && passwordIsValid;
  const decorativeText = "BLAH!".repeat(50);

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <m.p
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles["decorative-text"]}
          >
            {decorativeText}
          </m.p>
        </div>
        <div className={styles["signin-body"]}>
          <Image src={"/logo-home.svg"} alt="Logo" width={200} height={200} />
          {errorMsg ? (
            <h1>{errorMsg}</h1>
          ) : (
            <h1>WHAT'S SAID HERE, FORGOTTEN HERE</h1>
          )}

          <div className={styles["signin-form"]}>
            <div className={styles["input-block"]}>
              <div className={styles["input-group"]}>
                <div>
                  <label htmlFor="email">Email</label>
                  <m.input
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    id="email"
                    type="email"
                    value={email}
                    onChange={emailChangeHandler}
                    onBlur={emailBlurHandler}
                  />
                </div>
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
                <div>
                  <label htmlFor="password">Password</label>
                  <m.input
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    id="password"
                    type="password"
                    value={password}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                  />
                </div>
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
            </div>
            <div className={styles["btn-group"]}>
              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={`${styles["signin-button"]} ${
                  !formIsValid ? styles.disabled : ""
                }`}
                onClick={signInHandler}
                disabled={!formIsValid}
              >
                Sign In
              </m.button>
              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={styles["register-button"]}
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </m.button>
              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={styles["test-acc-button"]}
                onClick={() => setShowTestAccModal(true)}
              >
                Trial Accounts
              </m.button>
            </div>
          </div>

          <AnimatePresence>
            {showRegisterModal && (
              <Modal
                onClose={() => {
                  setShowRegisterModal(false);
                }}
              >
                <RegisterForm
                  onClose={() => {
                    setShowRegisterModal(false);
                  }}
                  inputtedEmail={email}
                  inputtedPassword={password}
                />
              </Modal>
            )}
            {showTestAccModal && (
              <Modal
                onClose={() => {
                  setShowTestAccModal(false);
                }}
              >
                <TestAccInfo
                  onClose={() => {
                    setShowTestAccModal(false);
                  }}
                />
              </Modal>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.bottom}>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={styles["decorative-text"]}
          >
            {decorativeText}
          </m.p>
        </div>
      </div>
    </LazyMotion>
  );
}
