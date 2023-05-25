import { setLocalStream } from "../../redux-toolkit/reducers/room/room.reducer";
import { store } from "../../redux-toolkit/store";

const onlyAudioConstraints={
  audio:true,
  video:false
}
const defaultConstraints={
  audio:true,
  video:true
}

export const getLocalStreamPreview=(onlyAudio=false,callbackfn)=>{
  const constraints=onlyAudio?onlyAudioConstraints:defaultConstraints;
  navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{

    store.dispatch(setLocalStream({stream:stream}))
    callbackfn()
  }).catch((err)=>{
    console.log(err,"can't get access to local stream")
  })
}