import Input from "../../../components/inputs/Input";
import "./Register.scss";
import Button from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { Utils } from "../../../services/utils/utils.service";
import { authService } from "./../../../services/api/auth/auth.service";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();

  const registerUser = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(
        username.charAt(0).toUpperCase(),
        avatarColor
      );

      const result = await authService.signUp({
        username,
        email,
        password,
        avatarColor,
        avatarImage,
      });
      console.log(result);
      setUser(result.data.user);
      setHasError(false);
      setAlertType("alert-success");
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType("alert-error");
      setErrorMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      setLoading(false);
      console.log("navigating to streams page");
    }
  }, [loading, user]);

  return (
    <>
      <div className="auth-inner">
        {hasError && errorMessage && (
          <div className={`alerts ${alertType}`} role="alert">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={registerUser}>
          <div className="form-input-container">
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              labelText="Username"
              placeholder="Enter Username"
              handleChange={(event) => setUsername(event.target.value)}
            />
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              labelText="Enter Email"
              placeholder="Enter Email"
              handleChange={(event) => setEmail(event.target.value)}
            />
            {/* password field */}
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              labelText="Password"
              placeholder="Enter Password"
              handleChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {/* button component */}
          <Button
            label={`${loading ? "signUp in Progress" : "signUp"}`}
            className="auth-button button"
            disabled={!username || !email || !password}
          />
        </form>
      </div>
    </>
  );
};

export default Register;
