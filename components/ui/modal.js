import ReactDOM from "react-dom";

import styles from "./modal.module.css";
import { m } from "framer-motion";

const ModalContent = ({ content }) => {
  return (
    <m.div
      initial={{ opacity: 0, x: "-50%", y: "-40%" }}
      animate={{ opacity: 1, x: "-50%", y: "-50%" }}
      exit={{
        opacity: 0,
        x: "-50%",
        y: "-40%",
        borderRadius: 0,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring" }}
      className={styles.modal}
      onClick={(e) => e.stopPropagation()}
    >
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

export default function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      <Backdrop onClose={onClose} />
      <ModalContent content={children} />
    </>,
    document.getElementById("backdrop")
  );
}
