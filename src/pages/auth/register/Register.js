import Input from "../../../components/inputs/Input";
import "./Register.scss";
import Button from "../../../components/button/Button";

const Register = () => {
  return (
    <>
      <div className="auth-inner">
        <div className="alerts alert-error" role="alert">
          Error message
        </div>
        <form className="auth-form">
          <div className="form-input-container">
            <Input
              id="username"
              name="username"
              type="text"
              value="Izuku"
              labelText="Username"
              placeholder="Enter Username"
              handleChange={() => {}}
            />
            <Input
              id="Email"
              name="Email"
              type="email"
              value="Izuku@gmail.com"
              labelText="Enter Email"
              placeholder="Enter Email"
              handleChange={() => {}}
            />
            {/* password field */}
            <Input
              id="password"
              name="password"
              type="password"
              value="Izuku pass"
              labelText="Password"
              placeholder="Enter Password"
              handleChange={() => {}}
            />
          </div>
          {/* button component */}
          <Button
            label={"Register"}
            className="auth-button button"
            disabled={true}
          />
        </form>
      </div>
    </>
  );
};

export default Register;
