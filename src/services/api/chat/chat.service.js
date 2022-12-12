import axios from "./../../axios";

class ChatService {
  async getChatConversationList() {
    const response = await axios.get("/chat/message/conversation-list");
    return response;
  }

  async addChatUsers(body) {
    const response = await axios.post("/chat/message/add-chat-users", body);
    return response;
  }

  async removeChatUsers(body) {
    const response = await axios.post("/chat/message/remove-chat-users", body);
    return response;
  }

  async markMessagesAsRead(senderId, receiverId) {
    const response = await axios.put("/chat/message/mark-as-read", {
      senderId,
      receiverId,
    });
    return response;
  }
}

export const chatService = new ChatService();
