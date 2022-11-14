import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Social.scss";

function Social() {
  return (
    <>
      <div>
        <Header />
      </div>
      <div className="dashboard">
        <div className="dashboard-sidebar">
          <div>
            <Sidebar />
          </div>
        </div>
        <div className="dashboard-content">
          {/* All Child components comes here */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Social;
