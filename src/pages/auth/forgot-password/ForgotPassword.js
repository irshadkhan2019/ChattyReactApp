import Input from "../../../components/inputs/Input";
import "./ForgotPassword.scss";
import Button from "./../../../components/button/Button";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import backgroundImage from "./../../../assets/images/background.jpg";
import { useState } from "react";
import { authService } from "../../../services/api/auth/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const forgotPassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const response = await authService.forgotPassword({ email });
      setLoading(false);
      setEmail("");
      setShowAlert(false);
      setAlertType("alert-success");
      setResponseMessage(response?.data?.message);
    } catch (error) {
      setAlertType("alert-error");
      setLoading(false);
      setShowAlert(true);
      setResponseMessage(error?.response?.data?.message);
    }
  };

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
                  {showAlert && responseMessage && (
                    <div className={`alerts ${alertType}`} role="alert">
                      {responseMessage}
                    </div>
                  )}
                  <form
                    className="forgot-password-form"
                    onSubmit={forgotPassword}
                  >
                    <div className="form-input-container">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        labelText="Email"
                        placeholder="Enter Email"
                        style={{
                          border: `${showAlert ? "1px solid #fa9b8a" : ""}`,
                        }}
                        handleChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    {/* button component */}
                    <Button
                      label={`${
                        loading
                          ? "FORGOT PASSWORD IN PROGRESS..."
                          : "FORGOT PASSWORD"
                      }`}
                      className="auth-button button"
                      disabled={!email}
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
