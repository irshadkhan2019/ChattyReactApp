import axios from "./../../axios";

class ChatService {
  async getChatConversationList() {
    const response = await axios.get("/chat/message/conversation-list");
    return response;
  }
  async removeChatUsers(body) {
    const response = await axios.post("/chat/message/remove-chat-users", body);
    return response;
  }
}

export const chatService = new ChatService();
