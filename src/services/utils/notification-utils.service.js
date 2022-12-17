import { cloneDeep, find, findIndex, remove, sumBy } from "lodash";
import { notificationService } from "../api/notifications/notification.service";
import { socketService } from "./../sockets/socket.service";
import { timeAgo } from "./timeago.utils";
import { Utils } from "./utils.service";
export class NotificationUtils {
  static socketIONotification(
    profile,
    notifications,
    setNotification,
    type,
    setNotificationsCount
  ) {
    //when a new notification is inserted
    socketService?.socket?.on(
      "insert notification",
      (notificationsData, userToData) => {
        console.log(
          "Insert notification event arrived",
          notificationsData,
          userToData.userTo,
          profile._id
        );

        if (profile._id === userToData.userTo) {
          notifications = [...notifications, ...notificationsData];
          if (type === "notificationPage") {
            setNotification(notifications);
          } else {
            //for dropdown notification case
            const mappedNotifications =
              NotificationUtils.mapNotificationDropdownItems(
                notifications,
                setNotificationsCount
              );
            setNotification(mappedNotifications);
          }
        }
      }
    );

    //update as read case
    socketService?.socket?.on("update notification", (notificationId) => {
      notifications = cloneDeep(notifications);
      //get updated notification
      const notificationData = find(
        notifications,
        (notification) => notification._id === notificationId
      );

      if (notificationData) {
        //get index of the notification
        const index = findIndex(
          notifications,
          (notification) => notification._id === notificationId
        );

        //mark as read
        notificationData.read = true;
        //replace the notification data with new data where read ==true
        //here obj at index is replaced with notificationData
        notifications.splice(index, 1, notificationData);
        if (type === "notificationPage") {
          setNotification(notifications);
        } else {
          //for dropdown notification case
          const mappedNotifications =
            NotificationUtils.mapNotificationDropdownItems(
              notifications,
              setNotificationsCount
            );
          setNotification(mappedNotifications);
        }
      }
    });

    //delete notifi
    socketService?.socket?.on("delete notification", (notificationId) => {
      console.log("DELETE notification event arrived", notificationId);
      notifications = cloneDeep(notifications);
      //remove a notifi where its id is same as notificationId
      remove(
        notifications,
        (notification) => notification._id === notificationId
      );

      if (type === "notificationPage") {
        setNotification(notifications);
      } else {
        //for dropdown notification case
        const mappedNotifications =
          NotificationUtils.mapNotificationDropdownItems(
            notifications,
            setNotificationsCount
          );
        setNotification(mappedNotifications);
      }
    });
  } //eof

  static mapNotificationDropdownItems(notificationData, setNotificationsCount) {
    const items = [];
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification?.topText
          ? notification?.topText
          : notification?.message,
        subText: timeAgo.transform(notification?.createdAt),
        createdAt: notification?.createdAt,
        username: notification?.userFrom
          ? notification?.userFrom.username
          : notification?.username,
        avatarColor: notification?.userFrom
          ? notification?.userFrom.avatarColor
          : notification?.avatarColor,
        profilePicture: notification?.userFrom
          ? notification?.userFrom.profilePicture
          : notification?.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom
          ? notification?.userFrom.username
          : notification?.username,
        notificationType: notification?.notificationType,
      };
      items.push(item);
    }

    //get count of unread notification
    const count = sumBy(items, (notification) => {
      return notification.read ? 0 : 1;
    });
    setNotificationsCount(count);
    return items;
  }

  static async markMessageAsRead(
    notificationId,
    notification,
    setNotificationDialogueContent
  ) {
    //for comment and reaction notification popup
    if (notification.notificationType !== "follows") {
      const notificationDialog = {
        createdAt: notification?.createdAt,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom
          ? notification?.userFrom.username
          : notification?.username,
      };
      setNotificationDialogueContent(notificationDialog);
    }
    await notificationService.markNotficationAsRead(notificationId);
  }

  static socketIOMessageNotification(
    profile,
    messageNotifications,
    setMessageNotifications,
    setMessageCount,
    dispatch,
    location
  ) {
    socketService?.socket?.on("chat list", (data) => {
      messageNotifications = cloneDeep(messageNotifications);
      if (data?.receiverUsername === profile?.username) {
        const notificationData = {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          senderAvatarColor: data.senderAvatarColor,
          senderProfilePicture: data.senderProfilePicture,
          receiverId: data.receiverId,
          receiverUsername: data.receiverUsername,
          receiverAvatarColor: data.receiverAvatarColor,
          receiverProfilePicture: data.receiverProfilePicture,
          messageId: data._id,
          conversationId: data.conversationId,
          body: data.body,
          isRead: data.isRead,
        };
        const messageIndex = findIndex(
          messageNotifications,
          (notification) => notification.conversationId === data.conversationId
        );
        if (messageIndex > -1) {
          remove(
            messageNotifications,
            (notification) =>
              notification.conversationId === data.conversationId
          );
          messageNotifications = [notificationData, ...messageNotifications];
        } else {
          messageNotifications = [notificationData, ...messageNotifications];
        }
        const count = sumBy(messageNotifications, (notification) => {
          return !notification.isRead ? 1 : 0;
        });
        if (!Utils.checkUrl(location.pathname, "chat")) {
          Utils.dispatchNotification(
            "You have a new message",
            "success",
            dispatch
          );
        }
        setMessageCount(count);
        setMessageNotifications(messageNotifications);
      }
    });
  }
} //eoc
