import React, { useEffect } from "react";
import ParticipantsSection from "./participantsSection/ParticipantsSection";
import VideoSection from "./videoSection/VideoSection";
import CallLabel from "./CallLabel";
import { connect } from "react-redux";
import * as webRTCHandler from "../../utils/webRTCHandler";
import LoadingOverlay from "./LoadingOverlay";
import "./Call.css";

const Call = ({ callID, identity, isCallHost, showLoadingOverlay }) => {
  useEffect(() => {
    webRTCHandler.getLocalPreviewAndInitCallConnection(
      isCallHost,
      identity,
      callID
    );
  }, []);

  return (
    <div className="call_container">
      <ParticipantsSection />
      <VideoSection />
      <CallLabel callID={callID} />
      {showLoadingOverlay && <LoadingOverlay />}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(Call);
