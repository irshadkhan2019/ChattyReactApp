import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./../../avatar/Avatar";
import { FaSearch, FaTimes } from "react-icons/fa";
import Input from "./../../inputs/Input";
import { Utils } from "./../../../services/utils/utils.service";
import "./ChatList.scss";
import SearchList from "./search-list/SearchList";
import { userService } from "../../../services/api/user/user.service";
import useDebounce from "./../../../hooks/useDebounce";
import { ChatUtils } from "../../../services/utils/chat.utils.service";
import { setSelectedChatUser } from "../../../redux-toolkit/reducers/chat/chat.reducer";
import { chatService } from "../../../services/api/chat/chat.service";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { cloneDeep, find, findIndex } from "lodash";
import { timeAgo } from "../../../services/utils/timeago.utils";
import ChatListBody from "./ChatListBody";

const ChatList = () => {
  const { profile } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [componentType, setComponentType] = useState("chatList");
  let [chatMessageList, setChatMessageList] = useState([]);
  const debounceValue = useDebounce(search, 2000);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const searchUsers = useCallback(
    async (query) => {
      setIsSearching(true);
      console.log("Searching user now");
      try {
        setSearch(query);
        if (query) {
          const response = await userService.searchUsers(query);
          setSearchResult(response.data.search);
          setIsSearching(false);
        }
      } catch (error) {
        setIsSearching(false);
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch]
  );

  const addSelectedUserToList = useCallback(
    (user) => {
      const newUser = {
        receiverId: user?._id,
        receiverUsername: user?.username,
        receiverAvatarColor: user?.avatarColor,
        receiverProfilePicture: user?.profilePicture,
        senderUsername: profile?.username,
        senderId: profile?._id,
        senderAvatarColor: profile?.avatarColor,
        senderProfilePicture: profile?.profilePicture,
        body: "",
      };
      ChatUtils.joinRoomEvent(user, profile);
      ChatUtils.privateChatMessages = [];
      const findUser = find(
        chatMessageList,
        (chat) =>
          chat.receiverId === searchParams.get("id") ||
          chat.senderId === searchParams.get("id")
      );
      if (!findUser) {
        const newChatList = [newUser, ...chatMessageList];
        setChatMessageList(newChatList);
        if (!chatList.length) {
          dispatch(setSelectedChatUser({ isLoading: false, user: newUser }));
          const userTwoName =
            newUser?.receiverUsername !== profile?.username
              ? newUser?.receiverUsername
              : newUser?.senderUsername;
          chatService.addChatUsers({
            userOne: profile?.username,
            userTwo: userTwoName,
          });
        }
      }
    },
    [chatList, chatMessageList, dispatch, searchParams, profile]
  );

  const removeSelectedUserFromList = (event) => {
    event.stopPropagation();
    chatMessageList = cloneDeep(chatMessageList);
    const userIndex = findIndex(chatMessageList, [
      "receiverId",
      searchParams.get("id"),
    ]);
    if (userIndex > -1) {
      chatMessageList.splice(userIndex, 1);
      setSelectedUser(null);
      setChatMessageList(chatMessageList);
      ChatUtils.updatedSelectedChatUser({
        chatMessageList,
        profile,
        username: searchParams.get("username"),
        setSelectedChatUser,
        params: chatMessageList.length
          ? updateQueryParams(chatMessageList[0])
          : null,
        pathname: location.pathname,
        navigate,
        dispatch,
      });
    }
  };

  const updateQueryParams = (user) => {
    setSelectedUser(user);
    const params = ChatUtils.chatUrlParams(user, profile);
    ChatUtils.joinRoomEvent(user, profile);
    ChatUtils.privateChatMessages = [];
    return params;
  };

  // for user already exist in chat list
  const addUsernameToUrlQuery = async (user) => {
    try {
      const sender = find(
        ChatUtils.chatUsers,
        (userData) =>
          userData.userOne === profile?.username &&
          userData.userTwo.toLowerCase() === searchParams.get("username")
      );
      const params = updateQueryParams(user);
      const userTwoName =
        user?.receiverUsername !== profile?.username
          ? user?.receiverUsername
          : user?.senderUsername;
      const receiverId =
        user?.receiverUsername !== profile?.username
          ? user?.receiverId
          : user?.senderId;
      navigate(`${location.pathname}?${createSearchParams(params)}`);
      if (sender) {
        chatService.removeChatUsers(sender);
      }
      chatService.addChatUsers({
        userOne: profile?.username,
        userTwo: userTwoName,
      });
      if (user?.receiverUsername === profile?.username && !user.isRead) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (selectedUser && componentType === "searchList") {
      addSelectedUserToList(selectedUser);
    }
  }, [addSelectedUserToList, componentType, selectedUser]);

  useEffect(() => {
    if (debounceValue) {
      searchUsers(debounceValue);
    }
  }, [debounceValue, searchUsers]);

  useEffect(() => {
    setChatMessageList(chatList);
  }, [chatList]);

  useEffect(() => {
    ChatUtils.socketIOChatList(profile, chatMessageList, setChatMessageList);
  }, [chatMessageList, profile]);

  return (
    <div data-testid="chatList">
      <div className="conversation-container">
        <div className="conversation-container-header">
          <div className="header-img">
            <Avatar
              name={profile?.username}
              bgColor={profile?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={profile?.profilePicture}
            />
          </div>
          <div className="title-text">{profile?.username}</div>
        </div>

        <div
          className="conversation-container-search"
          data-testid="search-container"
        >
          <FaSearch className="search" />
          <Input
            id="message"
            name="message"
            type="text"
            value={search}
            className="search-input"
            labelText=""
            placeholder="Search"
            handleChange={(event) => {
              setIsSearching(true);
              setSearch(event.target.value);
            }}
          />
          {search && (
            <FaTimes
              className="times"
              onClick={() => {
                setIsSearching(false);
                setSearch("");
                setSearchResult([]);
              }}
            />
          )}
        </div>

        <div className="conversation-container-body">
          {console.log("chatMessageList", chatMessageList)}
          {!search && (
            <div className="conversation">
              {chatMessageList.map((data) => (
                <div
                  key={Utils.generateString(10)}
                  data-testid="conversation-item"
                  // set active user class dynamically
                  className={`conversation-item ${
                    searchParams.get("username") ===
                      data?.receiverUsername.toLowerCase() ||
                    searchParams.get("username") ===
                      data?.senderUsername.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  onClick={() => addUsernameToUrlQuery(data)}
                >
                  <div className="avatar">
                    <Avatar
                      name={
                        data.receiverUsername === profile?.username
                          ? profile?.username
                          : data?.receiverUsername
                      }
                      bgColor={
                        data.receiverUsername !== profile?.username
                          ? data?.receiverAvatarColor
                          : data?.senderAvatarColor
                      }
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={
                        data.receiverUsername !== profile?.username
                          ? data?.receiverProfilePicture
                          : data?.senderProfilePicture
                      }
                    />
                  </div>
                  <div className="title-text">
                    {data.receiverUsername !== profile?.username
                      ? data?.receiverUsername
                      : data?.senderUsername}
                  </div>
                  {data?.createdAt && (
                    <div className="created-date">
                      {timeAgo.transform(data?.createdAt)}
                    </div>
                  )}
                  {!data?.body && (
                    <div
                      className="created-date"
                      onClick={removeSelectedUserFromList}
                    >
                      <FaTimes />
                    </div>
                  )}
                  {/* <!-- chat list body component --> */}
                  {data?.body &&
                    !data?.deleteForMe &&
                    !data.deleteForEveryone && (
                      <ChatListBody data={data} profile={profile} />
                    )}
                  {data?.deleteForMe && data?.deleteForEveryone && (
                    <div className="conversation-message">
                      <span className="message-deleted">message deleted</span>
                    </div>
                  )}
                  {data?.deleteForMe &&
                    !data.deleteForEveryone &&
                    data.senderUsername !== profile?.username && (
                      <div className="conversation-message">
                        <span className="message-deleted">message deleted</span>
                      </div>
                    )}
                  {data?.deleteForMe &&
                    !data.deleteForEveryone &&
                    data.receiverUsername !== profile?.username && (
                      <ChatListBody data={data} profile={profile} />
                    )}
                  {/* <!-- chat list body component --> */}
                </div>
              ))}
            </div>
          )}

          {/* <!-- search component --> */}
          <SearchList
            searchTerm={search}
            result={searchResult}
            isSearching={isSearching}
            setSearchResult={setSearchResult}
            setIsSearching={setIsSearching}
            setSearch={setSearch}
            setSelectedUser={setSelectedUser}
            setComponentType={setComponentType}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
