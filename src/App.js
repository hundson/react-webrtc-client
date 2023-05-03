import React, { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Introduction from "./pages/introduction/Introduction";
import JoinCall from "./pages/joinCall/JoinCall";
import Call from "./pages/call/Call";
import { connectWithSocketIOServer } from "./utils/wss";
import "./App.css";

function App() {
  const router = createHashRouter([
    {
      path: "/",
      element: <Introduction />,
    },
    {
      path: "/join-call",
      element: <JoinCall />,
    },
    {
      path: "/call",
      element: <Call />,
    },
  ]);

  useEffect(() => {
    connectWithSocketIOServer();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
