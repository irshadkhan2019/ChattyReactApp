import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWrapper from "../../modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "../modal-box-content/ModalBoxContent";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import "./EditPost.scss";
import { bgColors, feelingsList } from "../../../../services/utils/static.data";
import ModalBoxSelection from "../modal-box-content/ModalBoxSelection";
import Button from "../../../button/Button";
import { PostUtils } from "../../../../services/utils/post-utils.service";
import { useRef } from "react";
import {
  addPostFeeling,
  closeModal,
  toggleGifModal,
} from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import Giphy from "../../../giphy/Giphy";
import { ImageUtils } from "../../../../services/utils/image-utils.service";
import { postService } from "../../../../services/api/post/post.service";
import Spinner from "../../../spinner/Spinner";
import { Utils } from "../../../../services/utils/utils.service";
import { find } from "lodash";

const EditPost = () => {
  const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
  const { post } = useSelector((state) => state);
  const { profile } = useSelector((state) => state.user);
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
    imgId: "",
    imgVersion: "",
  });

  const [disable, setDisable] = useState(true);
  const [apiResponse, setApiResponse] = useState(false);
  const [selectedPostImage, setSelectedPostImage] = useState(null);
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
    setDisable(currentTextlength <= 0 && !postImage);
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
      post?.post,
      inputRef,
      dispatch,
      setSelectedPostImage,
      setPostImage,
      setPostData
    );
  };

  const getFeeling = useCallback(
    (name) => {
      const feeling = find(feelingsList, (data) => data.name === name);
      dispatch(addPostFeeling({ feeling }));
    },
    [dispatch]
  );

  const postInputData = useCallback(() => {
    setTimeout(() => {
      if (imageInputRef?.current) {
        postData.post = post?.post;
        imageInputRef.current.textContent = post?.post;
        setPostData(postData);
      }
    });
  }, [post, postData]);

  const editableFields = useCallback(() => {
    if (post?.feelings) {
      getFeeling(post?.feelings);
    }
    if (post?.bgColor) {
      postData.bgColor = post?.bgColor;
      setPostData(postData);
      setTextAreaBackground(post?.bgColor);
      setTimeout(() => {
        if (inputRef?.current) {
          postData.post = post?.post;
          inputRef.current.textContent = post?.post;
          setPostData(postData);
        }
      });
    }
    if (post?.gifUrl && !post?.imgId) {
      postData.gifUrl = post?.gifUrl;
      setPostImage(post?.gifUrl);
      postInputData();
    }
    if (post?.imgId && !post?.gifUrl) {
      postData.imgId = post?.imgId;
      postData.imgVersion = post?.imgVersion;
      const imageUrl = Utils.getPostImage(post?.imgId, post?.imgVersion);
      setPostImage(imageUrl);
      postInputData();
    }
  }, [post, postData, getFeeling, postInputData]);

  const updatePost = async () => {
    setLoading(!loading);
    setDisable(!disable);

    try {
      if (Object.keys(feeling).length) {
        //in modal feeling is object but in post we only need name
        postData.feelings = feeling?.name;
      }
      if (postData.gifUrl || (postData.imgId && postData.imgVersion)) {
        postData.bgColor = "#ffffff";
      }
      postData.privacy = post?.privacy || "Public";
      postData.profilePicture = profile?.profilePicture;

      //if user selects post Image
      if (selectedPostImage) {
        updatePostWithImage(selectedPostImage);
      } else {
        updateUserPost();
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

  const updateUserPost = async () => {
    const response = await PostUtils.sendUpdatePostRequest(
      post?._id,
      postData,
      setApiResponse,
      setLoading,
      dispatch
    );
  };

  const updatePostWithImage = async (image) => {
    const result = await ImageUtils.readAsBase64(image);
    const response = await PostUtils.sendUpdatePostWithImageRequest(
      result,
      post?._id,
      postData,
      setApiResponse,
      setLoading,
      dispatch
    );
  };

  useEffect(() => {
    PostUtils.positionCursor("editable");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (imageInputRef?.current && imageInputRef?.current.textContent.length) {
        counterRef.current.textContent = `${
          maxNumberOfCharacters - imageInputRef?.current.textContent.length
        }/100`;
      } else if (inputRef?.current && inputRef?.current.textContent.length) {
        counterRef.current.textContent = `${
          maxNumberOfCharacters - inputRef?.current.textContent.length
        }/100`;
      }
    });
  }, []);

  useEffect(() => {
    if (post?.gifUrl) {
      postData.image = "";
      setSelectedPostImage(null);
      setPostImage(post?.gifUrl);
      //persist post text after an image/gif is selected
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    } else if (post?.image) {
      setPostImage(post?.image);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    }
    editableFields();
  }, [editableFields, post, postData]);

  useEffect(() => {
    if (!loading && apiResponse == "success") {
      dispatch(closeModal());
    }
    //submit btn disabled if ..
    setDisable(post?.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, post, postImage]);

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
                selectedPostImage || post?.gifUrl || post?.imgId
                  ? "700px"
                  : "auto",
            }}
          >
            {loading && (
              <div
                className="modal-box-loading"
                data-testid="modal-box-loading"
              >
                <span>Updating Post......</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2> Edit Post</h2>
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

            {/* If user upload post image */}
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
                    <img
                      data-testid="post-image"
                      className="post-image"
                      src={`${postImage}`}
                      alt=""
                    />
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
                label={"Update post"}
                className="post-button"
                disabled={disable}
                handleClick={updatePost}
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

export default EditPost;
