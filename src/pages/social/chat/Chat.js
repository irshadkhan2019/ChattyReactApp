import { useDispatch, useSelector } from "react-redux";
import ChatList from "../../../components/chat/list/ChatList";
import ChatWindow from "../../../components/chat/window/ChatWindow";
import useEffectOnce from "./../../../hooks/useEffectOnce";
import { getConversationList } from "./../../../redux-toolkit/api/chat";
import "./Chat.scss";
import { socketService } from "../../../services/sockets/socket.service";
const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  //console.log(chatList,"selectedChatUser",selectedChatUser)
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList());

    //get active rooms,emits an event to server to get active rooms
    console.log("GETTING ACTIVE ROOMS ");
    socketService.getActiveRooms();
  });

  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div className="private-chat-wrapper-content-side">
          <ChatList />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          {(selectedChatUser || chatList.length > 0) && <ChatWindow />}

          {!selectedChatUser && !chatList.length && (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Chat;
