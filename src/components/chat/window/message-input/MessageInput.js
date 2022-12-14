import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../../../inputs/Input";
import Button from "../../../button/Button";
import { FaPaperPlane } from "react-icons/fa";
import gif from "./../../../../assets/images/gif.png";
import photo from "./../../../../assets/images/photo.png";
import feeling from "./../../../../assets/images/feeling.png";
import loadable from "@loadable/component";
import "./MessageInput.scss";

const EmojiPickerComponent = loadable(() => import("./EmojiPicker"), {
  fallback: <p id="loading">Loading....</p>,
});

const MessageInput = ({ setChatMessage }) => {
  const [showEmojiContainer, setShowEmojiContainer] = useState();

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
      <div className="chat-inputarea" data-testid="chat-inputarea">
        <form>
          <ul className="chat-list" style={{ borderColor: "#50b5ff" }}>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowEmojiContainer(false);
              }}
            >
              <Input
                id="image"
                name="image"
                type="file"
                className="file-input"
                placeholder="Select file"
              />

              <img src={photo} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowEmojiContainer(false);
              }}
            >
              <img src={gif} alt="" />
            </li>
            <li
              className="chat-list-item"
              onClick={() => {
                setShowEmojiContainer(!showEmojiContainer);
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
