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
import { toggleGifModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import Giphy from "../../../giphy/Giphy";

const AddPost = () => {
  const { gifModalIsOpen } = useSelector((state) => state.modal);
  const { gifUrl, image } = useSelector((state) => state.post);
  const [loading] = useState();
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
  });

  const [disable, setDisable] = useState(false);
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
      setPostData,
      setDisable
    );
  };

  const postInputEditable = (event, textContent) => {
    console.log(textContent);
    const currentTextlength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextlength;
    counterRef.current.textContent = `${counter}/100`;

    PostUtils.postInputEditable(textContent, postData, setPostData, setDisable);
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
      setDisable,
      setPostData
    );
  };

  useEffect(() => {
    console.log("change in img");
    if (gifUrl) {
      setPostImage(gifUrl);
      //persist post text after an image/gif is selected
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (image) {
      setPostImage(image);
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    }
  }, [gifUrl, image]);

  return (
    <>
      <PostWrapper>
        <div></div>

        {!gifModalIsOpen && (
          <div className="modal-box">
            {loading && (
              <div
                className="modal-box-loading"
                data-testid="modal-box-loading"
              >
                <span>Posting......</span>
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
                        name="post"
                        contentEditable={true}
                        data-placeholder="What's on your mind?...."
                        className={`editable flex-item ${
                          textAreaBackground !== "#ffffff"
                            ? "textinputColor"
                            : ""
                        }`}
                        onInput={(e) =>
                          postInputEditable(e, e.currentTarget.textContent)
                        }
                        onKeyDown={onKeyDown}
                        ref={(el) => {
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
                    onClick={() => selectBackground(color)}
                  ></li>
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
                disabled={true}
              />
            </div>
          </div>
        )}

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

export default AddPost;
