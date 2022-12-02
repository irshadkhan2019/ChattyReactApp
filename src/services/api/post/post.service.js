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

  async getPostReactions(postId) {
    const response = await axios.get(`/post/reactions/${postId}`);
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

  async addComment(comment) {
    const response = await axios.post(`/post/comment/`, comment);
    return response;
  }
  async getPostCommentsNames(postId) {
    const response = await axios.get(`/post/commentsnames/${postId}`);
    return response;
  }
  async getPostComments(postId) {
    const response = await axios.get(`/post/comments/${postId}`);
    return response;
  }
}
export const postService = new PostService();
