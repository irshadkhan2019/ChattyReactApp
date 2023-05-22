import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import "./App.scss";
import { useEffect } from "react";
import { socketService } from "./services/sockets/socket.service";
import Toast from "./components/toast/Toast";
import { useSelector } from "react-redux";
import Room from "./components/room/Room";

const App = () => {
  //get notification from redux store:)
  const { notifications } = useSelector((state) => state);
  const { isUserInRoom } = useSelector((state) => state.room);

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
      {/* room  */}
      {isUserInRoom && <Room />}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App;
