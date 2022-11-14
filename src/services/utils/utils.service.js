import { floor, random } from "lodash";
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
    console.log(
      "Dispatching user with data",
      result.data.token,
      result.data.user,
      addUser
    );
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
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
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
} //eoc
