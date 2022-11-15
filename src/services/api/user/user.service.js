import axios from "./../../axios";

class UserService {
  async getUserSuggestions() {
    console.log("getting user suggestions");
    const response = await axios.get("/user/profile/user/suggestions");
    return response;
  }
  async logoutUser() {
    console.log("user logged out");
    const response = await axios.get("/signout");
    console.log(response);
    return response;
  }
  async checkCurrentUser() {
    const response = await axios.get("/currentuser");
    return response;
  }
}

export const userService = new UserService();
