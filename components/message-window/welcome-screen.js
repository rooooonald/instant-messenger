import styles from "./welcome-screen.module.css";

import { FaCommentMedical } from "react-icons/fa";

export default function WelcomeScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <h1>
          What are you waiting for? <br />
          Press <FaCommentMedical /> to start a new conversation!
        </h1>
      </div>
    </div>
  );
}
