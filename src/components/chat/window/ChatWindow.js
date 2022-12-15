import { some } from "lodash";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { chatService } from "../../../services/api/chat/chat.service";
import { userService } from "../../../services/api/user/user.service";
import { ChatUtils } from "../../../services/utils/chat.utils.service";
import { Utils } from "../../../services/utils/utils.service";
import Avatar from "../../avatar/Avatar";
import "./ChatWindow.scss";
import MessageInput from "./message-input/MessageInput";

const ChatWindow = () => {
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);
  const [receiver, setReceiver] = useState();
  const [conversationId, setConversationId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();

  const getChatMessages = useCallback(
    async (receiverId) => {
      try {
        //get chat msg
        const response = await chatService.getChatMessages(receiverId);
        console.log("messgaeLIst", response.data.messages);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch]
  );

  const getNewUserMessages = useCallback(() => {
    if (searchParams.get("id") && searchParams.get("username")) {
      setConversationId("");
      setChatMessages([]);
      getChatMessages(searchParams.get("id"));
    }
  }, [getChatMessages, searchParams]);

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(
        searchParams.get("id")
      );
      setReceiver(response.data.user);
      ChatUtils.joinRoomEvent(response.data.user, profile);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, profile, searchParams]);

  const sendChatMessage = async (message, gifUrl, selectedImage) => {
    // console.log(message, gifUrl, selectedImage);
    try {
      const checkUserOne = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === profile?.username &&
          user?.userTwo === receiver?.username
      );

      const checkUserTwo = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === receiver?.username &&
          user?.userTwo === profile?.username
      );

      const messageData = ChatUtils.messageData({
        receiver,
        conversationId,
        message,
        searchParamsId: searchParams.get("id"),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: checkUserOne && checkUserTwo,
      });

      console.log("Saving chat data", messageData);
      await chatService.saveChatMessage(messageData);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(
        chatMessages,
        searchParams.get("username"),
        setConversationId,
        setChatMessages
      );
    }
    if (!rendered) setRendered(true);

    ChatUtils.usersOnline(setOnlineUsers());
    ChatUtils.usersOnChatPage();
  }, [chatMessages, searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setConversationId,
      setChatMessages
    );
  }, [chatMessages, searchParams]);

  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading" data-testid="message-loading"></div>
      ) : (
        <div data-testid="chatWindow">
          <div className="chat-title" data-testid="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver?.username}
                  bgColor={receiver.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={receiver?.profilePicture}
                />
              </div>
            )}

            <div className="chat-title-items">
              <div
                className={`chat-name ${
                  Utils.checkIfUserIsOnline(receiver?.username, onlineUsers)
                    ? ""
                    : "user-not-online"
                }`}
              >
                {receiver?.username}
              </div>

              {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                <span className="chat-active">Online</span>
              )}
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">Message display component</div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
