import { StartingConvoIcon } from "../ui/svg-lib";
import styles from "./starting.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

export default function Starting() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <StartingConvoIcon width="150" />
        <h1>
          What are you waiting for? <br />
          Press <FontAwesomeIcon icon={faCommentMedical} size="sm" /> to start a
          new conversation!
        </h1>
      </div>
    </div>
  );
}
