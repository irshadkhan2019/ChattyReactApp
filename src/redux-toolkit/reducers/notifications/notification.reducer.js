import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep, uniqBy } from "lodash";
import checkIcon from "./../../../assets/images/check.svg";
import errorIcon from "./../../../assets/images/error.svg";
import infoIcon from "./../../../assets/images/info.svg";
import warningIcon from "./../../../assets/images/warning.svg";

const initialState = [];
let list = [];
const toastIcons = [
  { success: checkIcon, color: "#5cb85c" },
  { error: errorIcon, color: "#d9534f" },
  { info: infoIcon, color: "#5bc0de" },
  { warning: warningIcon, color: "#f0ad4e" },
];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { message, type } = action.payload;
      const toast = toastIcons.find((toast) => toast[type]);
      //create toast item
      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toast[type],
        backgroundColor: toast.color,
      };

      list = cloneDeep(list);
      //create list of toastItems
      list.unshift(toastItem);
      list = [...uniqBy(list, "description")];
      return list; //change initial state
    },

    clearNotification: () => {
      list = []; //make list empty
      return []; //make initial state empty
    },
  },
});

export const { addNotification, clearNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;