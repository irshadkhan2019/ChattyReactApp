import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import "./App.scss";
import { useEffect } from "react";
import { socketService } from "./services/sockets/socket.service";
import Toast from "./components/toast/Toast";
import checkIcon from "./assets/images/check.svg";
import errorIcon from "./assets/images/error.svg";
import infoIcon from "./assets/images/info.svg";
import warningIcon from "./assets/images/warning.svg";

const App = () => {
  const notifications = [
    {
      id: 1,
      description: "This is success msg",
      type: "success",
      icon: checkIcon,
      backgroundColor: "#5cb85c",
    },
    {
      id: 2,
      description: "This is error msg",
      type: "error",
      icon: errorIcon,
      backgroundColor: "#d9534f",
    },
    {
      id: 3,
      description: "This is info msg",
      type: "info",
      icon: infoIcon,
      backgroundColor: "#5bc0de",
    },
    {
      id: 3,
      description: "This is warning msg",
      type: "warning",
      icon: warningIcon,
      backgroundColor: "#f0ad4e",
    },
  ];

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      {notifications && notifications.length > 0 && (
        <Toast
          position={"top-right"}
          toastList={notifications}
          autoDelete={true}
        />
      )}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App;
