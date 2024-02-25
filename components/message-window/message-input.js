import { useContext, useEffect, useRef, useState } from "react";
import useInput from "../../hook/use-input";
import { AuthContext } from "../../store/auth-context";

import FileInput from "../image-upload/file-input";
import ImageCropper from "../image-upload/image-cropper";
import Modal from "../ui/modal";

import styles from "./message-input.module.css";
import { BsSendFill } from "react-icons/bs";
import { LuTextCursorInput } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { IoResizeOutline } from "react-icons/io5";
import { AnimatePresence, m } from "framer-motion";

export default function MessageInput({ id, onSend }) {
  const [mode, setMode] = useState("text");

  const contentRef = useRef();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (mode === "text") {
      onCropCancel();
      contentRef.current.focus();
    }
  }, [mode, id]);

  // Image choosing starts //

  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState("");

  // Invoked when new image file is selected
  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setCurrentPage("crop-img");
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj = new Image();
    imageObj.src = image;
    imageObj.onload = function () {
      context.drawImage(
        imageObj,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImgAfterCrop(dataURL);
      setCurrentPage("img-cropped");
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  // Image choosing done //

  const {
    value: timeAllowed,
    valueChangeHandler: timeAllowedChangeHandler,
    blurHandler: timeAllowedBlurHandler,
    valueIsValid: timeAllowedIsValid,
    hasError: timeAllowedHasError,
  } = useInput((timeAllowed) => timeAllowed && +timeAllowed >= 5, 10);

  const sendHandler = (e) => {
    e?.preventDefault();

    if (mode === "text") {
      const enteredMessage = contentRef.current.value;

      if (
        !enteredMessage ||
        enteredMessage.trim().length === 0 ||
        timeAllowedHasError
      ) {
        return;
      }

      const sendTime = Date.now();
      onSend(id, {
        sender: authCtx.userId,
        content: enteredMessage,
        isImage: false,
        sendTime,
        timeAllowed: timeAllowed ? +timeAllowed * 1000 : 10000,
      });
      contentRef.current.value = "";
    }

    if (mode === "image") {
      if (!imgAfterCrop || timeAllowedHasError) {
        return;
      }

      const sendTime = Date.now();
      onSend(id, {
        sender: authCtx.userId,
        content: imgAfterCrop,
        isImage: true,
        sendTime,
        timeAllowed: timeAllowed ? +timeAllowed * 1000 : 10000,
      });
      setCurrentPage("choose-img");
    }
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendHandler();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["message-controls"]}>
        <button
          onClick={() => setMode("text")}
          className={mode === "text" ? styles.active : undefined}
        >
          <LuTextCursorInput style={{ fontSize: "1.25rem" }} />
        </button>
        <button
          onClick={() => setMode("image")}
          className={mode === "image" ? styles.active : undefined}
        >
          <LuImage style={{ fontSize: "1.25rem" }} />
        </button>
        <div className={styles["time-input"]}>
          <label htmlFor="message-time-allowed">Forgotten in</label>
          <div>
            <input
              id="message-time-allowed"
              type="number"
              value={timeAllowed}
              onChange={timeAllowedChangeHandler}
              onBlur={timeAllowedBlurHandler}
              min={5}
            ></input>{" "}
            <span>s</span>
          </div>
          <AnimatePresence>
            {timeAllowedHasError && (
              <m.div
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 375 }}
                exit={{ scale: 0, opacity: 0, rotate: 0 }}
                className={styles["time-input-error"]}
              >
                <p>
                  Min. <span>5"</span>
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles["message-input"]}>
        {mode === "text" && (
          <textarea
            id="message"
            ref={contentRef}
            className={styles.input}
            onKeyDown={keyDownHandler}
          ></textarea>
        )}

        {mode === "image" && currentPage === "choose-img" && (
          <div className={styles["image-section"]}>
            <FileInput setImage={setImage} onImageSelected={onImageSelected} />
            <img
              src="/images/image-section.svg"
              alt="photographer"
              className={styles["image-section-decorative-graphic"]}
            />
          </div>
        )}
        {mode === "image" && currentPage === "crop-img" && (
          <Modal onClose={() => setCurrentPage("choose-img")}>
            <ImageCropper
              image={image}
              onCropDone={onCropDone}
              onCropCancel={onCropCancel}
            />
          </Modal>
        )}
        {mode === "image" && currentPage === "img-cropped" && (
          <div className={styles["image-section"]}>
            <img src={imgAfterCrop} className={styles["cropped-img"]} />

            <div className={styles["cropped-control"]}>
              <m.button
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "tween" }}
                whileHover={{ backgroundColor: "var(--fourth-color)" }}
                onClick={() => {
                  setCurrentPage("crop-img");
                }}
              >
                <IoResizeOutline size="1.25rem" /> Resize
              </m.button>

              <m.button
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "tween" }}
                whileHover={{ backgroundColor: "var(--fourth-color)" }}
                onClick={() => {
                  setCurrentPage("choose-img");
                  setImage("");
                }}
              >
                <LuImage style={{ fontSize: "1.25rem" }} /> New Image
              </m.button>
            </div>
          </div>
        )}

        <m.button
          whileHover={{ backgroundColor: "var(--fourth-color)" }}
          className={styles["submit-btn"]}
          onClick={sendHandler}
          disabled={!timeAllowedIsValid}
        >
          <BsSendFill style={{ fontSize: "1.25rem" }} />
        </m.button>
      </div>
    </div>
  );
}
