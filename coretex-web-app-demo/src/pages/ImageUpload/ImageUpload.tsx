import React, {
  useState,
  useEffect,
  useRef,
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import Button from "@material-ui/core/Button";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import axios from "axios";
import "./ImageUpload.css";
import { Camera } from "react-camera-pro";
import { useLocation } from "react-router-dom";

const ImageUpload: FC = () => {
  const location = useLocation();

  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileFieldRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<any>(null);
  const webcamWrapperRef = useRef<HTMLDivElement | null>(null);

  const [response, setResponse] = useState<string>("");
  const [debugData, setDebugData] = useState<any>();
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [isFileUploadActive, setIsFileUploadActive] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const [focusSize, setFocusSize] = useState<number>(0);

  const handleUploadedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files && event.target.files[0];
    fileReader.readAsDataURL(file!);
    fileReader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setImage(e.target.result);
      }
    };
    setIsFileUploadActive(true);
  };

  const activateCameraMode = () => {
    setIsCameraEnabled(true);
    setImage("");
    setProcessedImage("");
    setResponse("");
    setDebugData("");
  };

  const includeDebugData = useMemo(() => {
    return location.pathname === "/debug";
  }, [location.pathname]);

  const captureImage = useCallback(
    (isCameraActive?: boolean) => {
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
        formData.append("image", file);

        axios
          .post(
            `https://api.coretex.ai/api/v1/endpoint/invoke/ocr-model-deployment-1716881552740`,
            { image: file, ...(includeDebugData && { debug: true }) },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "endpoint-token":
                  "oDim4BDhH3EH5wAnEhl9vO5krdQCVG9BmIKHGugt0yPvxvEEORIXehDIbCNlgI4TkeInXsjzlUQXXf3hx3hkwR2jvw7ZRhUmX2QSexkeFJkSvKwjwSLqz8MFI98uAzo9",
              },
            }
          )
          .then((response) => {
            if (includeDebugData) {
              setDebugData(response.data.debug);
              delete response.data.debug;
            }

            setProcessedImage(image);
            setResponse(JSON.stringify(response.data, null, 2)); // Set response
          })
          .catch(({ response }) => {
            if (response) {
              setResponse(response.data.message ?? response.data.error);

              if (isCameraActive) {
                const currentImageBase64 =
                  webcamRef.current?.takePhoto() as string;
                setImage(currentImageBase64);
              }
            }
          });

        if (isFileUploadActive) {
          setIsFileUploadActive(false);
        }
      });
    },
    [image, includeDebugData, isFileUploadActive]
  );

  const handleClick = () => {
    setIsCameraEnabled(false);
    setIsCameraVisible(false);
    setDebugData("");
    setResponse("");
    if (fileFieldRef.current) fileFieldRef.current.click();
  };

  useEffect(() => {
    (async () => {
      if (navigator && navigator.mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((i) => i.kind === "videoinput");
        setDevices(videoDevices);
      }
    })();
  }, []);

  useEffect(() => {
    if (isFileUploadActive && image) {
      captureImage();
    }
  }, [isFileUploadActive, captureImage, image]);

  useLayoutEffect(() => {
    if (isCameraVisible) {
      const height = webcamWrapperRef.current?.clientHeight || 0;
      const width = webcamWrapperRef.current?.clientWidth || 0;
      executeScroll();
      setFocusSize(Math.min(height, width));

      setTimeout(() => {
        const currentImageBase64 = webcamRef.current?.takePhoto() as string;
        setImage(currentImageBase64);
      }, 0);
    }
  }, [isCameraVisible]);

  useEffect(() => {
    if (!image || !isCameraVisible) return;

    async function urlToFile(url: string, fileName: string): Promise<File> {
      // Fetch the blob from the URL
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a file from the blob
      return new File([blob], fileName, { type: blob.type });
    }

    urlToFile(image, "example.jpg").then((file) => {
      const formData = new FormData();
      formData.append("image", file);

      axios
        .post(
          `https://api.coretex.ai/api/v1/endpoint/invoke/ocr-model-deployment-1716881552740`,
          { image: file, ...(includeDebugData && { debug: true }) },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "endpoint-token":
                "oDim4BDhH3EH5wAnEhl9vO5krdQCVG9BmIKHGugt0yPvxvEEORIXehDIbCNlgI4TkeInXsjzlUQXXf3hx3hkwR2jvw7ZRhUmX2QSexkeFJkSvKwjwSLqz8MFI98uAzo9",
            },
          }
        )
        .then((response) => {
          if (includeDebugData) {
            setDebugData(response.data.debug);
            delete response.data.debug;
          }

          setProcessedImage(image);
          setResponse(JSON.stringify(response.data, null, 2)); // Set response
          setIsCameraEnabled(false);
          setIsCameraVisible(false);
        })
        .catch(({ response }) => {
          setResponse(response.data.error);

          if (
            response.status === 400 &&
            response.data.error === "Document image quality is low" &&
            isCameraVisible
          ) {
            captureImage(isCameraVisible);
          }
        });
    });
  }, [image, captureImage, isCameraVisible, includeDebugData]);

  const executeScroll = () => webcamWrapperRef.current?.scrollIntoView();

  return (
    <>
      <div className="image_upload_wrapper">
        <div className="image_upload_capture">
          <input
            style={{ display: "none" }}
            type="file"
            ref={fileFieldRef}
            onChange={handleUploadedImage}
            data-testid="upload_file_input"
          />

          <Button
            className="upload_file_btn"
            onClick={handleClick}
            startIcon={<PhotoLibraryIcon />}
            data-testid="upload_photo_btn"
          >
            Upload Photo
          </Button>

          <Button
            className="camera_file_btn"
            onClick={activateCameraMode}
            startIcon={<AddAPhotoIcon />}
          >
            Camera
          </Button>

          {isCameraEnabled && (
            <FormControl fullWidth className="camera_device_wrapper">
              <InputLabel
                id="camera-select-label"
                className="camera_device_label"
              >
                Camera Device
              </InputLabel>
              <Select
                labelId="camera-select-label"
                className="camera_device_select"
                value={activeDeviceId}
                label="Age"
                onChange={(event) => {
                  setActiveDeviceId(event.target.value as string);
                }}
              >
                {devices.map((d) => (
                  <MenuItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {isCameraEnabled && (
            <div className="camera_overlay_wrapper" ref={webcamWrapperRef}>
              <Camera
                ref={webcamRef}
                //aspectRatio="cover"
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
                  setIsCameraVisible(true);
                }}
              />

              {/* Rectangle overlay */}
              {isCameraVisible && (
                <div
                  className="autofocus-container"
                  style={{ width: focusSize, height: focusSize }}
                >
                  <CircularProgress />
                </div>
              )}
            </div>
          )}

          <canvas ref={photoRef} style={{ display: "none" }} />

          <div>
            {processedImage && (
              <img
                src={processedImage}
                className="captured_image"
                alt="Captured"
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
              data-testid="model_output_wrapper"
            />
            {includeDebugData && debugData && (
              <div>
                <div>
                  <label>Object Detection</label>
                  <img
                    src={`data:image/png;base64,${debugData.objectDetection}`}
                    alt=""
                  />
                </div>
                <div>
                  <label>Segmentation</label>
                  <img
                    src={`data:image/png;base64,${debugData.segmentation}`}
                    alt=""
                  />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ImageUpload;
