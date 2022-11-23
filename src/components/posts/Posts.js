import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Utils } from "../../services/utils/utils.service";
import Post from "./post/Post";
import "./Posts.scss";

const Posts = ({ allposts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(allposts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allposts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {posts.map((post) => (
        <div key={Utils.generateString(10)} data-testid="posts-item">
          <Post post={post} showIcons={false} />
        </div>
      ))}
    </div>
  );
};

Posts.propTypes = {
  allposts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool,
};

export default Posts;
