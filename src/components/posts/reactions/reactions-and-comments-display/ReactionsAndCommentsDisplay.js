import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleReactionsModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import { updatePostItem } from "../../../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../../../../services/api/post/post.service";
import { reactionsMap } from "../../../../services/utils/static.data";
import { Utils } from "../../../../services/utils/utils.service";
import like from "./../../../../assets/reactions/love.png";
import "./ReactionsAndCommentsDisplay.scss";

const ReactionsAndCommentsDisplay = ({ post }) => {
  const { reactionsModalIsOpen } = useSelector((state) => state.modal);
  const [postReactions, setPostReactions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const dispatch = useDispatch();

  //get post reaction fro reactions schema
  const getPostReactions = async () => {
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
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
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
              {/* {console.log("postReactions", postReactions)} */}
              {reactions.length > 0 &&
                reactions.map((reaction) => (
                  <div
                    className="tooltip-container"
                    key={Utils.generateString(10)}
                  >
                    <img
                      data-testid="reaction-img"
                      className="reaction-img"
                      src={`${reactionsMap[reaction?.type]}`}
                      alt=""
                      onMouseEnter={getPostReactions}
                    />
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
                            {postReactions.map((postReaction) => (
                              <div key={Utils.generateString(10)}>
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
                      {postReactions.map((postReaction) => (
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
        <div
          className="comment tooltip-container"
          data-testid="comment-container"
        >
          <span data-testid="comment-count">20 Comments</span>
          <div
            className="tooltip-container-text tooltip-container-comments-bottom"
            data-testid="comment-tooltip"
          >
            <div className="likes-block-icons-list">
              <FaSpinner className="circle-notch" />
              <div>
                <span>Stan</span>
                <span>and 50 others...</span>
              </div>
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
