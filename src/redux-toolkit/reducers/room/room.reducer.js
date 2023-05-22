import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails:null,
  activeRooms:[],
  localStream:null,
  remoteStreams:[],
  audioOnly:false,
  screenSharingStream:null,
  isScreenSharingActive:false
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    openRoom: (state, action) => {
    },
    setRoomDetails: (state, action) => {
    },
    setActiveRooms: (state, action) => {
    },
    setLocalStream: (state, action) => {
    },
    setRemoteStreams: (state, action) => {
    },
    setAudioOnly: (state, action) => {
    },
    setScreenShareStream: (state, action) => {
    },

  },
});

export const { openRoom, setRoomDetails, setActiveRooms,setLocalStream,setRemoteStreams,setAudioOnly,setScreenShareStream } = roomSlice.actions;
export default roomSlice.reducer;
