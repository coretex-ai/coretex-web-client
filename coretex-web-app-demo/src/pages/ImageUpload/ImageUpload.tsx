import React, { useState, useEffect, useRef, FC } from "react";
import Button from "@material-ui/core/Button";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import { CircularProgress, TextField } from "@material-ui/core";
import axios from "axios";
import "./ImageUpload.css";

interface ImageUploadProps {
  refreshToken: string;
  apiServerURL: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ refreshToken, apiServerURL }) => {
  const [image, setImage] = useState<string | null>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileFieldRef = useRef<HTMLInputElement>(null);

  const [modelID, setModelID] = useState<number>(35);
  const [nodeID, setNodeID] = useState<number>(164);
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files && event.target.files[0];
    fileReader.readAsDataURL(file!);
    fileReader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setImage(e.target.result);
      }
    };
  };

  useEffect(() => {
    if (!image) return;

    async function urlToFile(url: string, fileName: string): Promise<File> {
      // Fetch the blob from the URL
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a file from the blob
      return new File([blob], fileName, { type: blob.type });
    }

    urlToFile(image, "example.jpg").then((file) => {
      const formData = new FormData();
      // formData.append('refresh_token', refreshToken);
      formData.append("image", file);

      setIsLoading(true); // Start loading
      axios
        .post(
          `${apiServerURL}/api/v1/function/invoke/${nodeID}/${modelID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "api-token": refreshToken,
            },
          }
        )
        .then((response) => {
          setResponse(JSON.stringify(response.data, null, 2)); // Set response
          setIsLoading(false); // Stop loading
        })
        .catch((error) => {
          setResponse(`Detection failed: ${error.message}`);
          setIsLoading(false); // Stop loading
        });
    });
  }, [image, nodeID, modelID, refreshToken, apiServerURL]);

  const handleClick = () => {
    if (fileFieldRef.current) fileFieldRef.current.click();
  };

  return (
    <>
      <div className="image_upload_wrapper">
        <div className="image_upload_capture">
          <input
            style={{ display: "none" }}
            type="file"
            ref={fileFieldRef}
            onChange={handleCapture}
          />

          <div className="upload_input_field_wrapper">
            <div className="upload_input_field">
              <label>Node ID</label>
              <TextField
                variant="outlined"
                onChange={(e) => setNodeID(Number(e.target.value))}
                value={nodeID}
                className="login_field"
                placeholder="Enter your node ID"
              />
            </div>
            <div className="upload_input_field">
              <label>Model ID</label>
              <TextField
                variant="outlined"
                onChange={(e) => setModelID(Number(e.target.value))}
                value={modelID}
                className="login_field"
                placeholder="Enter your model ID"
              />
            </div>
          </div>

          <Button
            className="upload_file_btn"
            onClick={handleClick}
            startIcon={<PhotoLibraryIcon />}
          >
            Upload Photo
          </Button>

          <canvas ref={photoRef} style={{ display: "none" }} />

          <div>
            {image && (
              <img
                src={image}
                alt="Captured"
                style={{ width: "450px", height: "320px", marginTop: "20px" }}
              />
            )}
          </div>
        </div>

        {response ? (
          <div className="image_json_wrapper">
            <label>Ouput</label>
            <textarea
              value={response}
              readOnly
              className="image_json_response"
            />
          </div>
        ) : null}
      </div>
      {isLoading ? (
        <div className="loading">
          <CircularProgress />
        </div>
      ) : null}
    </>
  );
};

export default ImageUpload;
