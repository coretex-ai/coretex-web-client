
// Login.tsx
import React, { useState, FC } from 'react';
import axios from 'axios';
import { Button, TextField, Paper, Grid, Typography } from '@material-ui/core';

interface LoginProps {
  setIsLoggedIn: (status: boolean) => void;
  setRefreshToken: (token: string) => void;
  apiServerURL: string;
}

const Login: FC<LoginProps> = ({ setIsLoggedIn, setRefreshToken, apiServerURL }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiServerURL}/api/v1/user/login`, {}, {
        auth: { username, password },
      });
      setRefreshToken(response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
        <Grid item>
          <Typography variant="h5">Login</Typography>
        </Grid>
        <Grid item>
          <TextField label="Username" variant="outlined" fullWidth onChange={e => setUsername(e.target.value)} />
        </Grid>
        <Grid item>
          <TextField label="Password" type="password" variant="outlined" fullWidth onChange={e => setPassword(e.target.value)} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Login;
