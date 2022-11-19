import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/user.reducer";
import suggestionReducer from "./reducers/suggestions/suggestions.reducer";
import notificationReducer from "./reducers/notifications/notification.reducer";
import modalReducer from "./reducers/modal/modal.reducer";
import postReducer from "./reducers/post/post.reducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionReducer,
    notifications: notificationReducer,
    modal: modalReducer,
    post: postReducer,
  },
});
