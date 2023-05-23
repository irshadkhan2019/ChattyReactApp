import React from "react";
import Button from "../../button/Button";
import { MdClose } from "react-icons/md";

const CloseRoomButton = () => {
  const handleLeaveRoom = () => {
    console.log("left");
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
