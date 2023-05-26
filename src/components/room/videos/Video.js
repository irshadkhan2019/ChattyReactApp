import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import "./Video.scss"

const Video = ({stream,isLocalStream}) => {
  // need to change how stream is stored (non-serializable obj not allowed in store)
  console.log("INSIDE VIDEO:::",stream)
  const videoRef=useRef();

  useEffect(()=>{
    const video=videoRef.current;
    video.srcObject=stream;

    video.onLoadedmetadata=()=>{
      video.play();
    }
  },[stream])

  return (
    <div className='video-main-container'>
      <video className='video-el' ref={videoRef} autoPlay muted={isLocalStream?true:false} />
    </div>
  )
}

Video.propTypes = {
  stream:PropTypes.any,
  isLocalStream:PropTypes.bool
  
}

export default Video