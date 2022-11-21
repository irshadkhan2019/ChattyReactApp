import PropTypes from "prop-types";
import "./Spinner.scss";

const Spinner = ({ bgColor }) => {
  return (
    <>
      <div className="spinner">
        <div
          className="bounce1"
          style={{ backgroundColor: `${bgColor || "#db7474"}` }}
        ></div>
        <div
          className="bounce2"
          style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
        ></div>
        <div
          className="bounce3"
          style={{ backgroundColor: `${bgColor || "#48d485"}` }}
        ></div>
      </div>
    </>
  );
};
Spinner.propTypes = {
  bgColor: PropTypes.string,
};
export default Spinner;
