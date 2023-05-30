import React from "react";
import PropTypes from "prop-types";
import "./RoomButton.scss";
import CameraButton from "./CameraButton";
import { MicButton } from "./MicButton";
import CloseRoomButton from "./CloseRoomButton";
import ScreenShareButton from "./ScreenShareButton";
import { useSelector } from "react-redux";

const RoomButtons = (props) => {
  const {localStream}=useSelector((state)=>state.room)
  return (
    <div className="room-btn-container">
      <CameraButton localStream={localStream}/>
      <MicButton localStream={localStream} />
      <CloseRoomButton />
      <ScreenShareButton />
    </div>
  );
};

RoomButtons.propTypes = {};

export default RoomButtons;
