import { useRef } from "react";

import styles from "./file-input.module.css";
import { m } from "framer-motion";

export default function FileInput({ onImageSelected }) {
  const inputRef = useRef();

  const onChangeHandler = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function (e) {
        onImageSelected(reader.result);
      };
    }
  };

  const onChooseImg = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onChangeHandler}
        style={{ display: "none" }}
      />

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className={styles.button}
        onClick={onChooseImg}
      >
        Choose Image
      </m.button>
    </div>
  );
}
