// ImageUpload.tsx
import React, { useState, FC } from 'react';
import axios from 'axios';
import * as fs from 'fs';

interface ImageUploadProps {
  refreshToken: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ refreshToken }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modelID, setModelID] = useState<number>(34);
  const [nodeIP, setNodeIP] = useState<string>("http://130.60.24.196:21000");
//   const [nodeIP, setNodeIP] = useState<string>("http://192.168.136.138:21000");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('refresh_token', refreshToken);
    formData.append('image', selectedImage);
    console.log(selectedImage);

    try {
      const response = await axios.post(`${nodeIP}/invoke/${modelID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      // Handle the response as needed
    } catch (error) {
      console.error('Detection failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleDetect}>Detect</button>
    </div>
  );
}

export default ImageUpload;
