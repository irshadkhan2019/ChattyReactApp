import "./Streams.scss";
import { useEffect, useRef } from "react";
import Suggestions from "../../../components/suggestions/Suggestions";
import { useDispatch, useSelector } from "react-redux";
import { getUserSuggestions } from "../../../redux-toolkit/api/suggestion";
import useEffectOnce from "./../../../hooks/useEffectOnce";
import PostForm from "../../../components/posts/post-form/PostForm";
import Posts from "../../../components/posts/Posts";
import { Utils } from "../../../services/utils/utils.service";
import { postService } from "../../../services/api/post/post.service";
import { useState } from "react";
import { getPosts } from "../../../redux-toolkit/api/posts";
import { floor, uniqBy } from "lodash";
import useInfiniteScroll from "./../../../hooks/useInfiniteScroll";
import { PostUtils } from "../../../services/utils/post-utils.service";

const Streams = () => {
  const { allPosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef();
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  let appPosts = useRef([]);
  const PAGE_SIZE = 5;
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= floor(Math.round(totalPostsCount / PAGE_SIZE))) {
      pageNum += 1;
      setCurrentPage(pageNum);
      //get subsequent post by pagination

      getAllPosts(pageNum);
    }
  }

  const getAllPosts = async (pageNum) => {
    try {
      const response = await postService.getAllPosts(pageNum);
      console.log("NEW REQ WAS MADE:", currentPage, pageNum, response);
      if (response?.data?.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const newPosts = uniqBy(appPosts, "_id"); //remove duplicate posts
        console.log(newPosts);
        setPosts(newPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(
        error?.response?.data.message,
        "error",
        dispatch
      );
    }
  };
  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    setPosts(allPosts?.posts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);
  return (
    <div className="streams" data-testid="streams">
      {console.log("Posts till now!", posts)}
      <div className="streams-content">
        <div
          className="streams-post"
          ref={bodyRef}
          style={{ backgroundColor: "#ddd" }}
        >
          <div>
            <PostForm />
          </div>
          <div>
            <Posts allposts={posts} postsLoading={loading} userFollowing={[]} />
          </div>
          <div
            ref={bottomLineRef}
            style={{
              marginBottom: "50px",
              height: "50px",
            }}
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
