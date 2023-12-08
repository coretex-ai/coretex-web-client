import React, { useState, useEffect, useRef, FC } from 'react';
import Button from '@material-ui/core/Button';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Input } from '@material-ui/core';
import axios from 'axios';

interface ImageUploadProps {
    refreshToken: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ refreshToken }) => {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Retaining existing states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modelID, setModelID] = useState<number>(34);
  const [nodeIP, setNodeIP] = useState<string>("http://130.60.24.196:21000");
  // const [nodeIP, setNodeIP] = useState<string>("http://192.168.136.138:21000");

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files && event.target.files[0];
    fileReader.readAsDataURL(file!);
    fileReader.onload = e => {
        if (typeof e.target?.result === 'string') {
          setImage(e.target.result);
        }
      };
  };

  const handleStartCamera = async () => {
    setShowCamera(true);
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
    setImage(null);
  };

  const handleCameraCapture = () => {
    if (videoRef.current && photoRef.current) {
      const context = photoRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, photoRef.current.width, photoRef.current.height);
        photoRef.current.toBlob(blob => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
            setShowCamera(false);
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    if (!image) return;

    async function urlToFile(url: string, fileName: string): Promise<File> {
        // Fetch the blob from the URL
        const response = await fetch(url);
        const blob = await response.blob();
      
        // Create a file from the blob
        const file = new File([blob], fileName, { type: blob.type });
      
        return file;
    };
    urlToFile(image, 'example.jpg').then(file => {
        const formData = new FormData();
        formData.append('refresh_token', refreshToken);
        formData.append('image', file);
    
        axios.post(`${nodeIP}/invoke/${modelID}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(response => {
          console.log('Response:', response.data);
        }).catch(error => {
          console.error('Detection failed:', error);
        });
      });
  }, [image]);

  return (
    <div>
      <Input
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleCapture}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" color="primary" component="span" startIcon={<PhotoLibraryIcon />}>
          Upload Photo
        </Button>
      </label>

      {!showCamera && (
        <div>
        <Button variant="contained" color="secondary" onClick={handleStartCamera} startIcon={<CameraAltIcon />}>
          Camera
        </Button>
        </div>
      )}

      {showCamera && (
        <>
        <div>
          <video ref={videoRef} style={{ width: '450px', height: '300px', marginTop: '20px' }} autoPlay />
        </div>
          <Button variant="contained" color="secondary" onClick={handleCameraCapture} startIcon={<CameraAltIcon />}>
            Capture Photo
          </Button>
          </>
      )}

      <canvas ref={photoRef} style={{ display: 'none' }} />

      <div>
        {image && <img src={image} alt="Captured" style={{ width: '450px', height: '320px', marginTop: '20px' }} />}
      </div>
    </div>
  );
};

export default ImageUpload;
