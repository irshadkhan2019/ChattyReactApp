import PropTypes from "prop-types";
import CommentArea from "../comment-area/CommentArea";
import ReactionsAndCommentsDisplay from "../reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay";

const PostCommentSection = ({ post }) => {
  return (
    <div data-testid="comment-section">
      <ReactionsAndCommentsDisplay />
      <CommentArea post={post} />
    </div>
  );
};

PostCommentSection.propTypes = {
  post: PropTypes.object,
};

export default PostCommentSection;