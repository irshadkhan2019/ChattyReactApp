import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { TbArrowsMinimize, TbArrowsMaximize } from "react-icons/tb";
import "./ResizeRoomButton.scss";

const ResizeRoomButton = ({ isRoomMinimized, handleRoomResize }) => {
  return (
    <div className="main-container">
      <Button
        label={isRoomMinimized ? <TbArrowsMaximize /> : <TbArrowsMinimize />}
        handleClick={handleRoomResize}
        className={"resize"}
      />
    </div>
  );
};

ResizeRoomButton.propTypes = {
  isRoomMinimized: PropTypes.bool,
  handleRoomResize: PropTypes.func,
};

export default ResizeRoomButton;
