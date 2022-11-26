import { createSlice } from "@reduxjs/toolkit";

const initialState = { reactions: [] };

const reactionSlice = createSlice({
  name: "reactions",
  initialState,
  reducers: {
    addReactions: (state, action) => {
      state.reactions = action.payload;
    },
  },
});

export const { addReactions } = reactionSlice.actions;
export default reactionSlice.reducer;
