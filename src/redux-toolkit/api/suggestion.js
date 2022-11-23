import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/api/user/user.service";
import { Utils } from "../../services/utils/utils.service";
import { fakeData } from "./fakeData";

//create action creator using thunk
// takes params,callback fn
export const getUserSuggestions = createAsyncThunk(
  "user/getSuggestions",
  async (name, { dispatch }) => {
    try {
      // const response = await userService.getUserSuggestions();
      // return response.data;

      //for time being test with fake data since api pending
      console.log(fakeData);
      return fakeData;
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }
);
