import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./VideosContainer.scss";
import Video from "./Video";
import { useSelector } from "react-redux";
import { id } from "date-fns/locale";

const VideosContainer = (props) => {
  const { localStream } = useSelector((state) => state.room);
  const [isLocalStream,setIslocalStream]=useState(true)

  useEffect(()=>{
    if(localStream){
      setIslocalStream(true)
    }else{
      setIslocalStream(false)
    }
  },[localStream])

  return <div className="video-container">
    <Video stream={localStream} isLocalStream={isLocalStream}></Video>
  </div>;
};

VideosContainer.propTypes = {};

export default VideosContainer;
