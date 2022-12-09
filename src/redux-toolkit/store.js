import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/user.reducer";
import suggestionReducer from "./reducers/suggestions/suggestions.reducer";
import notificationReducer from "./reducers/notifications/notification.reducer";
import modalReducer from "./reducers/modal/modal.reducer";
import postReducer from "./reducers/post/post.reducer";
import postsReducer from "./reducers/post/posts.reducer";
import userPostReactionReducer from "./reducers/post/user-post-reaction.reducer";
import chatReducer from "./reducers/chat/chat.reducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionReducer,
    notifications: notificationReducer,
    modal: modalReducer,
    post: postReducer,
    allPosts: postsReducer,
    userPostReactions: userPostReactionReducer,
    chat: chatReducer,
  },
});
