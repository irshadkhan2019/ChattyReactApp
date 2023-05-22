import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Room.scss";

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
      Room
    </div>
  );
};

Room.propTypes = {};

export default Room;
