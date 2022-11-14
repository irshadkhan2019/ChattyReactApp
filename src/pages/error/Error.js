import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import "./Error.scss";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="oops">Oops!</div>
      <p className="not-found">Error 404: Page Not Found</p>
      <Button
        label="Back Home"
        className="back-button button"
        handleClick={() => navigate(-1)} //go back to prev page
      />
    </div>
  );
};
export default Error;
