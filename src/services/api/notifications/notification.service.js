import axios from "./../../axios";

class NotificationService {
  async getUserNotifications() {
    console.log("getting user notifications");
    const response = await axios.get("/notifications");
    return response;
  }

  async markNotficationAsRead(notificationId) {
    const response = await axios.put(`/notification/${notificationId}`);
    return response;
  }

  async deleteNotification(notificationId) {
    const response = await axios.delete(`/notification/${notificationId}`);
    return response;
  }
}

export const notificationService = new NotificationService();
