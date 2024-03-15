import ConversationParticipantTag from "./conversation-participant-tag";
import styles from "./conversation-participants.module.css";
import { m } from "framer-motion";

export default function ConversationParticipantList({ participants, title }) {
  return (
    <div className={styles.wrapper}>
      <h1>Participants</h1>
      <h2>{title}</h2>
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
        className={styles["participant-list"]}
      >
        {participants.map((participant) => (
          <ConversationParticipantTag
            key={participant}
            participant={participant}
          />
        ))}
      </m.div>
    </div>
  );
}
