import { useState, FC } from "react";
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
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
          />
        </div>
        <Button className="login_btn" onClick={handleLogin}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Login;
