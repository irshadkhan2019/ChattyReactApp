import axios from "./../../axios";

class ChatService {
  async getChatConversationList() {
    const response = await axios.get("/chat/message/conversation-list");
    return response;
  }
}

export const chatService = new ChatService();
