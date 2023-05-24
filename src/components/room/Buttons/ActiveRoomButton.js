import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Button from "./../../button/Button";
import Avatar from "../../avatar/Avatar";
import { userService } from "../../../services/api/user/user.service";
import { Utils } from "../../../services/utils/utils.service";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./ActiveRoomButton.scss";

const ActiveRoomButton = (props) => {
  const { roomId, creatorUsername, amountOfParticipants, isUserInRoom } = props;
  const [roomOwner, setRoomOwner] = useState();
  const dispatch = useDispatch();
  const activeRoomButtonDisabled = amountOfParticipants > 3;
  const roomTitle = `Creator:${creatorUsername} . Connected : ${amountOfParticipants}`;
  console.log(
    "ActiveRoomButton Props,",
    roomId,
    creatorUsername,
    amountOfParticipants,
    isUserInRoom
  );

  const handleJoinActiveRoom = () => {
    if (amountOfParticipants < 4) {
      console.log("Joining room ");
    }
  };

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(roomId);
      console.log("getUserProfileByUserId Room::", response.data.user);
      setRoomOwner(response.data.user);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [roomId]);

  useEffect(() => {
    getUserProfileByUserId();
  }, [getUserProfileByUserId]);

  return (
    <div>
      <Button
        label={
          <Avatar
            name={roomOwner?.username}
            bgColor={roomOwner?.avatarColor}
            textColor="#ffffff"
            size={36}
            avatarSrc={roomOwner?.profilePicture}
          />
        }
        handleClick={handleJoinActiveRoom}
        disabled={activeRoomButtonDisabled || isUserInRoom}
        className={"container"}
      />
    </div>
  );
};

ActiveRoomButton.propTypes = {
  roomId: PropTypes.string,
  creatorUsername: PropTypes.string,
  amountOfParticipants: PropTypes.number,
  key: PropTypes.string,
  isUserInRoom: PropTypes.bool,
};

export default ActiveRoomButton;
