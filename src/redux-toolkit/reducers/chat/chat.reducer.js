import { createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";
import { getConversationList } from "../../api/chat";

//chatlist for a user is all last msgs specific to a unique conversation id .
//eg . {"_id":"6466f36dbdfec8f1441e7c93","conversationId":"6466f0cebf36eb292a3a59fb","receiverId":"645f5362752f8c75ddf9a59e",
//      "receiverAvatarColor":"#9c27b0","receiverProfilePicture":"https://res.cloudinary.com/dnslnpn4l/image/upload/v1683968871/645f5362752f8c75ddf9a59e",
//       "receiverUsername":"Izuku","senderUsername":"Asta","senderId":"645a2045ef3b776dc18a8728","senderAvatarColor":"#ad1457",
//"senderProfilePicture":"https://res.cloudinary.com/dnslnpn4l/image/upload/v1683628105/645a2045ef3b776dc18a8728","body":"Sent a GIF","isRead":false,
//"gifUrl":"https://media2.giphy.com/media/1Fm7jEapE18HwS6fkT/giphy.gif?cid=f9775653qiqd3kftb4zy4gncqnohy404dlpzg6e2p36ca2sh&ep=v1_gifs_trending&rid=giphy.gif&ct=g","selectedImage":"","reaction":[],"createdAt":"2023-05-19T03:56:29.752Z","deleteForEveryone":false,"deleteForMe":false}

//above eg is last msg the profile user chatted with user 645f5362752f8c75ddf9a59e
const initialState = {
  chatList: [],
  // curent chatting user
  selectedChatUser: null,
  isLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addToChatList: (state, action) => {
      const { isLoading, chatList } = action.payload;
      state.chatList = [...chatList];
      state.isLoading = isLoading;
    },
    setSelectedChatUser: (state, action) => {
      const { isLoading, user } = action.payload;
      state.selectedChatUser = user;
      state.isLoading = isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const { list } = action.payload;
      state.isLoading = false;
      const sortedList = orderBy(list, ["createdAt"], ["desc"]);
      state.chatList = [...sortedList];
    });
    builder.addCase(getConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { addToChatList, setSelectedChatUser } = chatSlice.actions;
export default chatSlice.reducer;
