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

//selectedImage,selectedPostVideo is coming when user selects from postform component
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
  const [selectedVideo, setSelectedVideo] = useState();
  const counterRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);

  const dispatch = useDispatch();

  const maxNumberOfCharacters = 100;

  const selectBackground = (bgColor) => {
    console.log(selectedPostImage,bgColor);
    PostUtils.selectBackground(
      bgColor,
      postData,
      setTextAreaBackground,
      setPostData
    );
  };

  // change the maxnofofallowed chars for each key press
  const postInputEditable = (event, textContent) => {
    console.log(textContent);
    const currentTextlength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextlength;
    //change  {allowedNumberOfCharacters} via counterref
    counterRef.current.textContent = `${counter}/100`;
    setDisable(currentTextlength <= 0 && !postImage && !gifUrl);
    //whatever typed in input field update it in postData.post field state 
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  //called for each key pressed  in InputEditable field
  const onKeyDown = (event) => {
    const currentTextlength = event.target.textContent.length;
    if (currentTextlength === maxNumberOfCharacters && event.keyCode !== 8) {
      //block keyboard except backspace char
      console.log("reached max len");
      event.preventDefault();
    }
  };

  const clearImage = () => {
    setSelectedVideo(null); //clear video
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

  // store the post in db
  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);
 
    // creating well defined post object using modal and post reducers
    try {
      // seleced feeling is in Modal reducer state but not in post so we need to 
      //store it in post reducer
      if (Object.keys(feeling).length) {
        //in modal feeling is object but in post we only need name
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.gifUrl = gifUrl;
      postData.profilePicture = profile?.profilePicture;

      //if user selects post Image/video
      if (
        selectedPostImage ||
        selectedImage ||
        selectedVideo ||
        selectedPostVideo
      ) {
        //convert to base64 encoded string since at backend we store it as base64 form :)
        let result = "";
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }
        if (selectedImage) {
          result = await ImageUtils.readAsBase64(selectedImage);
        }
        if (selectedVideo) {
          result = await ImageUtils.readAsBase64(selectedVideo);
        }
        if (selectedPostVideo) {
          result = await ImageUtils.readAsBase64(selectedPostVideo);
        }
        const type = selectedPostImage || selectedImage ? "image" : "video";
        if (type === "image") {
          postData.image = result;
          postData.video = "";
        } else {
          postData.image = "";
          postData.video = result;
        }

        // service to store post in db 
        const response = await PostUtils.sendPostWithFileRequest(
          type, //its image/video
          postData,
          imageInputRef,
          setApiResponse,
          setLoading,
          dispatch
        );
        if (response && response.data.message) {
          setHasVideo(false);
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
          setHasVideo(false);
          PostUtils.closePostModal(dispatch);
          Utils.dispatchNotification(
            response.data.message,
            "success",
            dispatch
          );
        }
      }
    } catch (error) {
      setHasVideo(false);
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

  // when user selected gifs via Giphy component it changes post state and adds
  //gifurl to it when re-renders this useeffect and gif is diplayed in preview image . 
  useEffect(() => {
    // console.log("change in img");
    // console.log("SELECTED POST VIDEO", selectedPostVideo);
    // console.log("SELECTED  VIDEO", selectedVideo);
    if (gifUrl) {
      setPostImage(gifUrl);
      setHasVideo(false);
      //persist post text after an image/gif is selected
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (image) {
      setPostImage(image);
      setHasVideo(false);
      //persist post text after an image/gif is selected
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (video) {
      setHasVideo(true);
      setPostImage(video);
      //persist post text after an video is selected
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    }
  }, [gifUrl, image, video, postData]);


  // after saving to fb we need to close all  modals :)
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
            {/* Show user img ,its feelings */}
            <ModalBoxContent />

            {/* If user does'nt upload image  */}
            {!postImage && (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  // assign user selected background color 
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
                            ? "textInputColor"
                            : ""
                        } ${postData.post.length === 0 && textAreaBackground !="#ffffff" ? 'defaultInputTextColor':''}`}
                        // for each input given calculate maxChar 
                        onInput={(e) => {
                          // console.log("on Input", e);
                          postInputEditable(e, e.currentTarget.textContent);
                        }}
                        // for each key press check if maxchar reached if so block input
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
                    {/* show the gif/image */}
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

            {/* Display gif photo feeling option to select like in postform*/}
            <ModalBoxSelection
              setSelectedPostImage={setSelectedPostImage}
              setSelectedVideo={setSelectedVideo}
            />

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
              {/* Use back btn to close gif modal  */}
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
  selectedImage: PropTypes.any,
  selectedPostVideo: PropTypes.any,
};

export default AddPost;
