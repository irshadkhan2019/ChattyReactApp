import { io } from "socket.io-client";
import { newRoomCreated, updateActiveRooms } from "./room.service";

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
    //listen for new room events created by us
    this.socket.on("room-create", (roomDetails) => {
      newRoomCreated({ roomDetails });
    });

    // listen for all active rooms
    this.socket.on("active-rooms", (activeRooms) => {
      updateActiveRooms(activeRooms);
    });
  }
  // create a room and emit event to server
  createNewRoom = (user) => {
    this.socket.emit("room-create", user);
  };

  // To Join a room,emit event to server
  joinRoom = (user, roomId) => {
    this.socket.emit("room-join", { user, roomId });
  };
  // To leave a room,emit event to server
  leaveRoom = (user, roomId) => {
    console.log("leaving room", user.profile._id, roomId);
    this.socket.emit("room-leave", { user, roomId });
  };
}
export const socketService = new SocketService();
