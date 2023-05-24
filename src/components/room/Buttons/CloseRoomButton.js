import React from "react";
import Button from "../../button/Button";
import { MdClose } from "react-icons/md";
import { leaveRoom } from "../../../services/sockets/room.service";
import { useSelector } from "react-redux";

const CloseRoomButton = () => {
  const handleLeaveRoom = () => {
    leaveRoom();
  };

  return (
    <div>
      <Button
        label={<MdClose size={24} />}
        handleClick={handleLeaveRoom}
        className={"resize"}
      />
    </div>
  );
};

export default CloseRoomButton;
