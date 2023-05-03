import { setShowLoadingOverlay } from "../store/actions";
import store from "../store/store";
import * as wss from "./wss";
import Peer from "simple-peer";

const defaultConstraints = {
  audio: false,
  video: {
    width: "480",
    height: "360",
  },
};

let localStream;

export const getLocalPreviewAndInitCallConnection = async (
  isCallHost,
  identity,
  callID = null
) => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      localStream = stream;
      showLocalVideoPreview(localStream);

      store.dispatch(setShowLoadingOverlay(false));

      isCallHost ? wss.createCall(identity) : wss.joinCall(identity, callID);
    })
    .catch((err) => {
      console.log("Fail to access local stream");
      console.log(err);
    });
};

let peers = {};
let streams = [];

const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:a.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: "1e845039e49ee8c52cf102ef",
        credential: "kIyLpMJOFcmNx5g/",
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: "1e845039e49ee8c52cf102ef",
        credential: "kIyLpMJOFcmNx5g/",
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: "1e845039e49ee8c52cf102ef",
        credential: "kIyLpMJOFcmNx5g/",
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "1e845039e49ee8c52cf102ef",
        credential: "kIyLpMJOFcmNx5g/",
      },
    ],
  };
};

export const prepareNewPeerConnection = (
  connectedUserSocketID,
  isInitiator
) => {
  const configuration = getConfiguration();
  console.log(configuration);

  peers[connectedUserSocketID] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  });

  peers[connectedUserSocketID].on("signal", (data) => {
    // WebRTC offer, WebRTC answer (SDP info), ICE candidates

    const signalData = {
      signal: data,
      connectedUserSocketID: connectedUserSocketID,
    };

    wss.signalPeerData(signalData);
  });

  peers[connectedUserSocketID].on("stream", (stream) => {
    console.log("New stream came");

    addStream(stream, connectedUserSocketID);
    streams = [...streams, stream];
  });
};

export const signalDataHandler = (data) => {
  // Add signal data to peer connection
  peers[data.connectedUserSocketID].signal(data.signal);
};

export const removePeerConnection = (data) => {
  console.log("REMOVEPEERCONNECTION");
  const { socketID } = data;
  const videoContainer = document.getElementById(socketID);
  const videoElement = document.getElementById(`${socketID}-video`);
  console.log(data);
  console.log(videoContainer);
  console.log(videoElement);

  if (videoContainer && videoElement) {
    const tracks = videoElement.srcObject.getTracks();
    console.log(tracks);

    tracks.forEach((t) => t.stop());

    videoElement.srcObject = null;
    videoContainer.removeChild(videoElement);
    videoContainer.parentNode.removeChild(videoContainer);

    console.log(peers[socketID]);

    if (peers[socketID]) {
      peers[socketID].destroy();
    }
    delete peers[socketID];
  }
  console.log("REMOVEPEERCONNECTION END");
};

const showLocalVideoPreview = (stream) => {
  const videosContainer = document.getElementById("videos_portal");
  videosContainer.classList.add("videos_portal_styles");
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_track_container");

  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer);
};

// Display incoming stream
const addStream = (stream, connectedUserSocketID) => {
  const videosContainer = document.getElementById("videos_portal");
  const videoContainer = document.createElement("div");
  videoContainer.id = connectedUserSocketID;
  videoContainer.classList.add("video_track_container");

  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;
  videoElement.id = `${connectedUserSocketID}-video`;
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer);
};
