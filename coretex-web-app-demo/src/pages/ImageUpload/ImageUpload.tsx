import React, { useState, useEffect, useRef, FC, useCallback } from "react";
import Button from "@material-ui/core/Button";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { CircularProgress, TextField } from "@material-ui/core";
import axios from "axios";
import "./ImageUpload.css";
import { Camera } from "react-camera-pro";

interface ImageUploadProps {
  refreshToken: string;
  apiServerURL: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ refreshToken, apiServerURL }) => {
  const [image, setImage] = useState<string | null>(null);

  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileFieldRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<any>(null);

  const [modelID, setModelID] = useState<number>(109);
  const [nodeID, setNodeID] = useState<number>(161);
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );

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
        .catch(({ response }) => {
          setResponse(`Detection failed: ${response.data.message}`);
          setIsLoading(false); // Stop loading
        });
    });
  }, [image, nodeID, modelID, refreshToken, apiServerURL]);

  const handleClick = () => {
    setResponse("");
    if (fileFieldRef.current) fileFieldRef.current.click();
  };

  const handleCameraCaptureImage = useCallback(() => {
    if (!isCameraEnabled) {
      setIsCameraEnabled(true);
      setImage("");
      setResponse("");
    } else {
      const currentImageBase64 = webcamRef.current?.takePhoto() as string;
      console.log(currentImageBase64);
      setImage(currentImageBase64);
      setIsCameraEnabled(false);
    }
  }, [isCameraEnabled]);

  useEffect(() => {
    (async () => {
      if (navigator && navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((i) => i.kind === "videoinput");
        setDevices(videoDevices);
      }
    })();
  }, []);

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
          <Button
            className="camera_file_btn"
            onClick={handleCameraCaptureImage}
            startIcon={<AddAPhotoIcon />}
          >
            {isCameraEnabled ? "Capture Photo" : "Camera Photo"}
          </Button>

          {isCameraEnabled && (
            <select
              onChange={(event) => {
                setActiveDeviceId(event.target.value);
              }}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
          )}
          {isCameraEnabled && (
            <div className="camera_overlay_wrapper">
              {/* <Webcam
                ref={webcamRef}
                onUserMedia={() => {
                  setIsCameraEnabled(true);
                  console.log("ready");
                  console.log(webcamRef.current?.video?.clientHeight);
                }}
                onUserMediaError={() => setIsCameraEnabled(false)}
                videoConstraints={videoConstraints}
                autoFocus={true}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                forceScreenshotSourceSize={true}
                imageSmoothing={false}
                className="camera_first_video"
              /> */}
              <Camera
                ref={webcamRef}
                aspectRatio="cover"
                facingMode="environment"
                videoSourceDeviceId={activeDeviceId}
                errorMessages={{
                  noCameraAccessible:
                    "No camera device accessible. Please connect your camera or try a different browser.",
                  permissionDenied:
                    "Permission denied. Please refresh and give camera permission.",
                  switchCamera:
                    "It is not possible to switch camera to different one because there is only one video device accessible.",
                  canvas: "Canvas is not supported.",
                }}
                videoReadyCallback={() => {
                  setIsCameraEnabled(true);
                }}
              />

              {/* Rectangle overlay */}
              <div className="autofocus-container"></div>
            </div>
          )}

          <canvas ref={photoRef} style={{ display: "none" }} />

          <div>
            {image && (
              <img src={image} className="captured_image" alt="Captured" />
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
