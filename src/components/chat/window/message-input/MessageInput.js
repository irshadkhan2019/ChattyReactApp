import React from "react";
import PropTypes from "prop-types";
import Input from "../../../inputs/Input";
import Button from "../../../button/Button";
import { FaPaperPlane } from "react-icons/fa";
import gif from "./../../../../assets/images/gif.png";
import photo from "./../../../../assets/images/photo.png";
import feeling from "./../../../../assets/images/feeling.png";
import "./MessageInput.scss";

const MessageInput = ({ setChatMessage }) => {
  return (
    <>
      <div className="chat-inputarea" data-testid="chat-inputarea">
        <form>
          <ul className="chat-list" style={{ borderColor: "#50b5ff" }}>
            <li className="chat-list-item">
              <Input
                id="image"
                name="image"
                type="file"
                className="file-input"
                placeholder="Select file"
              />

              <img src={photo} alt="" />
            </li>
            <li className="chat-list-item">
              <img src={gif} alt="" />
            </li>
            <li className="chat-list-item">
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
