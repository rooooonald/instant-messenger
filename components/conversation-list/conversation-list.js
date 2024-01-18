import ConversationThumbnail from "./conversation-thumbnail";
import ConversationNav from "./conversation-nav";

import styles from "./conversation-list.module.css";
import { m } from "framer-motion";

export default function ConversationList({
  list,
  activeId,
  onSelectConversation,
  onAddConversation,
}) {
  return (
    <m.div layout className={styles.wrapper}>
      <ConversationNav onAddConversation={onAddConversation} />
      {list.map((conversation, i) => (
        <ConversationThumbnail
          key={conversation.id}
          id={conversation.id}
          activeId={activeId}
          onSelectConversation={onSelectConversation}
          backgroundColorIndex={i}
          title={conversation.title}
          participants={conversation.participants}
          lastMessage={
            conversation.messages.length !== 0 &&
            conversation.messages[conversation.messages.length - 1]
          }
        />
      ))}
    </m.div>
  );
}
