import { cloneDeep, find, findIndex, remove } from "lodash";
import { notificationService } from "../api/notifications/notification.service";
import { socketService } from "./../sockets/socket.service";
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
      }
    });
  } //eof

  static async markMessageAsRead(notificationId) {
    await notificationService.markNotficationAsRead(notificationId);
  }
} //eoc
