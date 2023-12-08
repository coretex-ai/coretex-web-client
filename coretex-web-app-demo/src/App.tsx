import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, pink } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// App.tsx
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login'; // Import the Login component
import ImageUpload from './ImageUpload'; // Import the ImageUpload component
import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshToken, setRefreshToken] = useState('');

  return (
    <div className="App">
      <header className="App-header">
       
        {/* Render Login or ImageUpload based on login status */}
        {!isLoggedIn ? (
          <Login setIsLoggedIn={setIsLoggedIn} setRefreshToken={setRefreshToken} />
        ) : (
          <ImageUpload refreshToken={refreshToken} />
        )}
      </header>
    </div>
  );
}

export default App;