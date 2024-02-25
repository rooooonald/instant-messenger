import ReactDOM from "react-dom";

import styles from "./mobile-nav.module.css";
import { m } from "framer-motion";
import { CgClose } from "react-icons/cg";

const MobileNavContent = ({ content, onClose }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: "30%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "30%" }}
      transition={{ type: "spring", duration: 0.5 }}
      className={styles.content}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose}>
        <CgClose style={{ fontSize: "2rem" }} />
      </button>
      {content}
    </m.div>
  );
};

const Backdrop = ({ onClose }) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.backdrop}
      onClick={onClose}
    ></m.div>
  );
};

export default function MobileNav({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      <Backdrop onClose={onClose} />
      <MobileNavContent content={children} onClose={onClose} />
    </>,
    document.getElementById("mobile-nav")
  );
}
