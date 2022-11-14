import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/user.reducer";
import suggestionReducer from "./reducers/suggestions/suggestions.reducer";
export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionReducer,
  },
});
