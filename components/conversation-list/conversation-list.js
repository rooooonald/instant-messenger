import { useEffect, useState } from "react";

import ConversationThumbnail from "./conversation-thumbnail";
import ConversationNav from "./conversation-nav";

import styles from "./conversation-list.module.css";
import { AnimatePresence, m } from "framer-motion";
import { IoChatbubbleEllipses } from "react-icons/io5";
import MobileNav from "../ui/mobile-nav";

export default function ConversationList({
  list,
  activeId,
  onSelectConversation,
  onAddConversation,
}) {
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => setShowMobileNav(false));
    return () =>
      window.addEventListener("resize", () => setShowMobileNav(false));
  }, []);

  return (
    <>
      <m.div layout className={styles.wrapper}>
        <ConversationNav onAddConversation={onAddConversation} />
        {list.map((conversation, i) => (
          <ConversationThumbnail
            key={conversation.id}
            id={conversation.id}
            activeId={activeId}
            onSelectConversation={onSelectConversation}
            title={conversation.title}
            participants={conversation.participants}
            lastMessage={
              conversation.messages.length !== 0 &&
              conversation.messages[conversation.messages.length - 1]
            }
          />
        ))}
      </m.div>
      <div className={styles["mobile-nav"]}>
        <button className="gradient-bg" onClick={() => setShowMobileNav(true)}>
          <IoChatbubbleEllipses /> Chats
        </button>
      </div>
      <AnimatePresence>
        {showMobileNav && (
          <MobileNav onClose={() => setShowMobileNav(false)}>
            <m.div layout className={styles["wrapper-mobile"]}>
              <ConversationNav onAddConversation={onAddConversation} />
              {list.map((conversation, i) => (
                <ConversationThumbnail
                  key={conversation.id}
                  id={conversation.id}
                  activeId={activeId}
                  onSelectConversation={onSelectConversation}
                  onCloseMobileNav={() => setShowMobileNav(false)}
                  title={conversation.title}
                  participants={conversation.participants}
                  lastMessage={
                    conversation.messages.length !== 0 &&
                    conversation.messages[conversation.messages.length - 1]
                  }
                />
              ))}
            </m.div>
          </MobileNav>
        )}
      </AnimatePresence>
    </>
  );
}
