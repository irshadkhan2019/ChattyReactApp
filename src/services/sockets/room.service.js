import {
  setActiveRooms,
  setOpenRoom,
  setRoomDetails,
} from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store";
import { socketService } from "./socket.service";
import { followerService } from "./../api/followers/follower.service";

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

export const updateActiveRooms = async (data) => {
  const { activeRooms } = data;
  // console.log("Total active rooms::-> ", activeRooms);

  let rooms = [];
  const response = await followerService.getUserFollowing();
  const followings = response.data.following;
  // console.log(followings);
  // dispatch active rooms only to the followers of room  creator .
  activeRooms.forEach((room) => {
    followings.forEach((following) => {
      // if the room owner is in the current users follwoing list
      if (following._id === room.roomId) {
        rooms.push({ ...room, creatorUsername: room.roomId });
      }
    });
  });
  console.log("ROOMS::", rooms);
  store.dispatch(setActiveRooms(rooms));
};

export const joinRoom = (roomId) => {
  store.dispatch(setRoomDetails({ roomId }));
  store.dispatch(setOpenRoom({ isUserInRoom: true, isUserRoomCreator: false }));
  socketService.joinRoom(store.getState().user, roomId);
};
