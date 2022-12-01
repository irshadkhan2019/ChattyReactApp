import { cloneDeep } from "lodash";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "../../../../services/api/post/post.service";
import { socketService } from "../../../../services/sockets/socket.service";
import { Utils } from "../../../../services/utils/utils.service";
import Input from "./../../../inputs/Input";

const CommentInputBox = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);
  const dispatch = useDispatch();

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      post = cloneDeep(post);
      post.commentsCount += 1;
      const commentBody = {
        userTo: post?.userId,
        postId: post?._id,
        comment: comment.trim(),
        commentsCount: post.commentsCount,
        profilePicture: profile?.profilePicture,
      };
      socketService?.socket?.emit("comment", commentBody);
      await postService.addComment(commentBody);
      setComment("");
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, []);

  return (
    <div className="comment-container" data-testid="comment-input">
      <form className="comment-form" onSubmit={submitComment}>
        <Input
          ref={commentInputRef}
          name="comment"
          type="text"
          value={comment}
          labelText=""
          className="comment-input"
          placeholder="Write a comment..."
          handleChange={(event) => setComment(event.target.value)}
        />
      </form>
    </div>
  );
};

CommentInputBox.propTypes = {
  post: PropTypes.object,
};
export default CommentInputBox;
