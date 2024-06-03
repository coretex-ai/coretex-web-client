import "./App.css";
import ImageUpload from "./pages/ImageUpload/ImageUpload"; // Import the ImageUpload component

import ctxCuttedLogo from "./assets/images/ctx_cutted_logo.svg";
import neuralNetworkImg from "./assets/images/neural_network.svg";
import ctxWordsImg from "./assets/images/ctx_words.svg";

const App = () => {
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
              OCR Model Deployment Demo
            </p>
            <p className="layout_container_header_subtitle">
              Web app showcasing integration of Coretex AI Endpoints with
              React.js frontend. Coretex user can log in and submit an image to
              a vision model trained on Coretex and preview the inference
              result. Source code available on
              https://github.com/coretex-ai/coretex-web-client
            </p>
          </div>
          <div className="layout_container_content_image">
            <ImageUpload />
          </div>
          {/* )} */}
        </div>
      </main>
    </div>
  );
};

export default App;
