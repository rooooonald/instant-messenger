import { useEffect, useState } from "react";

import ConversationNav from "./conversation-nav";
import ConversationList from "./conversation-list";
import MobileNav from "../ui/mobile-nav";

import styles from "./conversation-panel.module.css";
import { AnimatePresence, m } from "framer-motion";
import { IoChatbubbleEllipses } from "react-icons/io5";

export default function ConversationPanel({
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
        <ConversationList
          list={list}
          activeId={activeId}
          onSelectConversation={onSelectConversation}
        />
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
              <ConversationList
                list={list}
                activeId={activeId}
                onSelectConversation={onSelectConversation}
                onCloseMobileNav={() => setShowMobileNav(false)}
              />
            </m.div>
          </MobileNav>
        )}
      </AnimatePresence>
    </>
  );
}
