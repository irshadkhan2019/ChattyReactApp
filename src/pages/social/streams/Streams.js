import "./Streams.scss";
import { useEffect, useRef } from "react";
import Suggestions from "../../../components/suggestions/Suggestions";
import { useDispatch } from "react-redux";
import { getUserSuggestions } from "../../../redux-toolkit/api/suggestion";
import useEffectOnce from "./../../../hooks/useEffectOnce";
import PostForm from "../../../components/posts/post-form/PostForm";

const Streams = () => {
  const bodyRef = useRef();
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div
          className="streams-post"
          ref={bodyRef}
          style={{ backgroundColor: "#fff" }}
        >
          <div>
            <PostForm />
          </div>
          <div>Post items</div>
          <div
            ref={bottomLineRef}
            style={{ marginBottom: "50px", height: "50px" }}
          ></div>
        </div>
        <div className="streams-suggestions">
          <div>
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streams;
