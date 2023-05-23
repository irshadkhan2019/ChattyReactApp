import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Room.scss";
import ResizeRoomButton from "./../button/ResizeRoomButton";
import RoomButtons from "./Buttons/RoomButtons";
import VideosContainer from "./videos/VideosContainer";
const Room = (props) => {
  const [isRoomMinimized, setIsRoomMinimized] = useState(true);

  const roomResizeHandler = () => {
    setIsRoomMinimized(!isRoomMinimized);
  };

  return (
    <div
      className={`main-container ${
        isRoomMinimized ? "minimized-screen" : "full-screen"
      }`}
    >
      <VideosContainer />
      <RoomButtons />
      <ResizeRoomButton
        isRoomMinimized={isRoomMinimized}
        handleRoomResize={roomResizeHandler}
      />
    </div>
  );
};

Room.propTypes = {};

export default Room;
