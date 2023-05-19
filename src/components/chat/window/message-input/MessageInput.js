import React, { useEffect, useRef, useState } from "react";
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

//loadable loads EmojiPickerComponent only when its clicked
const EmojiPickerComponent = loadable(() => import("./EmojiPicker"), {
  fallback: <p id="loading">Loading....</p>,
});

const MessageInput = ({ setChatMessage }) => {
  let [message, setMessage] = useState("");
  const [showEmojiContainer, setShowEmojiContainer] = useState();
  const [showGifContainer, setShowGifContainer] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [file, setFile] = useState();
  const [base64File, setBase64File] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const fileInputRef = useRef();
  const messageInputRef = useRef();

  const handleClick = (event) => {
    event.preventDefault();
    message = message || "Sent an Image";
    setChatMessage(message.replace(/ +(?= )/g, ""), "", base64File);
    //clear the msg input after sending and saving msg to db 
    setMessage("");
    // clear/ close base64fileulr,image,emoji gif .
    reset();
  };

  //submits an msg with with image only. 
  const handleImageClick = () => {
    message = message || "Send an Image";
    setChatMessage(message.replace(/ +(?= )/g, ""), "", base64File);
    reset();
  };

  const handleGiphyClick = (url) => {
    setChatMessage("Sent a GIF", url, "");
    reset();
  };

  const fileInputClicked = () => {
    fileInputRef.current.click();
  };

  const addToPreview = async (file) => {
    ImageUtils.checkFile(file, "image");
    setFile(URL.createObjectURL(file));
    const result = await ImageUtils.readAsBase64(file);
    console.log("ADD TO PREVIEW ::::",file,URL.createObjectURL(file),result);
    setBase64File(result);
    setShowImagePreview(!showImagePreview);
    // close other containers 
    setShowEmojiContainer(false);
    setShowGifContainer(false);
  };

  const reset = () => {
    setBase64File("");
    setShowImagePreview(false);
    setShowEmojiContainer(false);
    setShowGifContainer(false);
    setFile("");
  };

  useEffect(() => {
    if (messageInputRef?.current) {
      messageInputRef.current.focus();
    }
  }, [setChatMessage]);

  return (
    <>
      {showEmojiContainer && (
        <EmojiPickerComponent
          onEmojiClick={(event, eventObject) => {
            setMessage((text) => (text += ` ${event.emoji}`));
            console.log("Event object", eventObject);
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
              //clears image and close imagepreviewmodal
              setFile("");
              setBase64File("");
              setShowImagePreview(!showImagePreview);
            }}
          />
        )}
        <form onSubmit={handleClick}>
          <ul
            className="chat-list"
            style={{ borderColor: `${hasFocus ? "#50b5ff" : "#f1f0f0"}` }}
          >
            {/* Image selector  li */}
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
                // clear previously selected file
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                  }
                }}
                //on selecting new file
                handleChange={(event) => addToPreview(event.target.files[0])}
              />

              <img src={photo} alt="" />
            </li>
            {/* gify selector */}
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
            {/* Emoji selector */}
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
            ref={messageInputRef}
            id="message"
            name="message"
            type="text"
            value={message}
            className="chat-input"
            labelText=""
            placeholder="Enter your message..."
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            handleChange={(event) => setMessage(event.target.value)}
          />
        </form>

        {/* show button to submit only if image exists and no msg  */}
        {showImagePreview && !message && (
          <Button
            label={<FaPaperPlane />}
            className="paper"
            handleClick={handleImageClick}
          />
        )}
      </div>
    </>
  );
};

MessageInput.propTypes = {
  setChatMessage: PropTypes.func,
};

export default MessageInput;
