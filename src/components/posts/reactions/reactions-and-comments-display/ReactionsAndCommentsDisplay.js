import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCommentsModal,
  toggleReactionsModal,
} from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import { updatePostItem } from "../../../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../../../../services/api/post/post.service";
import { reactionsMap } from "../../../../services/utils/static.data";
import { Utils } from "../../../../services/utils/utils.service";
import like from "./../../../../assets/reactions/love.png";
import "./ReactionsAndCommentsDisplay.scss";

const ReactionsAndCommentsDisplay = ({ post }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen } = useSelector(
    (state) => state.modal
  );
  // reactions obtained from posts reaction field
  const [postReactions, setPostReactions] = useState([]);
  // formatted reactions obtained by converting posts reaction field data via Utils.formattedReactions 
  const [reactions, setReactions] = useState([]);
  
  const [postCommentNames, setPostCommentNames] = useState([]);
  const dispatch = useDispatch();

  //get post reaction from reactions schema -used when mouse hovered
  const getPostReactions = async () => {
    console.log("getting post reaction for post",post);
    console.log("formatted reaction for this post",post._id,reactions);
    console.log("postReactions::::",postReactions);
    try {
      const response = await postService.getPostReactions(post._id);
      setPostReactions(response?.data?.reactions);
    } catch (error) {
      Utils.dispatchNotification(
        error?.response?.data?.message,
        "error",
        dispatch
      );
    }
  };

  const getPostCommentNames = async () => {
    try {
      const response = await postService.getPostCommentsNames(post._id);
      console.log("comemnt names",response?.data?.comments);
      setPostCommentNames([...new Set(response?.data?.comments?.names)]);
    } catch (error) {
      Utils.dispatchNotification(
        error?.response?.data?.message,
        "error",
        dispatch
      );
    }
  };

  const sumAllReactions = (reactions) => {
    // console.log("NEW rec", reactions);
    if (reactions?.length) {
      const result = reactions
        .map((item) => item.value)
        .reduce((prev, next) => prev + next, 0);

      return Utils.shortenLargeNumbers(result);
    } else {
      return 0;
    }
  };

  const openReactionsComponent = () => {
    //update the redux sotre with the post which was clicked
    console.log("openng likes component");
    dispatch(updatePostItem(post));
    // open the modal
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  const openCommentsComponent = () => {
    console.log("openng comments component");
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(!commentsModalIsOpen));
  };

  useEffect(() => {
    //get post reaction from post schema
    setReactions(Utils.formattedReactions(post?.reactions));
  }, [post]);
  return (
    <>
      <div className="reactions-display">
        <div className="reaction">
          <div className="likes-block">
            <div className="likes-block-icons reactions-icon-display">
              {/* {console.log("postReactions", postReactions)} 
                  Display all reactions type 
              */}
              {reactions.length > 0 &&
                reactions.map((reaction) => (
                  <div className="tooltip-container" key={reaction?.type}>
                    <img
                      data-testid="reaction-img"
                      className="reaction-img"
                      src={`${reactionsMap[reaction?.type]}`}
                      alt=""
                      onMouseEnter={getPostReactions}
                    />
                    
                    {/* displays when hovered images */}
                    <div
                      className="tooltip-container-text tooltip-container-bottom"
                      data-testid="reaction-tooltip"
                    >
                      <p className="title">
                        <img
                          className="title-img"
                          src={`${reactionsMap[reaction?.type]}`}
                          alt=""
                        />
                        {reaction?.type.toUpperCase()}
                        
                      </p>
                      <div className="likes-block-icons-list">
                        {postReactions.length === 0 && (
                          <FaSpinner className="circle-notch" />
                        )}
                        {postReactions.length && (
                          <>
                          {/* Display all users who made reaction in each reaction type since 2 for loop :) */}
                            {postReactions.map((postReaction) => (
                              <div key={Utils.generateString(10)}>
                                {/* displays username having postReaction type in  same as in outer loop reaction type */}
                                {postReaction?.type === reaction.type && (
                                  <span key={postReaction?._id}>
                                    {postReaction?.username} 
                                  </span>
                                )}
                              </div>
                            ))}
                            {postReactions.length > 20 && (
                              <span>
                                and {postReactions.length - 20} others...
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <span
              data-testid="reactions-count"
              className="tooltip-container reactions-count"
              onMouseEnter={getPostReactions}
              onClick={openReactionsComponent}
            >
              {sumAllReactions(reactions)} 

              {/* showing user names when hovered over the reactions count */}
              <div
                className="tooltip-container-text tooltip-container-likes-bottom"
                data-testid="tooltip-container"
              >
                <div className="likes-block-icons-list">
                  {postReactions.length === 0 && (
                    <FaSpinner className="circle-notch" />
                  )}
                  {postReactions.length && (
                    <>
                      {postReactions.slice(0, 19).map((postReaction) => (
                        <span key={Utils.generateString(10)}>
                          {postReaction?.username}
                        </span>
                      ))}
                      {postReactions.length > 20 && (
                        <span>and {postReactions.length - 20} others...</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </span>
          </div>
        </div>
        {/* showing popup modal having lists of users info  who made comments */}
        <div
          className="comment tooltip-container"
          data-testid="comment-container"
          onClick={() => openCommentsComponent()}
        >

          {post?.commentsCount > 0 && (
            <span
              data-testid="comment-count"
              onMouseEnter={getPostCommentNames}
            >
              {Utils.shortenLargeNumbers(post?.commentsCount)}
              {`${post?.commentsCount === 1 ? " Comment" : " Comments"}`}
            </span>
          )}

        {/* tooltip to show comment names when hovered on comment text */}
          <div
            className="tooltip-container-text tooltip-container-comments-bottom"
            data-testid="comment-tooltip"
          >

            <div className="likes-block-icons-list">
              {postCommentNames.length === 0 && (
                <FaSpinner className="circle-notch" />
              )}
            {/* display all post comment names */}
              {postCommentNames.length && (
                <>
                  {postCommentNames.slice(0, 19).map((names) => (
                    <span key={Utils.generateString(10)}>{names}</span>
                  ))}
                  {postCommentNames.length > 20 && (
                    <span>and {postCommentNames.length - 20} others...</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object,
};

export default ReactionsAndCommentsDisplay;
