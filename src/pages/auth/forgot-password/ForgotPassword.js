import Input from "../../../components/inputs/Input";
import "./ForgotPassword.scss";
import Button from "./../../../components/button/Button";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import backgroundImage from "./../../../assets/images/background.jpg";

const ForgotPassword = () => {
  return (
    <>
      <div
        className="container-wrapper"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container-wrapper-auth">
          <div className="tabs forgot-password-tabs">
            <div className="tabs-auth">
              <ul className="tab-group">
                <li className="tab">
                  <div className="login forgot-password">Forgot Password</div>
                </li>
              </ul>

              <div className="tab-item">
                <div className="auth-inner">
                  {/* <div className="alerts alert-error" role="alert">
                    Enter valid Emial
                  </div> */}
                  <form className="forgot-password-form">
                    <div className="form-input-container">
                      <Input
                        id="Email"
                        name="Email"
                        type="email"
                        value="Izuku@gmail.com"
                        labelText="Email"
                        placeholder="Enter Email"
                        handleChange={() => {}}
                      />
                    </div>
                    {/* button component */}
                    <Button
                      label={"ForgotPassword"}
                      className="auth-button button"
                      disabled={true}
                    />

                    <Link to={"/"}>
                      <span className="login">
                        <FaArrowLeft className="arrow-left" /> Back to Login
                      </span>
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default ForgotPassword;
