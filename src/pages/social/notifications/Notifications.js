import { useState, useEffect } from "react";
import { FaCircle, FaRegCircle, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { notificationService } from "../../../services/api/notifications/notification.service";
import { NotificationUtils } from "../../../services/utils/notification-utils.service";
import { Utils } from "../../../services/utils/utils.service";
import Avatar from "./../../../components/avatar/Avatar";
import useEffectOnce from "./../../../hooks/useEffectOnce";
import "./Notifications.scss";
import NotificationPreview from "./../../../components/dialog/NotificationPreview";
const Notifications = () => {
  const { profile } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationDialogueContent, setNotificationDialogueContent] =
    useState({
      post: "",
      imgUrl: "",
      comment: "",
      reaction: "",
      senderName: "",
    });
  const dispatch = useDispatch();

  //initialize notfications
  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffectOnce(() => {
    getUserNotifications();
  });

  //Listen for socketIo events(insert update delete notification) emitted via server
  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "notificationPage"
    );
  }, [profile, notifications]);

  //when clicked on notifi mark it as read
  const markAsRead = async (notification) => {
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

  const deleteNotification = async (event, notificationId) => {
    event.stopPropagation(); //stop bubbling phase which runs onclick of parent element(markAsRead callback) also.
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

  return (
    <>
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
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {/* display all notifi if len >0 */}
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification, index) => (
              <div
                className="notification-box"
                data-testid="notification-box"
                key={index}
                onClick={() => markAsRead(notification)}
              >
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) =>
                            deleteNotification(event, notification?._id)
                          }
                        >
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? (
                            <FaCircle className="icon" />
                          ) : (
                            <FaRegCircle className="icon" />
                          )}
                        </small>
                        <p className="subtext">1 hr ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && (
          <div className="notifications-box"></div>
        )}

        {!loading && notifications.length === 0 && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};

export default Notifications;
