import logo from "./../../assets/images/logo.svg";
import {
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegEnvelope,
} from "react-icons/fa";

import "./Header.scss";
import Avatar from "../avatar/Avatar";
import { useEffect, useRef, useState } from "react";
import { Utils } from "../../services/utils/utils.service";
import useDetectOutsideClick from "./../../hooks/useDetectOutsideClick";
import MessageSidebar from "../message-sidebar/MessageSidebar";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../dropdown/Dropdown";
import useEffectOnce from "./../../hooks/useEffectOnce";
import { ProfileUtils } from "../../services/utils/profile-utils.service";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "./../../hooks/useLocalStorage";
import useSessionStorage from "./../../hooks/useSessionStorage";
import { userService } from "./../../services/api/user/user.service";
import HeaderSkeleton from "./HeaderSkeleton";
import { notificationService } from "../../services/api/notifications/notification.service";
import { NotificationUtils } from "../../services/utils/notification-utils.service";
import NotificationPreview from "../dialog/NotificationPreview";
import { socketService } from "../../services/sockets/socket.service";

const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogueContent, setNotificationDialogueContent] =
    useState({
      post: "",
      imgUrl: "",
      comment: "",
      reaction: "",
      senderName: "",
    });
  const [environment, setEnvironment] = useState("");
  const [settings, setSettings] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const [deleteStorageUsername] = useLocalStorage("username", "delete");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [deleteSessionPageReload] = useSessionStorage("pageReload", "delete");
  const storedUsername = useLocalStorage("username", "get");

  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
    settingsRef,
    false
  );

  const backgroundColor = `${
    environment === "DEV" ? "#50b5ff" : environment === "STG" ? "#e9710f" : ""
  }`;

  const openChatPage = () => {
    console.log("opening chat page");
  };

  const onLogout = async () => {
    try {
      Utils.clearStore({
        dispatch,
        deleteStorageUsername,
        deleteSessionPageReload,
        setLoggedIn,
      });
      await userService.logoutUser();
      Utils.dispatchNotification("logOut Successfull", "success", dispatch);
      navigate("/");
    } catch (error) {
      //send toast error notification
      const message = error.response.data.message;
      const type = "error";
      Utils.dispatchNotification(message, type, dispatch);
    }
  };

  //initialize notfications
  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      //need transformed notification in dropdown
      const mappedNotifications =
        NotificationUtils.mapNotificationDropdownItems(
          response.data.notifications,
          setNotificationCount
        );

      setNotifications(mappedNotifications);

      //emit event to server abt his connection
      socketService?.socket.emit("setup", { userId: storedUsername });
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  //when clicked on notifi mark it as read
  const onMarkAsRead = async (notification) => {
    try {
      const response = NotificationUtils.markMessageAsRead(
        notification?._id,
        notification,
        setNotificationDialogueContent
      );
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const onDeleteNotification = async (notificationId) => {
    const response = await notificationService.deleteNotification(
      notificationId
    );

    Utils.dispatchNotification(response.data.message, "success", dispatch);
    try {
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  });

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
  }, []);

  //Listen for socketIo events(insert update delete notification) emitted via server
  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "headerNotification",
      setNotificationCount
    );
  }, [profile, notifications]);

  return (
    <>
      {/* while profile loads show skeleton component  */}
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar
                profile={profile}
                messageCount={0}
                messageNotifications={[]}
                openChatPage={openChatPage}
              />
            </div>
          )}
          <div className="header-navbar">
            <div
              className="header-image"
              data-testid="header-image"
              onClick={() => navigate("/app/social/streams")}
            >
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Chatty
                {environment && (
                  <span
                    className="environment"
                    style={{ backgroundColor: `${backgroundColor}` }}
                  >
                    {environment}
                  </span>
                )}
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              {/* Notification section */}
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(!isNotificationActive);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {/* display red dot glow if >0 notifications */}
                  {notificationCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="notification-dots"
                    >
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "250px", top: "20px" }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              {/* message section */}
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(!isMessageActive);
                  setIsNotificationActive(false);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  <span
                    className="bg-danger-dots dots"
                    data-testid="messages-dots"
                  ></span>
                </span>
                &nbsp;
              </li>
              {/* settings section */}
              <li
                className="header-nav-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                  setIsSettingsActive(!isSettingsActive);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#333"
                    size={40}
                    round={true}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {isSettingsActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "150px", top: "40px" }}
                        data={settings}
                        notificationCount={notificationCount}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() =>
                          ProfileUtils.navigateToProfile(profile, navigate)
                        }
                      />
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* notification preview popup */}
      {notificationDialogueContent?.senderName && (
        <NotificationPreview
          title={`Tour Post`}
          post={notificationDialogueContent.post}
          imgUrl={notificationDialogueContent.imgUrl}
          comment={notificationDialogueContent.comment}
          reaction={notificationDialogueContent.reaction}
          senderName={notificationDialogueContent.senderName}
          secondButtonText="Close"
          secondBtnHandler={() => {
            setNotificationDialogueContent({
              post: "",
              imgUrl: "",
              comment: "",
              reaction: "",
              senderName: "",
            });
          }}
        />
      )}
    </>
  );
};
export default Header;
