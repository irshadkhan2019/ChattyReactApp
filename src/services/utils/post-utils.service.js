import { closeModal } from "../../redux-toolkit/reducers/modal/modal.reducer";
import {
  clearPost,
  updatePostItem,
} from "../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../api/post/post.service";
import { Utils } from "./utils.service";

export class PostUtils {
  static selectBackground(
    bgColor,
    postData,
    setTextAreaBackground,
    setPostData,
    setDisable
  ) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
    setDisable(false);
  }

  static postInputEditable(textContent, postData, setPostData, setDisable) {
    postData.post = textContent;
    setPostData(postData);
    setDisable(false);
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
    setDisable,
    setPostData
  ) {
    postData.gifUrl = "";
    postData.image = "";
    setSelectedPostImage(null);
    setPostImage("");
    setDisable(false);
    setTimeout(() => {
      //persist post text after an image/gif is deleted
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
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
      }
    });
  }

  static dispatchNotification(
    message,
    type,
    setApiResponse,
    setLoading,
    setDisable,
    dispatch
  ) {
    setApiResponse(type);
    setLoading(false);
    setDisable(false);
    Utils.dispatchNotification(message, type, dispatch);
  }

  static async sendPostWithImageRequest(
    fileResult,
    postData,
    imageInputRef,
    setApiResponse,
    setLoading,
    setDisable,
    dispatch
  ) {
    try {
      postData.image = fileResult;
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      console.log("post data b4 posting", postData);
      const response = await postService.createPostWithImage(postData);

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
        setDisable,
        dispatch
      );
    }
  }
}
