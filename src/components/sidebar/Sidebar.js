import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import {
  fontAwesomeIcons,
  sideBarItems,
} from "../../services/utils/static.data";
import "./Sidebar.scss";

const Sidebar = () => {
  const { profile } = useSelector((state) => state.user);
  const [sidebar, setSideBar] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const checkUrl = (name) => {
    return location.pathname.includes(name.toLowerCase());
  };

  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  const navigateToPage = (name, url) => {
    if (name === "Profile") {
      url = `${url}/${profile?.username}?${createSearchParams({
        id: profile?._id,
        uId: profile?.uId,
      })}`;
    }

    navigate(url);
  };

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li
              key={data.index}
              onClick={() => navigateToPage(data.name, data.url)}
            >
              <div
                data-testid="sidebar-list"
                // highlight the current sidebar menu based on pathname
                className={`sidebar-link ${
                  checkUrl(data.name) ? "active" : ""
                }`}
              >
                <div className="menu-icon">
                  {fontAwesomeIcons[data.iconName]}
                </div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
