import React, {
  useState,
  useEffect,
  useRef,
  FC,
  useCallback,
  useLayoutEffect,
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
import { Camera } from "react-camera-pro";
import { IDebugData } from "interfaces/Debug";
import { gzipFile, zipFiles } from "helpers/ZipHelper";
import { DigitopsyService } from "services/DigitopsyService";
import { useSnackbar } from "hooks/useSnackbar";
import Snackbar from "components/Snackbar/Snackbar";
import "./ImageUpload.css";

const ImageUpload: FC = () => {
  const { snackbar, onSetSnackbar } = useSnackbar();

  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileFieldRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<any>(null);
  const webcamWrapperRef = useRef<HTMLDivElement | null>(null);

  const [response, setResponse] = useState<string>("");
  const [debugData, setDebugData] = useState<IDebugData>();
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [isFileUploadActive, setIsFileUploadActive] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(
    undefined
  );
  const [focusSize, setFocusSize] = useState<number>(0);
  const [submitInProgress, setSubmitInProgress] = useState<boolean>(false);

  const base64ToSrc = (base64: string): string => {
    return `data:image/png;base64,${base64}`;
  };

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
    setDebugData(undefined);
  };

  async function urlToFile(url: string, fileName: string): Promise<File> {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const clientWidth = img.width;
      const clientHeight = img.height;
      const aspectRatio = clientWidth / clientHeight;

      let scaledWidth: number | undefined, scaledHeight: number | undefined;

      if (aspectRatio > 1) {
        scaledHeight = 640;
        scaledWidth = 640 * aspectRatio;
      } else {
        scaledWidth = 640;
        scaledHeight = 640 * aspectRatio;
      }

      img.width = scaledWidth;
      img.height = scaledHeight;
    };

    const response = await fetch(img.src);
    const blob = await response.blob();

    // Create a file from the blob
    return new File([blob], fileName, { type: blob.type });
  }

  const captureImage = useCallback(
    (isCameraActive?: boolean) => {
      if (!image) return;

      urlToFile(image, "example.jpg")
        .then((file) => gzipFile(file))
        .then((gzipFile) => {
          DigitopsyService.invoke(gzipFile)
            .then((response) => {
              setDebugData(response.data.debug);
              delete response.data.debug;

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
        })
        .catch(() =>
          onSetSnackbar({
            severity: "error",
            message: "Something went wrong while gzipping image.",
          })
        );
    },
    [image, isFileUploadActive, onSetSnackbar]
  );

  const handleClick = () => {
    setIsCameraEnabled(false);
    setIsCameraVisible(false);
    setDebugData(undefined);
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

    urlToFile(image, "example.jpg")
      .then((file) => gzipFile(file))
      .then((gzipFile) => {
        DigitopsyService.invoke(gzipFile)
          .then((response) => {
            setDebugData(response.data.debug);
            delete response.data.debug;

            setProcessedImage(image);
            setResponse(JSON.stringify(response.data, null, 2)); // Set response
            setIsCameraEnabled(false);
            setIsCameraVisible(false);
          })
          .catch(({ response }) => {
            setResponse(response.data.error);

            if (isCameraVisible) {
              captureImage(isCameraVisible);
            }
          });
      })
      .catch(() =>
        onSetSnackbar({
          severity: "error",
          message: "Something went wrong while gzipping image.",
        })
      );
  }, [image, captureImage, isCameraVisible, onSetSnackbar]);

  const executeScroll = () => webcamWrapperRef.current?.scrollIntoView();

  const handleSubmitData = () => {
    if (!response || !image) return;

    setSubmitInProgress(true);

    const outputFile = new File([new Blob([response])], "output.txt");

    const filePromises = [
      urlToFile(image, "input.png"),
      ...(debugData
        ? [
            urlToFile(
              base64ToSrc(debugData.objectDetection),
              "object_detection.png"
            ),
            urlToFile(base64ToSrc(debugData.segmentation), "segmentation.png"),
          ]
        : []),
    ];

    Promise.all(filePromises)
      .then((imageFiles) => {
        const files = [outputFile, ...imageFiles];
        return zipFiles(files, "debug_file.zip");
      })
      .then((zip) => DigitopsyService.submitDataForAnalysis(zip))
      .then(() =>
        onSetSnackbar({
          severity: "success",
          message: "Data submitted successfully.",
        })
      )
      .catch(() =>
        onSetSnackbar({
          severity: "error",
          message: "Something went wrong while submitting data.",
        })
      )
      .finally(() => setSubmitInProgress(false));
  };

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
          {response && (
            <Button
              disabled={submitInProgress}
              className="submit_data_btn"
              onClick={handleSubmitData}
              startIcon={
                submitInProgress ? <CircularProgress size={15} /> : undefined
              }
            >
              Submit data for the analysis
            </Button>
          )}
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

            {debugData && (
              <div>
                <div>
                  <label>Object Detection</label>
                  <img src={base64ToSrc(debugData.objectDetection)} alt="" />
                </div>
                <div>
                  <label>Segmentation</label>
                  <img src={base64ToSrc(debugData.segmentation)} alt="" />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <Snackbar {...snackbar} />
    </>
  );
};

export default ImageUpload;
