// App.tsx
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login'; // Import the Login component
import ImageUpload from './ImageUpload'; // Import the ImageUpload component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshToken, setRefreshToken] = useState('');

  return (
    <div className="App">
      <header className="App-header">
       
        {/* Render Login or ImageUpload based on login status */}
        {!isLoggedIn ? (
          <Login setLoginStatus={setIsLoggedIn} setRefreshToken={setRefreshToken} />
        ) : (
          <ImageUpload refreshToken={refreshToken} />
        )}
      </header>
    </div>
  );
}

export default App;
