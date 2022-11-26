import PropTypes from "prop-types";
import { FaRegCommentAlt } from "react-icons/fa";
import "./CommentArea.scss";
import like from "./../../../assets/reactions/like.png";
import Reactions from "../reactions/Reactions";

const CommentArea = ({ post }) => {
  const addReactionPost = async (reaction) => {
    console.log("reaction", reaction, "is clicked");
  };
  return (
    <>
      <div className="comment-area" data-testid="comment-area">
        <div className="like-icon reactions">
          <div className="likes-block">
            <div className="like likes-block-icons reaction-icon">
              <div
                className="reaction-display like"
                data-testid="selected-reaction"
              >
                <img className="reaction-img" src={like} alt="" />
                <span>Like</span>
              </div>
              {/* <div className="reaction-display" data-testid="default-reaction">
                  <img className="reaction-img" src="" alt="" /> <span>Like</span>
                </div> */}
            </div>
          </div>
          <div className="reactions-container app-reactions">
            <Reactions handleClick={addReactionPost} />
          </div>
        </div>
        <div className="comment-block">
          <span className="comments-text">
            <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
          </span>
        </div>
      </div>
    </>
  );
};

CommentArea.propTypes = {
  post: PropTypes.object,
};

export default CommentArea;
