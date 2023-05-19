import PropTypes from "prop-types";
import Reactions from "./../../../../posts/reactions/Reactions";
import { timeAgo } from "./../../../../../services/utils/timeago.utils";
import doubleCheckmark from "./../../../../../assets/images/double-checkmark.png";
import RightMessageBubble from "./RightMessageBubble";
import { reactionsMap } from "../../../../../services/utils/static.data";

const RightMessageDisplay = ({
  chat,
  lastChatMessage,
  profile,
  reactionRef,
  toggleReaction,
  showReactionIcon,
  index,
  activeElementIndex,
  setToggleReaction,
  handleReactionClick,
  deleteMessage,
  showReactionIconOnHover,
  setActiveElementIndex,
  setSelectedReaction,
  setShowImageModal,
  setImageUrl,
  showImageModal,
}) => {
  console.log("INSIDE RightMessageDisplay its prop are",chat);
  return (
    <>
      <div className="message right-message" data-testid="right-message">

        {/* Display Reactions if toggle reaction is true ie. user hovered the msg and clicked smiley*/}
        <div className="message-right-reactions-container">
          {toggleReaction &&
            index == activeElementIndex &&
            !chat?.deleteForEveryone &&(
              <div ref={reactionRef}>
                <Reactions
                  showLabel={false}
                  handleClick={(event) => {
                    //event->love,like,happy ...
                    console.log("reaction event",event);
                    const body = {
                      conversationId: chat?.conversationId,
                      messageId: chat?._id,
                      reaction: event,
                      type: "add",
                    };
                    //called when reaction is clicked ,passed body
                    //heps storing recation in db
                    handleReactionClick(body);
                    setToggleReaction(false);
                  }}
                />
              </div>
            )}
        </div>

        {/* COntent wrapper */}
        <div className="message-right-content-container-wrapper">
          <div
            data-testid="message-content"
            className="message-content"
            // show Dialog to delete this msg
            onClick={() => {
              if (!chat.deleteForEveryone) {
                // pass msg and type
                
                deleteMessage(chat, "deleteForEveryone");
              }
            }}
            onMouseEnter={() => {
              if (!chat.deleteForEveryone) {
                console.log("MOUSE ENTER");
                //keeps track of active element 
                setActiveElementIndex(index);

                showReactionIconOnHover(true, index);
              }
            }}
          >
            {chat?.deleteForEveryone && chat?.deleteForMe && (
              <div className="message-bubble right-message-bubble">
                <span className="message-deleted">message deleted</span>
              </div>
            )}
            {!chat?.deleteForEveryone &&
              chat?.deleteForMe &&
              chat?.senderUsername === profile?.username && (
                <div className="message-bubble right-message-bubble">
                  <span className="message-deleted">message deleted</span>
                </div>
              )}
            {!chat.deleteForEveryone && !chat?.deleteForMe && (
              // used to display actual msg
              <RightMessageBubble
                chat={chat}
                showImageModal={showImageModal}
                setImageUrl={setImageUrl}
                setShowImageModal={setShowImageModal}
              />
            )}
            {!chat.deleteForEveryone &&
              chat?.deleteForMe &&
              chat.senderUsername === profile?.username && (
                <RightMessageBubble
                  chat={chat}
                  showImageModal={showImageModal}
                  setImageUrl={setImageUrl}
                  setShowImageModal={setShowImageModal}
                />
              )}
          </div>

        {/*Displays smile emoji when msg is hovered which can be clicked to show reactions  */}
          {showReactionIcon &&
            index === activeElementIndex &&
            !chat.deleteForEveryone && (
              <div
                className="message-content-emoji-right-container"
                onClick={() => {
                  setToggleReaction(true);
                }}
              >
                &#9786;
                {console.log("showing icon---------->",showReactionIcon)}
              </div>
            )}

        </div>

        {/* Display reactions of this chat  */}
        <div className="message-content-bottom">
          {chat?.reaction &&
            chat?.reaction.length > 0 &&
            !chat.deleteForEveryone && (
              <div className="message-reaction">

                {chat?.reaction.map((data, index) => (
                  <img
                    key={index}
                    data-testid="reaction-img"
                    src={reactionsMap[data?.type]}
                    alt=""
                    onClick={() => {
                      // if the sender click this reaction for this msg then he can remove it
                      if (data?.senderName === profile?.username) {
                        const body = {
                          conversationId: chat?.conversationId,
                          messageId: chat?._id,
                          reaction: data?.type,
                          type: "remove",
                        };
                         //based on body reaction type (add,remove) api adds remove reaction from msg
                        // display Dialog modal to delete the reaction by setting reaction in msgDisplay
                        setSelectedReaction(body);
                      }
                    }}
                  />
                ))}
              </div>
            )}
            {/* show checkmark and time below msg */}
          <div className="message-time">
            {chat?.senderUsername === profile.username &&
              !chat?.deleteForEveryone && (
                <>
                  {lastChatMessage?.isRead ? (
                    <img
                      src={doubleCheckmark}
                      alt=""
                      className="message-read-icon"
                    />
                  ) : (
                    <>
                      {chat?.isRead && (
                        <img
                          src={doubleCheckmark}
                          alt=""
                          className="message-read-icon"
                        />
                      )}
                    </>
                  )}
                </>
              )}
            <span data-testid="chat-time">
              {timeAgo.timeFormat(chat?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

RightMessageDisplay.propTypes = {
  chat: PropTypes.object,
  lastChatMessage: PropTypes.object,
  profile: PropTypes.object,
  reactionRef: PropTypes.any,
  toggleReaction: PropTypes.bool,
  showReactionIcon: PropTypes.bool,
  index: PropTypes.number,
  activeElementIndex: PropTypes.number,
  setToggleReaction: PropTypes.func,
  handleReactionClick: PropTypes.func,
  deleteMessage: PropTypes.func,
  showReactionIconOnHover: PropTypes.func,
  setActiveElementIndex: PropTypes.func,
  setSelectedReaction: PropTypes.func,
  setShowImageModal: PropTypes.func,
  setImageUrl: PropTypes.func,
  showImageModal: PropTypes.bool,
};

export default RightMessageDisplay;
