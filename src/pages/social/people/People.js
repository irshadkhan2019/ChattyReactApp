import "./People.scss";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInfiniteScroll from "./../../../hooks/useInfiniteScroll";
import { userService } from "../../../services/api/user/user.service";
import { Utils } from "../../../services/utils/utils.service";
import useEffectOnce from "./../../../hooks/useEffectOnce";
import Avatar from "./../../../components/avatar/Avatar";
import CardElementStats from "../../../components/card-element/CardElementStats";
import CardElementButtons from "../../../components/card-element/CardElementButton";
import { ProfileUtils } from "./../../../services/utils/profile-utils.service";

const People = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);

  const PAGE_SIZE = 12;

  function fetchData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalUsersCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  const getAllUsers = useCallback(async () => {
    try {
      const response = await userService.getAllUsers(currentPage);
      if (response.data.users.length > 0) {
        setUsers((data) => {
          const result = [...data, ...response.data.users];
          const allUsers = uniqBy(result, "_id");
          return allUsers;
        });
      }
      setTotalUsersCount(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [currentPage, dispatch]);

  useEffectOnce(() => {
    getAllUsers();
  });

  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users.length > 0 && (
        <div className="card-element">
          {users.map((data) => (
            <div
              className="card-element-item"
              key={data?._id}
              data-testid="card-element-item"
            >
              {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
                <div className="card-element-item-indicator">
                  <FaCircle className="online-indicator" />
                </div>
              )}
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
                followersCount={data?.followersCount}
                followingCount={data?.followingCount}
              />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsFollowed(following, data?._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => {}}
                onClickBtnTwo={() => {}}
                onNavigateToProfile={() =>
                  ProfileUtils.navigateToProfile(data, navigate)
                }
              />
            </div>
          ))}
        </div>
      )}

      {loading && !users.length && (
        <div className="card-element" style={{ height: "350px" }}></div>
      )}

      {!loading && !users.length && (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      )}

      <div
        ref={bottomLineRef}
        style={{ marginBottom: "80px", height: "50px" }}
      ></div>
    </div>
  );
};
export default People;
