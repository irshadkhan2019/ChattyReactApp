import { find } from "lodash";
import PropTypes from "prop-types";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { feelingsList, privacyList } from "../../../services/utils/static.data";
import Avatar from "../../avatar/Avatar";
import PostCommentSection from "../post-comment-section/PostCommentSection";
import ReactionsModal from "../reactions/reaction-modal/ReactionsModal";
import { timeAgo } from "./../../../services/utils/timeago.utils";
import "./Post.scss";
import useLocalStorage from "./../../../hooks/useLocalStorage";
import CommentInputBox from "../comments/comment-input/CommentInputBox";
import CommentsModal from "../comments/comments-modal/CommentsModal";
import { useState } from "react";
import { Utils } from "../../../services/utils/utils.service";
import ImageModal from "../../image-modal/ImageModal";
import {
  openModal,
  toggleDeleteDialog,
} from "../../../redux-toolkit/reducers/modal/modal.reducer";
import { updatePostItem } from "../../../redux-toolkit/reducers/post/post.reducer";

const Post = ({ post, showIcons }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } =
    useSelector((state) => state.modal);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const selectedPostId = useLocalStorage("selectedpostId", "get");
  const dispatch = useDispatch();

  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const openPostModal = () => {
    dispatch(openModal({ type: "edit" }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };

  return (
    <>
      {reactionsModalIsOpen && <ReactionsModal />}
      {commentsModalIsOpen && <CommentsModal />}
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div
                      className="inline-display"
                      data-testid="inline-display"
                    >
                      is feeling{" "}
                      <img
                        className="feeling-icon"
                        src={`${getFeeling(post?.feelings)}`}
                        alt=""
                      />{" "}
                      <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {/* for user who owns a post */}
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt
                      className="trash"
                      onClick={openDeleteDialog}
                    />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createdAt)} &middot;
                  {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div
              className="user-post"
              style={{ marginTop: "1rem", borderBottom: "" }}
            >
              {post?.post && post?.bgColor === "#ffffff" && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== "#ffffff" && (
                <div
                  data-testid="user-post-with-bg"
                  className="user-post-with-bg"
                  style={{ backgroundColor: `${post?.bgColor}` }}
                >
                  {post?.post}
                </div>
              )}

              {post?.imgId && !post?.gifUrl && post?.bgColor === "#ffffff" && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  onClick={() => {
                    setShowImageModal(!showImageModal);
                    setImageUrl(
                      Utils.getPostImage(post.imgId, post.imgVersion)
                    );
                  }}
                >
                  <img
                    className="post-image"
                    src={Utils.getPostImage(post.imgId, post.imgVersion)}
                    alt=""
                  />
                </div>
              )}

              {post?.gifUrl && post?.bgColor === "#ffffff" && (
                <div
                  className="image-display-flex"
                  onClick={() => {
                    setShowImageModal(!showImageModal);
                    setImageUrl(post?.gifUrl);
                  }}
                >
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {(post?.reactions.length > 0 || post?.commentsCount > 0) && (
                <hr />
              )}
              <PostCommentSection post={post} />
            </div>
          </div>
          {/* {console.log(selectedPostId)} */}
          {selectedPostId === post?._id && <CommentInputBox post={post} />}
        </div>
      </div>
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool,
};

export default Post;
