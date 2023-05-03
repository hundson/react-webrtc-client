import React from "react";
import CameraButton from "./CameraButton";
import LeaveCallButton from "./LeaveCallButton";

const VideoButtons = (props) => {
  return (
    <div className="video_buttons_container">
      <CameraButton />
      <LeaveCallButton />
    </div>
  );
};

export default VideoButtons;
