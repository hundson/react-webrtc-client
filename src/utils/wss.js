import io from "socket.io-client";
import { setCallID, setParticipants } from "../store/actions";
import store from "../store/store";
import * as webRTCHandler from "./webRTCHandler";

const SERVER = "https://react-webrtc-server.onrender.com";

let socket = null;

export const connectWithSocketIOServer = () => {
  socket = io(SERVER);

  socket.on("connect", () => {
    console.log("Successfully connected with socket.io server");
    console.log(socket.id);
  });

  socket.on("call-id", (data) => {
    const { callID } = data;
    store.dispatch(setCallID(callID));
  });

  socket.on("call-update", (data) => {
    const { connectedUsers } = data;
    store.dispatch(setParticipants(connectedUsers));
  });

  socket.on("connection-prepare", (data) => {
    const { connectedUserSocketID } = data;
    webRTCHandler.prepareNewPeerConnection(connectedUserSocketID, false);

    // Inform user joining room we are prepared for incoming connection
    socket.emit("connection-init", {
      connectedUserSocketID: connectedUserSocketID,
    });
  });

  socket.on("connection-signal", (data) => {
    webRTCHandler.signalDataHandler(data);
  });

  socket.on("connection-init", (data) => {
    const { connectedUserSocketID } = data;
    webRTCHandler.prepareNewPeerConnection(connectedUserSocketID, true);
  });

  socket.on("user-disconnected", (data) => {
    console.log("SOCKET ON USER-DISCONNECT");
    webRTCHandler.removePeerConnection(data);
  });
};

export const createCall = (identity) => {
  const data = {
    identity,
  };

  socket.emit("create-call", data);
};

export const joinCall = (identity, callID) => {
  const data = {
    identity,
    callID,
  };

  socket.emit("join-call", data);
};

export const signalPeerData = (data) => {
  socket.emit("connection-signal", data);
};
