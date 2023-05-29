import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails: null,
  activeRooms: [],
  localStream: {},
  remoteStreams: [],
  audioOnly: false,
  screenSharingStream: null,
  isScreenSharingActive: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setOpenRoom: (state, action) => {
      const { isUserInRoom, isUserRoomCreator } = action.payload;
      state.isUserInRoom = isUserInRoom;
      state.isUserRoomCreator = isUserRoomCreator;
    },

    setRoomDetails: (state, action) => {
      const { roomDetails } = action.payload;
      state.roomDetails = roomDetails;
    },

    setActiveRooms: (state, action) => {
      state.activeRooms = action.payload;
    },

    setLocalStream: (state, action) => {
      const {stream}=action.payload;
      console.log("STREAM:::",stream)
      state.localStream=stream;
    },

    setRemoteStreams: (state, action) => {
      state.remoteStreams=action.payload
    },

    setAudioOnly: (state, action) => {},
    setScreenShareStream: (state, action) => {},
  },
});

export const {
  setOpenRoom,
  setRoomDetails,
  setActiveRooms,
  setLocalStream,
  setRemoteStreams,
  setAudioOnly,
  setScreenShareStream,
} = roomSlice.actions;
export default roomSlice.reducer;
