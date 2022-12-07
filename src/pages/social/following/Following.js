import "./Following.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followerService } from "../../../services/api/followers/follower.service";
import { Utils } from "../../../services/utils/utils.service";
import { FollowersUtils } from "../../../services/utils/followers-utils.service";
import { socketService } from "../../../services/sockets/socket.service";
import useEffectOnce from "../../../hooks/useEffectOnce";
import Avatar from "../../../components/avatar/Avatar";
import CardElementStats from "../../../components/card-element/CardElementStats";
import CardElementButtons from "../../../components/card-element/CardElementButton";
import { ProfileUtils } from "../../../services/utils/profile-utils.service";

const Following = () => {
  const { profile } = useSelector((state) => state.user);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const followUser = async (user) => {
    try {
      FollowersUtils.followUser(user, dispatch);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const unFollowUser = async (user) => {
    try {
      console.log(user);
      socketService?.socket?.emit("unfollow user", user);
      FollowersUtils.unfollowUser(user, profile, dispatch);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
  });

  useEffect(() => {
    FollowersUtils.socketIORemoveFollowing(following, setFollowing);
  }, [following]);

  return (
    <div className="card-container">
      <div className="people">Following</div>
      {following.length > 0 && (
        <div className="card-element">
          {following.map((data) => (
            <div
              className="card-element-item"
              key={data?._id}
              data-testid="card-element-item"
            >
              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar
                  name={data?.username}
                  bgColor={data?.avatarColor}
                  textColor="#ffffff"
                  size={120}
                  avatarSrc={data?.profilePicture}
                />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">
                    {data?.username}
                  </span>
                </div>
              </div>
              <CardElementStats
                postsCount={data?.postsCount}
                followersCount={parseInt(data?.followersCount, 10)}
                followingCount={parseInt(data?.followingCount, 10)}
              />

              <CardElementButtons
                isChecked={Utils.checkIfUserIsFollowed(following, data?._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => followUser(data)}
                onClickBtnTwo={() => unFollowUser(data)}
                onNavigateToProfile={() =>
                  ProfileUtils.navigateToProfile(data, navigate)
                }
              />
            </div>
          ))}
        </div>
      )}

      {loading && !following.length && (
        <div className="card-element" style={{ height: "350px" }}></div>
      )}

      {!loading && !following.length && (
        <div className="empty-page" data-testid="empty-page">
          You have no following
        </div>
      )}

      <div style={{ marginBottom: "80px", height: "50px" }}></div>
    </div>
  );
};
export default Following;
