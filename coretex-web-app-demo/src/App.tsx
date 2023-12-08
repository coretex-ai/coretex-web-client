import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from './logo.svg';
import './App.css';
import Login from './Login'; // Import the Login component
import ImageUpload from './ImageUpload'; // Import the ImageUpload component

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshToken, setRefreshToken] = useState('');
  const [apiServerURL, setApiServerURL] = useState('https://api.coretex.ai');

  const handleApiServerURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiServerURL(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Application</Typography>
        </Toolbar>
      </AppBar>
      <div className="App">
        <header className="App-header">
          {!isLoggedIn ? (
            <>
              <TextField
                label="API Server URL"
                variant="outlined"
                value={apiServerURL}
                onChange={handleApiServerURLChange}
                style={{ marginBottom: '20px', color: 'white' }}
              />
              <Login setIsLoggedIn={setIsLoggedIn} setRefreshToken={setRefreshToken} apiServerURL={apiServerURL} />
            </>
          ) : (
            <ImageUpload refreshToken={refreshToken} />
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
