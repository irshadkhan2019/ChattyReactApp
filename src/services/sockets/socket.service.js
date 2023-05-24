import { io } from "socket.io-client";
import { newRoomCreated } from "./room.service";

class SocketService {
  socket;
  setupSocketConnection() {
    // connect to node js app
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      transports: ["websocket"],
      secure: true,
    });
    this.socketConnectionEvents();
  }
  socketConnectionEvents() {
    this.socket.on("connect", () => {
      console.log("connected");
    });
    this.socket.on("disconnect", (reason) => {
      console.log("connected due to:", reason);
      this.socket.connect();
    });

    this.socket.on("connect_error", (error) => {
      console.log("Error", error);
      this.socket.connect();
    });
    //listen for room events
    this.socket.on("room-create", (roomDetails) => {
      newRoomCreated({ roomDetails });
    });
  }
  // create a room and emit event to server
  createNewRoom = (user) => {
    this.socket.emit("room-create", user);
  };
}
export const socketService = new SocketService();
