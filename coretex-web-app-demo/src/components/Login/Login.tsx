import { useState, FC, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@material-ui/core";
import "./Login.css";

interface LoginProps {
  setIsLoggedIn: (status: boolean) => void;
  setRefreshToken: (token: string) => void;
  apiServerURL: string;
}

const Login: FC<LoginProps> = ({
  setIsLoggedIn,
  setRefreshToken,
  apiServerURL,
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${apiServerURL}/api/v1/user/login`,
        {},
        {
          auth: { username, password },
        }
      );
      setRefreshToken(response.data.token);
      setIsLoggedIn(true);
    } catch (error: any) {
      setLoginErrorMessage(
        error?.response.status === 401
          ? "Your email or password is incorrect."
          : ""
      );
      console.error("Login failed:", error?.response);
    }
  };

  useEffect(() => {
    setLoginErrorMessage("");
  }, [username, password]);

  return (
    <div className="login_wrapper">
      <p className="login_title">Login</p>
      <div className="login_content_wrapper">
        <div className="login_input_field">
          <label>Username</label>
          <TextField
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
            className="login_field"
            placeholder="Enter your username"
            data-testid="login_username"
          />
        </div>
        <div className="login_input_field">
          <label>Password</label>
          <TextField
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            className="login_field"
            placeholder="Enter your password"
            data-testid="login_password"
          />
        </div>
        <Button
          className="login_btn"
          onClick={handleLogin}
          data-testid="login_btn"
        >
          Sign In
        </Button>
        {loginErrorMessage && (
          <p className="login_error_message">{loginErrorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
