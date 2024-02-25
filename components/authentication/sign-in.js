"use client";

import { useContext, useEffect, useState } from "react";
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
  } = useInput((value) => value.trim().length !== 0 && value.includes("@"));

  const {
    value: password,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
  } = useInput((value) => value.trim().length !== 0);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const signInHandler = () => {
    if (emailHasError || passwordHasError) {
      return;
    }

    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      console.log(error);
      if (errorCode === "auth/invalid-credential") {
        setErrorMsg("⚠️ Incorrect Email/Password");
      }

      if (errorCode === "auth/invalid-email") {
        setErrorMsg("⚠️ Invalid Email");
      }

      if (errorCode === "auth/missing-password") {
        setErrorMsg("⚠️ Missing Password");
      }
    });
  };

  if (authCtx.status === "authenticated") {
    return redirect("/messenger");
  }
  const formIsValid = emailIsValid && passwordIsValid;
  const decorativeText = "BLAH!".repeat(50);

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.wrapper}>
        <m.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.top}
        >
          <p className={`${styles["decorative-text"]} gradient-bg`}>
            {decorativeText}
          </p>
        </m.div>
        <div className={styles["signin-body"]}>
          <form className={styles["signin-form"]}>
            <Image
              src={"/logo-home.svg"}
              alt="Logo"
              width={150}
              height={150}
              className={styles["shown-in-mobile"]}
              style={{ margin: "0 auto" }}
            />
            <h1>FORGOTTEN MESSENGER</h1>
            <div className={styles["input-section"]}>
              <div className={styles["input-group"]}>
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
            <div className={styles["button-group"]}>
              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                type="button"
                className={styles["signin-button"]}
                onClick={signInHandler}
                disabled={!formIsValid}
              >
                {!errorMsg ? "Sign In" : errorMsg}
              </m.button>

              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                type="button"
                className={styles["test-acc-button"]}
                onClick={() => setShowTestAccModal(true)}
              >
                Trial
              </m.button>

              <m.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500 }}
                className={`${styles["register-button"]} ${styles["shown-in-mobile"]}`}
                type="button"
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </m.button>
            </div>
          </form>

          <div className={styles["registration-panel"]}>
            <Image src={"/logo-home.svg"} alt="Logo" width={150} height={150} />
            <h2>WHAT'S SAID HERE, FORGOTTEN HERE</h2>
            <m.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500 }}
              className={styles["register-button"]}
              onClick={() => setShowRegisterModal(true)}
            >
              Register
            </m.button>
          </div>
          <m.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.bottom}
          >
            <p className={`${styles["decorative-text"]} gradient-bg`}>
              {decorativeText}
            </p>
          </m.div>
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
    </LazyMotion>
  );
}
