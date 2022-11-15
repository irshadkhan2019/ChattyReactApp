import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import "./App.scss";
import { useEffect } from "react";
import { socketService } from "./services/sockets/socket.service";
import Toast from "./components/toast/Toast";
import { useSelector } from "react-redux";

const App = () => {
  //get notification from redux store:)
  const { notifications } = useSelector((state) => state);

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      {notifications && notifications.length > 0 && (
        <Toast
          position={"top-right"}
          toastList={notifications}
          autoDelete={false}
        />
      )}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App;
