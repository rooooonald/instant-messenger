import { useEffect, useRef } from "react";

import MessageBox from "./message-box";

import styles from "./message-output.module.css";

export default function MessageOutput({ messages, title }) {
  const messageListRef = useRef();

  useEffect(() => {
    const lastMessage = messageListRef.current?.lastElementChild;
    lastMessage?.scrollIntoView({ behavior: "instant", block: "end" });
  }, [messages]);

  return (
    <div className={styles.wrapper} ref={messageListRef}>
      {messages.map((message, i) => {
        return <MessageBox key={i} title={title} message={message} />;
      })}
    </div>
  );
}
