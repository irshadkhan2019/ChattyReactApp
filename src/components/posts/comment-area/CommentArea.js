import PropTypes from "prop-types";
import { FaRegCommentAlt } from "react-icons/fa";
import "./CommentArea.scss";
import like from "./../../../assets/reactions/like.png";
import Reactions from "../reactions/Reactions";
import { useCallback, useEffect, useState } from "react";
import { cloneDeep, filter, find } from "lodash";
import { Utils } from "../../../services/utils/utils.service";
import { reactionsMap } from "../../../services/utils/static.data";
import { useDispatch, useSelector } from "react-redux";
import { postService } from "../../../services/api/post/post.service";
import { addReactions } from "../../../redux-toolkit/reducers/post/user-post-reaction.reducer";
import { socketService } from "./../../../services/sockets/socket.service";
import useLocalStorage from "./../../../hooks/useLocalStorage";
import {
  clearPost,
  updatePostItem,
} from "../../../redux-toolkit/reducers/post/post.reducer";

const CommentArea = ({ post }) => {
  const { profile } = useSelector((state) => state.user);
  let { reactions } = useSelector((state) => state.userPostReactions);
  const [userSelectedReaction, setUserSelectedReaction] = useState("like");

  const selectedPostId = useLocalStorage("selectedpostId", "get");
  const [setSelectedPostId] = useLocalStorage("selectedpostId", "set");

  const dispatch = useDispatch();

  // const reactions = [];
  const selectedUserReaction = useCallback(
    (postReactions) => {
      //get loggedin users reaction for this particular post
      const userReaction = find(
        postReactions,
        (reaction) => reaction.postId === post._id
      );
      const result = userReaction
        ? Utils.firstLetterUpperCase(userReaction.type)
        : "Like";
      setUserSelectedReaction(result);
    },
    [post]
  );

  const toggleCommentInput = () => {
    if (!selectedPostId) {
      console.log("Setting comment input for post", selectedPostId);
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    } else {
      console.log("remove comment input for post", selectedPostId);
      removeSelectedPostId();
    }
  };

  const removeSelectedPostId = () => {
    // if user clicks on hte same comment component then close it 
    if (selectedPostId === post?._id) {
      setSelectedPostId("");
      dispatch(clearPost());
    } else {
      //if he clicks diffent component then the last selectedPostId then 
      setSelectedPostId(post?._id);
      dispatch(updatePostItem(post));
    }
  };

  const addReactionPost = async (reaction) => {
    console.log("reaction", reaction, "is clicked");
    try {
      // get already made reaction to this post by this user
      const reactionResponse =
        await postService.getSinglePostReactionByUsername(
          post._id,
          profile.username
        );

      //add reaction to post
      post = updatePostReaction(
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      //add reaction to redux store
      const postReactions = addNewReaction(
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );
      reactions = [...postReactions];
      dispatch(addReactions(reactions));

      // send reaction as socketio event to server
      sendSocketIOReactions(
        post,
        reaction,
        Object.keys(reactionResponse.data.reactions).length,
        reactionResponse.data.reactions?.type
      );

      const reactionsData = {
        userTo: post?.userId,
        postId: post?._id,
        type: reaction,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture,
        previousReaction: Object.keys(reactionResponse.data.reactions).length
          ? reactionResponse.data.reactions?.type
          : "",
      };

      // if no prev reaction ,user is adding reaction for 1st time.
      if (!Object.keys(reactionResponse.data.reactions).length) {
        await postService.addReaction(reactionsData);
      } else {
        //if prev reaction exists
        reactionsData.previousReaction = reactionResponse.data.reactions?.type;
        if (reaction == reactionsData.previousReaction) {
          // if current reaction is same as old reaction then remove his reaction
          await postService.removeReaction(
            post?._id,
            reactionsData.previousReaction,
            post.reactions
          );
        } else {
          await postService.addReaction(reactionsData);
        }
      }
    } catch (error) {
      Utils.dispatchNotification(
        error?.response?.data?.message,
        "error",
        dispatch
      );
      // console.log(error);
    }
  };

  const updatePostReaction = (newReaction, hasResponse, previousReaction) => {
    post = cloneDeep(post);
    //if user is adding post for 1st time
    if (!hasResponse) {
      post.reactions[newReaction] += 1;
    } else {
      //if he has already given a reaction for this post
      if (post.reactions[previousReaction] > 0) {
        post.reactions[previousReaction] -= 1;
      }
      //if he select same reaction as previous then remove current
      if (previousReaction != newReaction) {
        post.reactions[newReaction] += 1;
      }
    }
    return post;
  };

  //for redux store userPostReactions
  const addNewReaction = (newReaction, hasResponse, previousReaction) => {
    //remove reaction from store
    const postReactions = filter(
      reactions,
      (reaction) => reaction?.postId !== post?._id
    );

    const newPostReaction = {
      postId: post?._id,
      type: newReaction,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      profilePicture: profile?.profilePicture,
      createdAt: `${new Date()}`,
    };

    if ((hasResponse && previousReaction !== newReaction) || !hasResponse) {
      postReactions.push(newPostReaction);
    }
    return postReactions;
  };

  //emit event to server
  const sendSocketIOReactions = (
    post,
    reaction,
    hasResponse,
    previousReaction
  ) => {
    const socketReactionData = {
      userTo: post.userId,
      postId: post._id,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      profilePicture: profile?.profilePicture,
      type: reaction,
      postReactions: post.reactions,
      previousReaction: hasResponse ? previousReaction : "",
    };
    socketService?.socket?.emit("reaction", socketReactionData);
  };

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);

  return (
    <>
      <div className="comment-area" data-testid="comment-area">
        <div className="like-icon reactions">
          <div className="likes-block" onClick={() => addReactionPost("like")}>
            <div
              className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}
            >
              {userSelectedReaction && (
                <div
                  className={`reaction-display  ${userSelectedReaction.toLowerCase()}`}
                  data-testid="selected-reaction"
                >
                  <img
                    className="reaction-img"
                    src={reactionsMap[userSelectedReaction.toLowerCase()]}
                    alt=""
                  />
                  <span>{userSelectedReaction}</span>
                </div>
              )}
              {/* if no reaction of user for this post yet */}
              {!userSelectedReaction && (
                <div
                  className="reaction-display"
                  data-testid="default-reaction"
                >
                  <img
                    className="reaction-img"
                    src={`${reactionsMap.like}`}
                    alt=""
                  />
                  <span>Like</span>
                </div>
              )}
            </div>
          </div>
          <div className="reactions-container app-reactions">
            <Reactions handleClick={addReactionPost} />
          </div>
        </div>
        <div className="comment-block" onClick={toggleCommentInput}>
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
