import { createSlice } from "@reduxjs/toolkit";
import { emptyPostData } from "../../../services/utils/static.data";

const initialState = emptyPostData;

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    updatePostItem: (state, action) => {
      //update specific post properties
      for (const [key, value] of Object.entries(action.payload)) {
        state[key] = value;
      }
    },
    clearPost: (state) => {
      return emptyPostData;
    },
  },
});

export const { updatePostItem, clearPost } = postSlice.actions;
export default postSlice.reducer;
