// Login.tsx
import React, { useState, FC } from 'react';
import axios from 'axios';

// const SERVER_IP = "https://dev.biomechservices.com:29007";
const SERVER_IP = "https://api.coretex.ai";

interface LoginProps {
  setLoginStatus: (status: boolean) => void;
  setRefreshToken: (token: string) => void;
}

const Login: FC<LoginProps> = ({ setLoginStatus, setRefreshToken }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_IP}/api/v1/user/login`, {}, {
        auth: { username, password },
      });
      setRefreshToken(response.data.refresh_token);
      setLoginStatus(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
