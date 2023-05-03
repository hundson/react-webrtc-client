import React, { useState } from "react";
import cameraOnButtonImg from "../../../resources/images/cameraOn.svg";
import cameraOffButtonImg from "../../../resources/images/cameraOff.svg";

const CameraButton = () => {
  const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

  const cameraButtonHandler = () => {
    setIsLocalVideoDisabled(!isLocalVideoDisabled);
  };

  return (
    <div className="video_button_container">
      <img
        alt="camera-button"
        src={isLocalVideoDisabled ? cameraOffButtonImg : cameraOnButtonImg}
        className="video_button_image"
        onClick={cameraButtonHandler}
      />
    </div>
  );
};

export default CameraButton;
