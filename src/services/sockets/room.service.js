import { setOpenRoom } from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store"

export const createNewRoom=()=>{
    store.dispatch( setOpenRoom({ isUserInRoom:true, isUserRoomCreator:true}));
}