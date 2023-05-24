import {
  setOpenRoom,
  setRoomDetails,
} from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store";
import { socketService } from "./socket.service";

export const createNewRoom = () => {
  store.dispatch(setOpenRoom({ isUserInRoom: true, isUserRoomCreator: true }));
  //user who is creating room send event to server
  socketService.createNewRoom(store.getState().user);
};

export const newRoomCreated = (data) => {
  const { roomDetails } = data;
  console.log("New room created", roomDetails);
  store.dispatch(setRoomDetails(roomDetails));
};
export const updateActiveRooms = (data) => {
  const { activeRooms } = data;
  console.log("Total active rooms ", activeRooms);
  //store.dispatch(setRoomDetails(roomDetails));
};
