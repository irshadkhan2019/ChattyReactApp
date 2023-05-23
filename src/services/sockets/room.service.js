import { setOpenRoom } from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store";
import { socketService } from "./socket.service";

export const createNewRoom = () => {
  store.dispatch(setOpenRoom({ isUserInRoom: true, isUserRoomCreator: true }));
  //user who is creating room send event to server
  socketService.createNewRoom(store.getState().user);
};
