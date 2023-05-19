import React from "react";
import PropTypes from "prop-types";
import { FaCheck, FaCircle } from "react-icons/fa";
import doubleCheckmark from "./../../../assets/images/double-checkmark.png";

// receives data which is last msg for a conversation .
const ChatListBody = ({ data, profile }) => {
  return (
    <div className="conversation-message">
      <span>{data.body}</span>
      {!data.isRead ? (
        <>
        {/* data/msg  not read and the msg was for profile user i.e to us  sent by others.   */}
          {data.receiverUsername === profile?.username ? (
            // show us normal icon
            <FaCircle className="icon" />
          ) : (
            // show others we did'nt read msg
            <FaCheck className="icon not-read" />
          )}
        </>
      ) : (
        <>
        {/* show sender that the data was read by receiver */}
          {data.senderUsername === profile?.username && (
            <img src={doubleCheckmark} alt="" className="icon read" />
          )}
        </>
      )}
    </div>
  );
};

ChatListBody.propTypes = {
  data: PropTypes.object,
  profile: PropTypes.object,
};

export default ChatListBody;
