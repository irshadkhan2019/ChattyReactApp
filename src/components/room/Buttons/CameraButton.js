import React from "react";
import Button from "../../button/Button";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { BsCameraVideoFill } from "react-icons/bs";
import { useState } from "react";

const CameraButton = ({localStream}) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const handleToggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    localStream.getVideoTracks()[0].enabled=cameraEnabled;
  };

  return (
    <div>
      <Button
        label={
          cameraEnabled ? (
            <BsCameraVideoOffFill size={24} />
          ) : (
            <BsCameraVideoFill size={24} />
          )
        }
        handleClick={handleToggleCamera}
        className={"resize"}
      />
    </div>
  );
};

export default CameraButton;
