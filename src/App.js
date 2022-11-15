import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import "./App.scss";
import { useEffect } from "react";
import { socketService } from "./services/sockets/socket.service";

const App = () => {
  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App;
