import styles from "./test-acc-info.module.css";
import { m } from "framer-motion";

export default function TestAccInfo({ onClose }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div>
          <h1>Trial Accounts</h1>
          <p>
            In case you don't want to set up any accounts, here we provide you
            with 2 trial accounts for testing purpose.
          </p>
        </div>
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
            <ul>
              <li>✉️ test1@gmail.com</li>
              <li>🗝️ 123456</li>
            </ul>
          </m.div>

          <m.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 },
            }}
            className={` ${styles.message2}  ${styles.message}`}
          >
            <ul>
              <li>✉️ test2@gmail.com</li>
              <li>🗝️ 654321</li>
            </ul>
          </m.div>
        </m.div>

        <m.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500 }}
          className={styles["close-button"]}
          onClick={onClose}
        >
          Close
        </m.button>
      </div>
    </div>
  );
}
