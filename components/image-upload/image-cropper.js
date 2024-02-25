import { useState } from "react";
import Cropper from "react-easy-crop";

import styles from "./image-cropper.module.css";
import { m } from "framer-motion";

export default function ImageCropper({ image, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };

  const aspectRatios = [
    { value: 1 / 1, text: "1:1" },
    { value: 5 / 4, text: "5:4" },
    { value: 4 / 3, text: "4:3" },
    { value: 3 / 2, text: "3:2" },
    { value: 5 / 3, text: "5:3" },
    { value: 16 / 9, text: "16:9" },
    { value: 3 / 1, text: "3:1" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.cropper}>
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            },
          }}
        />
      </div>
      <div className={styles["action-btns"]}>
        <div className={styles["aspect-ratios"]} onChange={onAspectRatioChange}>
          {aspectRatios.map((ratio) => (
            <div>
              <input type="radio" value={ratio.value} name="ratio" />{" "}
              {ratio.text}
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <m.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            type="button"
            className={styles.button}
            onClick={onCropCancel}
          >
            Cancel
          </m.button>

          <m.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
            type="button"
            className={styles.button}
            onClick={() => {
              onCropDone(croppedArea);
            }}
          >
            Done
          </m.button>
        </div>
      </div>
    </div>
  );
}
