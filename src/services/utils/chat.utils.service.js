import { cloneDeep, find, findIndex, remove } from "lodash";
import { createSearchParams } from "react-router-dom";
import { chatService } from "../api/chat/chat.service";
import { socketService } from "./../sockets/socket.service";

export class ChatUtils {
  static privateChatMessages = [];
  static chatUsers = [];

  // data is an [] of online users username . 
  static usersOnline(setOnlineUsers) {
    socketService?.socket?.on("user online", (data) => {
      console.log("user online ::::",data);
      setOnlineUsers(data);
    });
  }

  // used to update chat users when a user is on chat page
  static usersOnChatPage() {
    socketService?.socket?.on("add chat users ", (data) => {
      console.log("user on Chat page ::::",data);
      ChatUtils.chatUsers = [...data];
    });
  }

  // joins a room whith these loggedin user and target user
  static joinRoomEvent(user, profile) {
    const users = {
      receiverId: user.receiverId,
      receiverName: user.receiverUsername,
      senderId: profile?._id,
      senderName: profile?.username,
    };
    socketService?.socket?.emit("join room", users);
  }

  //reusable emit fn 
  static emitChatPageEvent(event, data) {
    socketService?.socket?.emit(event, data);
  }

  static chatUrlParams(user, profile) {
    const params = { username: "", id: "" };
    // if someone send us a msg then here receiverUsername will be us
    //and it will be same as our profile.username so we need to add
    //username and id of sender in params 
    if (user.receiverUsername === profile?.username) {
      params.username = user.senderUsername.toLowerCase();
      params.id = user.senderId;
    } else {
      params.username = user.receiverUsername.toLowerCase();
      params.id = user.receiverId;
    }
    return params;
  }

  // construct the object that contains msg data to 
  //be send to backend
  static messageData({
    receiver,
    message,
    searchParamsId,
    conversationId,
    chatMessages,
    isRead,
    gifUrl,
    selectedImage,
  }) {
    // checks if conversation already exits b/w 2 users
    const chatConversationId = find(
      chatMessages,
      (chat) =>
        chat.receiverId === searchParamsId || chat.senderId === searchParamsId
    );

    const messageData = {
      // create new chatConversationId if they are new i.e new converation started
      conversationId: chatConversationId
        ? chatConversationId.conversationId
        : conversationId,
      receiverId: receiver?._id,
      receiverUsername: receiver?.username,
      receiverAvatarColor: receiver?.avatarColor,
      receiverProfilePicture: receiver?.profilePicture,
      body: message.trim(),
      isRead,
      gifUrl,
      selectedImage,
    };
    return messageData;
  }


  static updatedSelectedChatUser({
    chatMessageList,
    profile, //me
    username, //target user to whom we want to chat
    setSelectedChatUser,
    params,
    pathname,
    navigate,
    dispatch,
  }) {
    if (chatMessageList.length) {
      // when user visit the chat page without even clicking on a user select 1st user
      //from chatMesgList and display all its message in chatWindow.
      dispatch(
        setSelectedChatUser({ isLoading: false, user: chatMessageList[0] })
      );
      // create the target query params of chat 
      navigate(`${pathname}?${createSearchParams(params)}`);

    } else {
      //if no chatMessageList exists

      dispatch(setSelectedChatUser({ isLoading: false, user: null }));

      const sender = find(
        ChatUtils.chatUsers,
        (user) =>
          user.userOne === profile?.username &&
          user.userTwo.toLowerCase() === username
      );
      if (sender) {
        chatService.removeChatUsers(sender);
        // later we add chat users again
      }
    }
  }

  // socketIO 
  //It updates the chatlist sidebar with the new user who sends the msg to the profile user 
  static socketIOChatList(profile, chatMessageList, setChatMessageList) {
    socketService?.socket?.on("chat list", (data) => {
      // update chatlist page only for sender and receiver but not all
      console.log("received socket io chat list event with data",data);
      console.log("chatMessageList so far b4 update",chatMessageList);
      if (
        data.senderUsername === profile?.username ||
        data.receiverUsername === profile?.username
      ) { 
        const messageIndex = findIndex(chatMessageList, [
          "conversationId",
          data.conversationId,
        ]);
        chatMessageList = cloneDeep(chatMessageList);
        if (messageIndex > -1) {
          remove(
            chatMessageList,
            (chat) => chat.conversationId === data.conversationId
          );
          chatMessageList = [data, ...chatMessageList];
        } else {
          remove(
            chatMessageList,
            (chat) => chat.receiverUsername === data.receiverUsername
          );
          chatMessageList = [data, ...chatMessageList];
        }
        console.log("chatMessageList after update",chatMessageList);
        setChatMessageList(chatMessageList);
      }
    });
  }


    //It updates the chatwindow msg compnent wiht new msgs sent by sender.
  static socketIOMessageReceived(
    chatMessages,
    username,
    setConversationId,
    setChatMessages
  ) {
    chatMessages = cloneDeep(chatMessages);
    socketService?.socket?.on("message received", (data) => {
      if (
        data.senderUsername.toLowerCase() === username ||
        data.receiverUsername.toLowerCase() === username
      ) {
        setConversationId(data.conversationId);
        ChatUtils.privateChatMessages.push(data);
        chatMessages = [...ChatUtils.privateChatMessages];
        setChatMessages(chatMessages);
      }
    });

    //data has isread property true
    socketService?.socket?.on("message read", (data) => {
     // restrict this event listening/updates to only for sender and receiver mentioned in msg data
      if (
        data.senderUsername.toLowerCase() === username ||
        data.receiverUsername.toLowerCase() === username
      ) {
        const findMessageIndex = findIndex(ChatUtils.privateChatMessages, [
          "_id",
          data._id,
        ]);

        if (findMessageIndex > -1) {
          //just replace the chat msg with the msg data having isread true
          ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
          chatMessages = [...ChatUtils.privateChatMessages];
          setChatMessages(chatMessages);
        }
      }
    });
  }

  //same logic as msg read above
  static socketIOMessageReaction(
    chatMessages,
    username,
    setConversationId,
    setChatMessages
  ) {
    socketService?.socket?.on("message reaction", (data) => {
      console.log("MESSAGE REACTION EVENT ARRIVES data-->",data);
      if (
        data.senderUsername.toLowerCase() === username ||
        data.receiverUsername.toLowerCase() === username
      ) {
        chatMessages = cloneDeep(chatMessages);
        setConversationId(data.conversationId);
        const messageIndex = findIndex(
          chatMessages,
          (message) => message?._id === data._id
        );
        //if msg found 
        if (messageIndex > -1) {
          //change old msg with new meg having new reactions []
          chatMessages.splice(messageIndex, 1, data);
          setChatMessages(chatMessages);
        }
      }
    });
  }
}
