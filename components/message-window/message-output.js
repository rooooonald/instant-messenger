import { useEffect, useRef, useState } from "react";

import MessageBox from "./message-box";

import styles from "./message-output.module.css";

export default function MessageOutput({ messages, title }) {
  const messageListRef = useRef();
  const [lastMessage, setLastMessage] = useState();

  useEffect(() => {
    const lastMessage = messageListRef.current?.lastElementChild;
    setLastMessage(lastMessage);
  }, [messages]);

  useEffect(() => {
    if (lastMessage) {
      lastMessage?.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, [lastMessage]);

  return (
    <div className={styles.wrapper} ref={messageListRef}>
      {messages.map((message, i) => {
        return <MessageBox key={i} title={title} message={message} />;
      })}
    </div>
  );
}
