import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostWrapper from "../../modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "../modal-box-content/ModalBoxContent";
import { FaTimes } from "react-icons/fa";
import "./AddPost.scss";
import { bgColors } from "./../../../../services/utils/static.data";
import ModalBoxSelection from "./../modal-box-content/ModalBoxSelection";
import Button from "./../../../button/Button";
import { PostUtils } from "../../../../services/utils/post-utils.service";

const AddPost = () => {
  const { gifModalIsOpen } = useSelector((state) => state.modal);
  const [loading] = useState();
  const [postImage] = useState("");
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

  const selectBackground = (bgColor) => {
    PostUtils.selectBackground(
      bgColor,
      postData,
      setTextAreaBackground,
      setPostData,
      setDisable
    );
  };

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
              <button className="modal-box-header-cancel">X</button>
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
                  ></div>
                  <div className="image-display">
                    <div
                      className="image-delete-btn"
                      data-testid="image-delete-btn"
                    >
                      <FaTimes />
                    </div>
                    <img
                      data-testid="post-image"
                      className="post-image"
                      src=""
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
            <span className="char_count" data-testid="allowed-number">
              {allowedNumberOfCharacters}
            </span>
            {/* Display gif photo feeling option to select */}
            <ModalBoxSelection />

            <div className="modal-box-button" data-testid="post-button">
              <Button
                label={"Create post"}
                className="post-button"
                disabled={true}
              />
            </div>
          </div>
        )}

        {gifModalIsOpen && <div>Gif</div>}
      </PostWrapper>
    </>
  );
};

export default AddPost;
