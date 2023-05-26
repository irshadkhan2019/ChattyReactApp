import {
  setActiveRooms,
  setLocalStream,
  setOpenRoom,
  setRoomDetails,
} from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store";
import { socketService } from "./socket.service";
import { followerService } from "./../api/followers/follower.service";
import { getLocalStreamPreview } from "./webrtc.service";

export const createNewRoom = () => {
  //open room only is local stream available
  const successCallback=()=>{
    store.dispatch(setOpenRoom({ isUserInRoom: true, isUserRoomCreator: true }));
    //user who is creating room send event to server
    socketService.createNewRoom(store.getState().user);
  }

  getLocalStreamPreview(false,successCallback)

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

export const joinRoom = (room) => {
  const successCallback=()=>{
    store.dispatch(setRoomDetails({ roomDetails: room }));
    store.dispatch(setOpenRoom({ isUserInRoom: true, isUserRoomCreator: false }));
    socketService.joinRoom(store.getState().user, room.roomId);
  }

  getLocalStreamPreview(false,successCallback)
};

export const leaveRoom = () => {

  const localStream=store.getState().room.localStream;
  if(localStream){
    //close all tracks
    localStream.getTracks().forEach((track)=>track.stop());
    store.dispatch(setLocalStream({stream:null}))
  }
  
  socketService.leaveRoom(
    store.getState().user,
    store.getState().room.roomDetails.roomId
  );
  store.dispatch(setRoomDetails({ roomDetails: null }));
  store.dispatch(
    setOpenRoom({ isUserInRoom: false, isUserRoomCreator: false })
  );
};
