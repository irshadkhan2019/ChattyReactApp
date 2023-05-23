import React from "react";
import Button from "../../button/Button";
import { useState } from "react";
import { MdScreenShare } from "react-icons/md";
import { MdStopScreenShare } from "react-icons/md";

const ScreenShareButton = () => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);

  const handleScreenShareToggle = () => {
    setIsScreenSharingActive(!isScreenSharingActive);
  };

  return (
    <div>
      <Button
        label={
          isScreenSharingActive ? (
            <MdStopScreenShare size={24} />
          ) : (
            <MdScreenShare size={24} />
          )
        }
        handleClick={handleScreenShareToggle}
        className={"resize"}
      />
    </div>
  );
};

export default ScreenShareButton;
