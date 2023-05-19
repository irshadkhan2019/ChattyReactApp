import Input from "../../../components/inputs/Input";
import "./Register.scss";
import Button from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { Utils } from "../../../services/utils/utils.service";
import { authService } from "./../../../services/api/auth/auth.service";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "./../../../hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import useSessionStorage from "../../../hooks/useSessionStorage";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();
  const [setStoredUsername] = useLocalStorage("username", "set");
  const [setLoggedIn] = useLocalStorage("keepLoggedIn", "set");
  const [pageReload] = useSessionStorage("pageReload", "set");
  const dispatch = useDispatch();

  const navigate = useNavigate();

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
      setLoggedIn(true);
      setStoredUsername(username);
      // setUser(result.data.user);
      setHasError(false);
      setAlertType("alert-success");

      //store Registered user in store
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
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
      navigate("/app/social/streams");
    }
  }, [loading, user, navigate]);

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
              style={{ border: `${hasError ? "1 px solid #fa9b8a" : ""}` }}
              handleChange={(event) => setUsername(event.target.value)}
            />
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              labelText="Enter Email"
              placeholder="Enter Email"
              style={{ border: `${hasError ? "1 px solid #fa9b8a" : ""}` }}
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
              style={{ border: `${hasError ? "1 px solid #fa9b8a" : ""}` }}
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
