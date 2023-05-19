import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { timeAgo } from "../../../../services/utils/timeago.utils";
import { Utils } from "../../../../services/utils/utils.service";
import "./MessageDisplay.scss";
import RightMessageDisplay from "./right-message-display/RightMessageDisplay";
import useDetectOutsideClick from "./../../../../hooks/useDetectOutsideClick";
import useChatScrollToBottom from "./../../../../hooks/useChatScrollToBottom";
import ImageModal from "./../../../image-modal/ImageModal";
import Dialog from "./../../../dialog/Dialog";
import LeftMessageDisplay from "./left-message-display/LeftMessageDisplay";

const MessageDisplay = ({
  chatMessages,
  profile,
  updateMessageReaction,
  deleteChatMessage, //fn to delete chat msg
}) => {

  console.log("Inside msg display chatMessages",chatMessages);
  //for image modal to show
  const [imageUrl, setImageUrl] = useState("");

  const [showReactionIcon, setShowReactionIcon] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: null,
    type: "",
  });

  const [activeElementIndex, setActiveElementIndex] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const reactionRef = useRef(null);

  // used to display reaction list in Rightmsgdisplay and leftmsgsdisplay
  const [toggleReaction, setToggleReaction] = useDetectOutsideClick(
    reactionRef,
    false
  );

  const scrollRef = useChatScrollToBottom(chatMessages);

  const showReactionIconOnHover = (show, index) => {
    console.log("showReactionIconOnHover",show,index,'active element',activeElementIndex);
    if (index === activeElementIndex || !activeElementIndex) {
      setShowReactionIcon(show);
    }
  };

  const handleReactionClick = (body) => {
    console.log("handleReactionClick passed reaction",body);
    //based on body reaction type (add,remove) api adds remove reaction from msg
    updateMessageReaction(body);
    setSelectedReaction(null);
  };

  const deleteMessage = (message, type) => {
    setDeleteDialog({
      open: true,
      message,
      type,
    });
  };

  return (
    <>
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      {/* Popup Diaog modal to remove reaction from a msg when 
          the reaction owner clicks on reaction in 
          rightmsddsiplay compoennt   */}

      {selectedReaction && (
        <Dialog
          title="Do you want to remove your reaction"
          firstButtonText="Remove"
          secondButtonText="Cancel"
          // removes reaction
          firstBtnHandler={() => handleReactionClick(selectedReaction)}
          //cancel this operation
          secondBtnHandler={() => setSelectedReaction(null)}
        />
      )}

      {/* msg deletion when user clicks on msg in Right/Left component Display  */}

      {deleteDialog.open && (
        <Dialog
          title="Delete message"
          firstButtonText={`${
            deleteDialog.type === "deleteForMe"
              ? "DELETE FOR ME"
              : "DELETE FOR EVERYONE"
          }`}
          secondButtonText="Cancel"

          firstBtnHandler={() => {
            const { message, type } = deleteDialog;

            // fn defined in chatWindow called to delete this msg
            deleteChatMessage(
              message.senderId,
              message.receiverId,
              message._id,
              type
            );
            // close modal /clears
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
          secondBtnHandler={() => {
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
        />
      )}
      <div ref={scrollRef} className="message-page " data-testid="message-page">
        {chatMessages.map((chat, index) => (
          <div
            key={Utils.generateString(10)}
            className="message-chat"
            data-testid="message-chat"
          >
            {/* separate msgs based on its dates i.e show date when next msg and prev msg not on same day */}
            {index === 0 ||
              (timeAgo.dayMonthYear(chat.createdAt) !==
                timeAgo.dayMonthYear(chatMessages[index - 1].createdAt) && (
                <div className="message-data-group">
                  <div
                    className="message-chat-date"
                    data-testid="message-chat-date"
                  >
                    {timeAgo.chatMessageTransform(chat.createdAt)}
                  </div>
                </div>
              ))}
              {/* show msgs to sender and receiver */}
            {(chat.receiverUsername === profile?.username ||
              chat.senderUsername === profile?.username) && (
              <>
                {/* show msgs sent by us in rhs view pf msgDisplay   */}
                {chat.senderUsername === profile?.username && (
                  <RightMessageDisplay
                    chat={chat}
                    lastChatMessage={chatMessages[chatMessages.length - 1]}
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}
                {/* msg sent by others to us show on lhs of msgDisplay */}
                {chat.receiverUsername === profile?.username && (
                  <LeftMessageDisplay
                    chat={chat}
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

MessageDisplay.propTypes = {
  chatMessages: PropTypes.array,
  profile: PropTypes.object,
  updateMessageReaction: PropTypes.func,
  deleteChatMessage: PropTypes.func,
};

export default MessageDisplay;
