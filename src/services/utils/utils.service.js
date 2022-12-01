import { floor, random, some } from "lodash";
import millify from "millify";
import {
  addNotification,
  clearNotification,
} from "../../redux-toolkit/reducers/notifications/notification.reducer";
import {
  addUser,
  clearUser,
} from "../../redux-toolkit/reducers/user/user.reducer";

import { avatarColors } from "./static.data";

export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(text, backgroundColor, foregroundColor = "white") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "normal 80px sans-serif";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }

  //result is the data we get from api after user logs in
  //pagereload session fn is used to make user stay a same page after reload instead
  //of going to login page
  static dispatchUser(result, pageReload, dispatch, setUser) {
    pageReload(true);
    dispatch(addUser({ token: result.data.token, profile: result.data.user }));
    setUser(result.data.user);
  }

  static clearStore({
    dispatch,
    deleteStorageUsername,
    deleteSessionPageReload,
    setLoggedIn,
  }) {
    dispatch(clearUser());
    //clear notifications when logging out
    dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }

  static dispatchClearNotification(dispatch) {
    dispatch(clearNotification());
  }

  static dispatchNotification(message, type, dispatch) {
    dispatch(addNotification({ message, type }));
  }

  static appEnvironment() {
    const env = process.env.REACT_APP_ENVIRONMENT;
    if (env === "development") return "DEV";
    if (env === "staging") return "STG";
  }

  static mapSettingsDropdownItems(setSettings) {
    const items = [];
    const item = {
      topText: "My Profile",
      subText: "View personal profile",
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  static generateString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static appImageUrl(version, id) {
    if (typeof version === "string" && typeof id === "string") {
      version = version.replace(/['"]+/g, "");
      id = id.replace(/['"]+/g, "");
    }
    return `https://res.cloudinary.com/dnslnpn4l/image/upload/v${version}/${id}`;
  }

  static checkIfUserIsBlocked(blocked, userId) {
    return some(blocked, (id) => id === userId);
  }

  static checkIfUserIsFollowed(userFollowers, postCreatorId, userId) {
    return some(
      userFollowers,
      (user) => user._id === postCreatorId || postCreatorId === userId
    );
  }

  static firstLetterUpperCase(word) {
    if (!word) return "";
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  static formattedReactions(reactions) {
    const postReactions = [];
    for (const [key, value] of Object.entries(reactions)) {
      if (value > 0) {
        const reactionObject = {
          type: key,
          value,
        };
        postReactions.push(reactionObject);
      }
    }
    return postReactions;
  }

  static shortenLargeNumbers(data) {
    if (data === undefined) {
      return 0;
    } else {
      return millify(data);
    }
  }
} //eoc
