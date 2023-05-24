import React from "react";
import PropTypes from "prop-types";
import { FaPlusCircle } from "react-icons/fa";
import Button from "./Button";
import "./CreateRoomButton.scss";
import { createNewRoom } from "../../services/sockets/room.service";

const CreateRoomButton = (props) => {
  const createNewRoomHandler = () => {
    console.log("creating new room");
    createNewRoom();
  };
  return (
    <Button
      handleClick={createNewRoomHandler}
      label={<FaPlusCircle size={24}></FaPlusCircle>}
      className={"room_btn"}
    />
  );
};

CreateRoomButton.propTypes = {};

export default CreateRoomButton;
