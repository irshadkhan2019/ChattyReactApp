import axios from "./../../axios";

class PostService {
  async getAllPosts(page) {
    const response = await axios.get(`/post/all/${page}`);
    return response;
  }

  async createPost(body) {
    const response = await axios.post("/post", body);
    return response;
  }

  async createPostWithImage(body) {
    const response = await axios.post("/post/image/post", body);
    return response;
  }

  async getReactionsByUsername(username) {
    const response = await axios.get(`/post/reactions/username/${username}`);
    return response;
  }

  async getSinglePostReactionByUsername(postId, username) {
    const response = await axios.get(
      `/post/single/reaction/username/${username}/${postId}`
    );
    return response;
  }

  async addReaction(reaction) {
    const response = await axios.post(`/post/reaction/`, reaction);
    return response;
  }

  async removeReaction(postId, previousReaction, postReactions) {
    const response = await axios.delete(
      `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(
        postReactions
      )}`
    );
    return response;
  }
}
export const postService = new PostService();
