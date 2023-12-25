import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import "./App.css";
import Login from "./components/Login/Login"; // Import the Login component
import ImageUpload from "./pages/ImageUpload/ImageUpload"; // Import the ImageUpload component

import ctxCuttedLogo from "./assets/images/ctx_cutted_logo.svg";
import neuralNetworkImg from "./assets/images/neural_network.svg";
import ctxWordsImg from "./assets/images/ctx_words.svg";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
  const [apiServerURL, setApiServerURL] = useState("https://api.coretex.ai");

  const handleApiServerURLChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setApiServerURL(event.target.value);
  };

  return (
    <div className="app_wrapper">
      <main className="main_content_wrapper">
        <img
          className="neural_network_img"
          src={neuralNetworkImg}
          alt="neural network"
        />
        <img
          className="ctx_cutted_logo_img"
          src={ctxCuttedLogo}
          alt="coretex"
        />
        <div className="gradient_section" />
        <img className="ctx_words_img" src={ctxWordsImg} alt="coretex" />

        <div className="layout_container">
          <div className="layout_container_header">
            <p className="layout_container_header_title">
              Coretex Function OCT
            </p>
            <p className="layout_container_header_subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              bibendum sapien ac leo viverra, id lobortis felis mattis. Cras
              vitae lorem nibh. Quisque a pretium erat. Sed dictum pretium enim
              sed convallis.
            </p>
          </div>
          {!isLoggedIn ? (
            <div className="layout_container_content_login">
              <div className="field_api_server_field">
                <label>API Server URL</label>
                <TextField
                  variant="outlined"
                  value={apiServerURL}
                  onChange={handleApiServerURLChange}
                  className="field_api_server"
                />
              </div>
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setRefreshToken={setRefreshToken}
                apiServerURL={apiServerURL}
              />
            </div>
          ) : (
            <div className="layout_container_content_image">
              <ImageUpload
                refreshToken={refreshToken}
                apiServerURL={apiServerURL}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
