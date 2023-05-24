import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails: null,
  activeRooms: [],
  localStream: null,
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

    setActiveRooms: (state, action) => {},
    setLocalStream: (state, action) => {},
    setRemoteStreams: (state, action) => {},
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
