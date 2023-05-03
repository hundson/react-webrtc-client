import React from "react";

const LeaveCallButton = () => {
  const leaveCallHandler = () => {
    const siteURL = window.location.origin + "/react-webrtc-client";
    window.location.href = siteURL;
  };

  return (
    <div className="video_button_container">
      <button className="video_button_end" onClick={leaveCallHandler}>
        Leave Call
      </button>
    </div>
  );
};

export default LeaveCallButton;
