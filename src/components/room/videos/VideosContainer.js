import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./VideosContainer.scss";
import Video from "./Video";
import { useSelector } from "react-redux";
import { id } from "date-fns/locale";

const VideosContainer = (props) => {
  const { localStream } = useSelector((state) => state.room);
  const { remoteStreams } = useSelector((state) => state.room);

  console.log("VIDEOSCONTAINER_REMOTE_STREAM::",remoteStreams)
  return <div className="video-container">
    <Video stream={localStream} isLocalStream={true}></Video>
    {remoteStreams.map((stream)=>(
       <Video stream={stream} isLocalStream={false} key={stream.id}></Video>
    ))}
    
  </div>;
};

VideosContainer.propTypes = {};

export default VideosContainer;
