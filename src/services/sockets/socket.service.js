import { io } from "socket.io-client";
import { newRoomCreated, updateActiveRooms } from "./room.service";
import { store } from "../../redux-toolkit/store";
import Peer from "simple-peer"
import { setRemoteStreams } from "../../redux-toolkit/reducers/room/room.reducer";

class SocketService {
  socket;
  peers={};
  setupSocketConnection() {
    // connect to node js app
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      transports: ["websocket"],
      secure: true,
    });
    this.peers={}
    this.socketConnectionEvents();
  }
  socketConnectionEvents() {
    this.socket.on("connect", () => {
      console.log("connected");
    });
    this.socket.on("disconnect", (reason) => {
      console.log("connected due to:", reason);
      this.socket.connect();
    });

    this.socket.on("connect_error", (error) => {
      console.log("Error", error);
      this.socket.connect();
    });
    //listen for new room events created by us
    this.socket.on("room-create", (roomDetails) => {
      newRoomCreated({ roomDetails });
    });

    // listen for all active rooms
    this.socket.on("active-rooms", (activeRooms) => {
      updateActiveRooms(activeRooms);
    });
    // listen for signaling  data
    this.socket.on("conn-signal", (data) => {
      //data format  is signalData from prepareNewPeerConnection fn
      this.handleSignalingData(data)

    });
    //new users recieves that others have prepared to accept connections
    this.socket.on("conn-init", (data) => {
      const {conUserSocketId}=data;
      
      this.prepareNewPeerConnection(conUserSocketId,true)
    });

    // new users joins and sends his socket id to prepare for connection
    this.socket.on("conn-prepare", (data) => {
        const {conUserSocketId}=data;
        this.prepareNewPeerConnection(conUserSocketId,false)
        //tells the new joined user that i am ready for connection
        this.socket.emit('conn-init',{
          conUserSocketId
        })
      });
  }

  handleSignalingData(data){
    const {conUserSocketId,signal}=data;

    //add signal data to conUserSocketId obj
    if(this.peers[conUserSocketId]){
      this.peers[conUserSocketId].signal(signal)
       }
    }
  // create a room and emit event to server
  createNewRoom = (user) => {
    this.socket.emit("room-create", user);
  };

  // prefetch rooms for page reload case
  getActiveRooms = () => {
    this.socket.emit("get-active-room");
  };

  getConfiguration=()=>{
    const turnIceServers=null;

    if(turnIceServers){
      //use turn server creds
    }else{
        console.warn("using ony stun server");
        // to get internet details connection
        return{
          iceServer:[
            {
              urls:'stun:stun.l.google.com:19302'
            }
          ]
        }
    }

  }

  // To Join a room,emit event to server
  joinRoom = (user, roomId) => {
    this.socket.emit("room-join", { user, roomId });
  };
  // To leave a room,emit event to server
  leaveRoom = (user, roomId) => {
    console.log("leaving room", user.profile._id, roomId);
    this.socket.emit("room-leave", { user, roomId });
  };


  //takes new joinee socket id and if the current user is initiator or not
  prepareNewPeerConnection=(conUserSocketId,isInitiator)=>{
    const localStream=store.getState().room.localStream;

    if(isInitiator){
      console.log("preparing new peer connection as initiator")
    }else{
      console.log("preparing new peer connection not as  initiator")
    }
    // create peer obj for user who has just joined room 
    this.peers[conUserSocketId]=new Peer({
      initiator:isInitiator,
      config:this.getConfiguration(),//prepares our internet info
      stream:localStream //attach our localStream ,to broadcast to other users
    });
  
    //after getting our sdp data and ice candidate via getConfiguration(),signal is triggerd,
    //we need to share this with other users
    this.peers[conUserSocketId].on('signal',data=>{
      const signalData={
        signal:data,//data received via getConfiguration()
        conUserSocketId,//to which  user we want to pass this signaling data
      }
     // console.log("signalData",signalData)
      // todo :pass signaling data to other user
      this.signalPeerData(signalData)
    })
    //event triggers when connection is established with other user
    this.peers[conUserSocketId].on("stream",(remoteStream)=>{
      //Todod add new remote stream to server store
      console.log("Direct con established,remoteStream CAME ::::::",remoteStream);
      //add info to remoteSteam ,abt the user whose this  stream is . 
      remoteStream.conUserSocketId=conUserSocketId;
      this.addNewRemoteStream(remoteStream)
    })

    console.log("PEERS:::",this.peers)

  }

  // to pass signal data to other user
 signalPeerData=(data)=>{
    this.socket.emit('conn-signal',data)
 }

 addNewRemoteStream=(remoteStream)=>{
    const remoteStreams=store.getState().room.remoteStreams;
    const addNewRemoteStream=[...remoteStreams,remoteStream]
    console.log("addNewRemoteStream",addNewRemoteStream)
    store.dispatch(setRemoteStreams(addNewRemoteStream))
 }

}
export const socketService = new SocketService();
