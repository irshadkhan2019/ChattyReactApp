import { find } from "lodash";
import PropTypes from "prop-types";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { feelingsList, privacyList } from "../../../services/utils/static.data";
import Avatar from "../../avatar/Avatar";
import PostCommentSection from "../post-comment-section/PostCommentSection";
import ReactionsModal from "../reactions/reaction-modal/ReactionsModal";
import { timeAgo } from "./../../../services/utils/timeago.utils";
import "./Post.scss";
import useLocalStorage from "./../../../hooks/useLocalStorage";
import CommentInputBox from "../comments/comment-input/CommentInputBox";

const Post = ({ post, showIcons }) => {
  const { reactionsModalIsOpen } = useSelector((state) => state.modal);
  const selectedPostId = useLocalStorage("selectedpostId", "get");

  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const getPostImage = (imgId, imgVersion) => {
    const imageUrl = `https://res.cloudinary.com/dnslnpn4l/image/upload/v${imgVersion}/${imgId}.jpg`;
    return imageUrl;
  };

  return (
    <>
      {reactionsModalIsOpen && <ReactionsModal />}
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
                    <FaPencilAlt className="pencil" />
                    <FaRegTrashAlt className="trash" />
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

              {post?.imgId && !post?.gifUrl && post.bgColor === "#ffffff" && (
                <div data-testid="post-image" className="image-display-flex">
                  <img
                    className="post-image"
                    src={getPostImage(post.imgId, post.imgVersion)}
                    alt=""
                  />
                </div>
              )}

              {post?.gifUrl && post.bgColor === "#ffffff" && (
                <div className="image-display-flex">
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
