import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWrapper from "../../modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "../modal-box-content/ModalBoxContent";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import "./AddPost.scss";
import { bgColors } from "./../../../../services/utils/static.data";
import ModalBoxSelection from "./../modal-box-content/ModalBoxSelection";
import Button from "./../../../button/Button";
import { PostUtils } from "../../../../services/utils/post-utils.service";
import { useRef } from "react";
import {
  closeModal,
  toggleGifModal,
} from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import Giphy from "../../../giphy/Giphy";
import PropTypes from "prop-types";
import { ImageUtils } from "../../../../services/utils/image-utils.service";
import { postService } from "../../../../services/api/post/post.service";
import Spinner from "../../../spinner/Spinner";
import { Utils } from "../../../../services/utils/utils.service";

const AddPost = ({ selectedImage, selectedPostVideo }) => {
  const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
  const { gifUrl, image, privacy, video } = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);
  const [hasVideo, setHasVideo] = useState(false);
  const [loading, setLoading] = useState();
  const [postImage, setPostImage] = useState("");
  const [allowedNumberOfCharacters] = useState("100/100");
  const [textAreaBackground, setTextAreaBackground] = useState("#ffffff");
  const [postData, setPostData] = useState({
    post: "",
    bgColor: textAreaBackground,
    privacy: "",
    feelings: "",
    gifUrl: "",
    profilePicture: "",
    image: "",
    video: "",
  });

  const [disable, setDisable] = useState(true);
  const [apiResponse, setApiResponse] = useState(false);
  const [selectedPostImage, setSelectedPostImage] = useState();
  const counterRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);

  const dispatch = useDispatch();

  const maxNumberOfCharacters = 100;

  const selectBackground = (bgColor) => {
    console.log(selectedPostImage);
    PostUtils.selectBackground(
      bgColor,
      postData,
      setTextAreaBackground,
      setPostData
    );
  };

  const postInputEditable = (event, textContent) => {
    console.log(textContent);
    const currentTextlength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextlength;
    counterRef.current.textContent = `${counter}/100`;
    setDisable(currentTextlength <= 0 && !postImage && !gifUrl);
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const onKeyDown = (event) => {
    const currentTextlength = event.target.textContent.length;
    if (currentTextlength === maxNumberOfCharacters && event.keyCode !== 8) {
      //block keyboard except backspace char
      console.log("reached max len");
      event.preventDefault();
    }
  };

  const clearImage = () => {
    PostUtils.clearImage(
      postData,
      " ",
      inputRef,
      dispatch,
      setSelectedPostImage,
      setPostImage,
      setPostData
    );
  };

  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);

    try {
      if (Object.keys(feeling).length) {
        //in modal feeling is object but in post we only need name
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.gifUrl = gifUrl;
      postData.profilePicture = profile?.profilePicture;

      //if user selects post Image
      if (selectedPostImage || selectedImage) {
        //convert to base64 encoded string
        let result = "";
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }
        if (selectedImage) {
          result = await ImageUtils.readAsBase64(selectedImage);
        }
        const response = await PostUtils.sendPostWithImageRequest(
          result, //its image base64 string
          postData,
          imageInputRef,
          setApiResponse,
          setLoading,
          dispatch
        );
        if (response && response.data.message) {
          PostUtils.closePostModal(dispatch);
          Utils.dispatchNotification(
            response.data.message,
            "success",
            dispatch
          );
        }
      } else {
        //for just only post text/gif
        console.log("data b4 post", postData);

        const response = await postService.createPost(postData);
        if (response) {
          setApiResponse("success");
          setLoading(false);
          PostUtils.closePostModal(dispatch);
          Utils.dispatchNotification(
            response.data.message,
            "success",
            dispatch
          );
        }
      }
    } catch (error) {
      PostUtils.dispatchNotification(
        error.response.data.message,
        "error",
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  };

  useEffect(() => {
    PostUtils.positionCursor("editable");
  }, []);

  useEffect(() => {
    console.log("change in img");
    if (gifUrl) {
      setPostImage(gifUrl);
      setHasVideo(false);
      //persist post text after an image/gif is selected
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (image) {
      setPostImage(image);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (video) {
      setHasVideo(true);
      setPostImage(video);
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    }
  }, [gifUrl, image, video, postData]);

  useEffect(() => {
    if (!loading && apiResponse == "success") {
      dispatch(closeModal());
    }
    //submit btn disabled if ..
    setDisable(postData.post.length <= 0 && !postImage && !gifUrl);
  }, [loading, dispatch, apiResponse, postData, postImage, gifUrl]);

  return (
    <>
      <PostWrapper>
        {/* child 1 */}
        <div></div>

        {/* child 2 */}
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{
              height:
                selectedPostImage ||
                gifUrl ||
                image ||
                hasVideo ||
                postData?.gifUrl ||
                postData?.image
                  ? "700px"
                  : "auto",
            }}
          >
            {loading && (
              <div
                className="modal-box-loading"
                data-testid="modal-box-loading"
              >
                <span>Posting......</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2> Create Post</h2>
              <button
                className="modal-box-header-cancel"
                onClick={() => closePostModal()}
              >
                X
              </button>
            </div>
            <hr />
            <ModalBoxContent />

            {/* If user does'nt upload image  */}
            {!postImage && (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  style={{ background: `${textAreaBackground}` }}
                >
                  <div
                    className="main"
                    style={{
                      margin: textAreaBackground !== "#ffffff" ? "0 auto" : "",
                    }}
                  >
                    <div className="flex-row">
                      {/* user input text for post */}
                      <div
                        data-testid="editable"
                        id="editable"
                        name="post"
                        contentEditable={true}
                        data-placeholder="What's on your mind?...."
                        className={`editable flex-item ${
                          textAreaBackground !== "#ffffff"
                            ? "textinputColor"
                            : ""
                        }`}
                        onInput={(e) => {
                          // console.log("on Input", e);
                          postInputEditable(e, e.currentTarget.textContent);
                        }}
                        onKeyDown={onKeyDown}
                        ref={(el) => {
                          // console.log("el", el);
                          inputRef.current = el;
                          inputRef?.current?.focus();
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* If user upload/select post image/gif/video */}
            {postImage && (
              <>
                <div className="modal-box-image-form">
                  {/* user input text for post */}
                  <div
                    data-testid="post-editable"
                    name="post"
                    id="editable"
                    contentEditable={true}
                    data-placeholder="What's on your mind?...."
                    className="post-input flex-item"
                    onInput={(e) =>
                      postInputEditable(e, e.currentTarget.textContent)
                    }
                    onKeyDown={onKeyDown}
                    ref={(el) => {
                      imageInputRef.current = el;
                      imageInputRef?.current?.focus();
                    }}
                  ></div>
                  <div className="image-display">
                    <div
                      className="image-delete-btn"
                      data-testid="image-delete-btn"
                      onClick={() => clearImage()}
                    >
                      <FaTimes />
                    </div>
                    {!hasVideo && (
                      <img
                        data-testid="post-image"
                        className="post-image"
                        src={`${postImage}`}
                        alt=""
                      />
                    )}

                    {hasVideo && (
                      <div>
                        <video width="100%" controls src={`${video}`} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* options to select colors for bg */}
            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((color, index) => (
                  <li
                    data-testid="bg-colors"
                    key={index}
                    className={`${
                      color === "#ffffff" ? "whiteColorBorder" : ""
                    }`}
                    style={{ backgroundColor: `${color}` }}
                    onClick={() => {
                      PostUtils.positionCursor("editable");
                      selectBackground(color);
                    }}
                  >
                    {/* {console.log("current Post Data", postData)} */}
                  </li>
                ))}
              </ul>
            </div>
            {/* Set limit of characters */}
            <span
              className="char_count"
              data-testid="allowed-number"
              ref={counterRef}
            >
              {allowedNumberOfCharacters}
            </span>

            {/* Display gif photo feeling option to select */}
            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} />

            <div className="modal-box-button" data-testid="post-button">
              <Button
                label={"Create post"}
                className="post-button"
                disabled={disable}
                handleClick={createPost}
              />
            </div>
          </div>
        )}

        {/* child 3 */}

        {gifModalIsOpen && (
          <div className="modal-giphy" data-testid="modal-giphy">
            <div className="modal-giphy-header">
              <Button
                label={<FaArrowLeft />}
                className="back-button"
                disabled={false}
                handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
              />
              <h2> Choose a Gif</h2>
            </div>
            <hr></hr>
            <Giphy />
          </div>
        )}
      </PostWrapper>
    </>
  );
};

AddPost.propTypes = {
  selectedImage: PropTypes.string,
};

export default AddPost;
