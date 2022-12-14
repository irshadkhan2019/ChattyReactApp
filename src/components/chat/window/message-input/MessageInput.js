import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Input from "../../../inputs/Input";
import Button from "../../../button/Button";
import { FaPaperPlane } from "react-icons/fa";
import gif from "./../../../../assets/images/gif.png";
import photo from "./../../../../assets/images/photo.png";
import feeling from "./../../../../assets/images/feeling.png";
import loadable from "@loadable/component";
import "./MessageInput.scss";
import GiphyContainer from "../../giphy-container/GiphyContainer";
import { ImageUtils } from "./../../../../services/utils/image-utils.service";
import ImagePreview from "./../../image-preview/ImagePreview";

const EmojiPickerComponent = loadable(() => import("./EmojiPicker"), {
  fallback: <p id="loading">Loading....</p>,
});

const MessageInput = ({ setChatMessage }) => {
  const [showEmojiContainer, setShowEmojiContainer] = useState();
  const [showGifContainer, setShowGifContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [file, setFile] = useState();
  const fileInputRef = useRef();

  const handleGiphyClick = () => {};

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const addToPreview = async (file) => {
    ImageUtils.checkFile(file, "image");
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    setShowImagePreview(!showImagePreview);
    setShowEmojiContainer(false);
    setShowGifContainer(false);
  };

  return (
    <>
      {showEmojiContainer && (
        <EmojiPickerComponent
          onEmojiClick={(event, eventObject) => {
            console.log("Event object", eventObject, event);
          }}
          pickerStyle={{ width: "352px", height: "447px" }}
        />
      )}

      {showGifContainer && (
        <GiphyContainer handleGiphyClick={handleGiphyClick} />
      )}

      <div className="chat-inputarea" data-testid="chat-inputarea">
        {showImagePreview && (
          <ImagePreview
            image={file}
            onRemoveImage={() => {
              setFile("");
              setShowImagePreview(!showImagePreview);
            }}
          />
        )}
        <form>
          <ul className="chat-list" style={{ borderColor: "#50b5ff" }}>
            <li
              className="chat-list-item"
              onClick={() => {
                fileInputClicked();
                setShowEmojiContainer(false);
                setShowGifContainer(false);
              }}
            >
              <Input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                className="file-input"
                placeholder="Select file"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                  }
                }}
                handleChange={(event) => addToPreview(event.target.files[0])}
              />

              <img src={photo} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowEmojiContainer(false);
                setShowGifContainer(!showGifContainer);
                setShowImagePreview(false);
              }}
            >
              <img src={gif} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowEmojiContainer(!showEmojiContainer);
                setShowGifContainer(false);
                setShowImagePreview(false);
              }}
            >
              <img src={feeling} alt="" />
            </li>
          </ul>

          <Input
            id="message"
            name="message"
            type="text"
            className="chat-input"
            labelText=""
            placeholder="Enter your message..."
          />
        </form>
        <Button label={<FaPaperPlane />} className="paper" />
      </div>
    </>
  );
};

MessageInput.propTypes = {
  setChatMessage: PropTypes.func,
};

export default MessageInput;
