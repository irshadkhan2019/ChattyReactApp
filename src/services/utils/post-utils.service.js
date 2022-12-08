import { cloneDeep, find, findIndex, remove } from "lodash";
import { closeModal } from "../../redux-toolkit/reducers/modal/modal.reducer";
import {
  clearPost,
  updatePostItem,
} from "../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../api/post/post.service";
import { Utils } from "./utils.service";
import { socketService } from "./../sockets/socket.service";

export class PostUtils {
  static selectBackground(
    bgColor,
    postData,
    setTextAreaBackground,
    setPostData
  ) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable(textContent, postData, setPostData) {
    // console.log("setting postInputEditable postData", postData);
    postData.post = textContent;
    setPostData(postData);
  }

  static closePostModal(dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }

  static clearImage(
    postData,
    post,
    inputRef,
    dispatch,
    setSelectedPostImage,
    setPostImage,

    setPostData
  ) {
    postData.gifUrl = "";
    postData.image = "";
    postData.video = "";
    setSelectedPostImage(null);
    setPostImage("");

    setTimeout(() => {
      //persist post text after an image/gif is deleted
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor("editable");
    });
    dispatch(
      updatePostItem({ gifUrl: "", image: "", imgId: "", imgVersion: "" })
    );
  }

  static postInputData(imageInputRef, postData, post, setPostData) {
    setTimeout(() => {
      //after image selection we need to persist the post text
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor("editable");
      }
    });
  }

  static dispatchNotification(
    message,
    type,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    setApiResponse(type);
    setLoading(false);

    Utils.dispatchNotification(message, type, dispatch);
  }

  static async sendPostWithFileRequest(
    type,
    postData,
    imageInputRef,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      // postData.image = fileResult;
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      console.log("post data b4 posting", postData);
      const response =
        type == "image"
          ? await postService.createPostWithImage(postData)
          : await postService.createPostWithVideo(postData);

      if (response) {
        setApiResponse("success");
        setLoading(false);
      }
      return response;
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        "error",
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  }

  static async sendUpdatePostWithImageRequest(
    fileResult,
    postId,
    postData,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    try {
      postData.image = fileResult;
      postData.gifUrl = "";
      postData.imgId = "";
      postData.imgVersion = "";
      const response = await postService.updatePostWithImage(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(
          response.data.message,
          "success",
          setApiResponse,
          setLoading,
          dispatch
        );
        setTimeout(() => {
          setApiResponse("success");
          setLoading(false);
        }, 3000);
        PostUtils.closePostModal(dispatch);
      }
      return response;
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        "error",
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  }

  static async sendUpdatePostRequest(
    postId,
    postData,
    setApiResponse,
    setLoading,
    dispatch
  ) {
    const response = await postService.updatePost(postId, postData);

    if (response) {
      PostUtils.dispatchNotification(
        response.data.message,
        "success",
        setApiResponse,
        setLoading,
        dispatch
      );
      setTimeout(() => {
        setApiResponse("success");
        setLoading(false);
      }, 3000);
      PostUtils.closePostModal(dispatch);
    }
    return response;
  }

  static checkPrivacy(post, profile, following) {
    const isPrivate =
      post?.privacy === "Private" && post?.userId == profile?._id;
    const isPublic = post?.privacy === "Public";
    const isFollower =
      post?.privacy === "Followers" &&
      Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id);
    return isPrivate || isPublic || isFollower;
  }

  static positionCursor(elementId) {
    const element = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  }

  static socketIOPost(posts, setPosts) {
    posts = cloneDeep(posts);

    socketService?.socket?.on("add post", (newPost) => {
      posts = [newPost, ...posts];
      setPosts(posts);
    });

    socketService?.socket?.on("update post", (updatedPost) => {
      console.log("UPDATE POST EVENT", updatedPost);
      PostUtils.updateSinglePost(posts, updatedPost, setPosts);
    });

    socketService?.socket?.on("delete post", (deletedPostId) => {
      const index = findIndex(posts, ["_id", deletedPostId]);
      if (index > -1) {
        posts = cloneDeep(posts);
        remove(posts, { _id: deletedPostId });
        setPosts(posts);
      }
    });

    socketService?.socket?.on("update like", (reactionData) => {
      const postData = find(posts, (post) => post._id === reactionData?.postId);

      if (postData) {
        postData.reactions = reactionData.postReactions;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

    socketService?.socket?.on("update comment", (commentData) => {
      const postData = find(posts, (post) => post._id === commentData?.postId);

      if (postData) {
        postData.commentsCount = commentData.commentsCount;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });
  }

  static updateSinglePost(posts, updatedPost, setPosts) {
    posts = cloneDeep(posts);
    const index = findIndex(posts, (data) => data._id === updatedPost._id);
    console.log("updateSinglePost", updatedPost, index);
    // const index = findIndex(posts, ["_id", updatedPost?._id]);
    if (index > -1) {
      //update posts arr with 1 new post at index =index
      posts.splice(index, 1, updatedPost);
      setPosts(posts);
    }
  }
}
