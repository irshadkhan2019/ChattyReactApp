import axios from "./../../axios";

class UserService {
  async getUserSuggestions() {
    console.log("getting user suggestions");
    const response = await axios.get("/user/profile/user/suggestions");
    return response;
  }
  async logoutUser() {
    // console.log("user logged out");
    const response = await axios.get("/signout");
    console.log(response);
    return response;
  }

  async checkCurrentUser() {
    const response = await axios.get("/currentuser");
    return response;
  }

  async getAllUsers(page) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }
  async getUserProfileByUserId(userId) {
    const response = await axios.get(`/user/profile/${userId}`);
    return response;
  }

  async getUserProfileByUsername(username, userId, uId) {
    const response = await axios.get(
      `/user/profile/posts/${username}/${userId}/${uId} `
    );
    return response;
  }
  async searchUsers(query) {
    const response = await axios.get(`/user/profile/search/${query}`);
    return response;
  }
}

export const userService = new UserService();
