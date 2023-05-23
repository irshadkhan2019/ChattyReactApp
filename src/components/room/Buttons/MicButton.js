import React from "react";
import { useState } from "react";
import { BsFillMicMuteFill } from "react-icons/bs";
import { BsFillMicFill } from "react-icons/bs";
import Button from "../../button/Button";

export const MicButton = () => {
  const [micEnabled, setMicEnabled] = useState(false);

  const handleToggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <div>
      <Button
        label={
          micEnabled ? (
            <BsFillMicMuteFill size={24} />
          ) : (
            <BsFillMicFill size={24} />
          )
        }
        handleClick={handleToggleMic}
        className={"resize"}
      />
    </div>
  );
};
