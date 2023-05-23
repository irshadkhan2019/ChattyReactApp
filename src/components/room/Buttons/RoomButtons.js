import React from "react";
import PropTypes from "prop-types";
import "./RoomButton.scss";
import CameraButton from "./CameraButton";
import { MicButton } from "./MicButton";
import CloseRoomButton from "./CloseRoomButton";
import ScreenShareButton from "./ScreenShareButton";

const RoomButtons = (props) => {
  return (
    <div className="room-btn-container">
      <CameraButton />
      <MicButton />
      <CloseRoomButton />
      <ScreenShareButton />
    </div>
  );
};

RoomButtons.propTypes = {};

export default RoomButtons;
