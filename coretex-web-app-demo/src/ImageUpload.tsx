// ImageUpload.tsx
import React, { useState, FC } from 'react';
import axios from 'axios';
import * as fs from 'fs';

interface ImageUploadProps {
  refreshToken: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ refreshToken }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    // const axios = require('axios');
    // const FormData = require('form-data');
    // const fs = require('fs');
    // let data = new FormData();
    // data.append('refresh_token', 'f3addd06909d3d9050eb1e8c5c117897482430679765f572d0b42cc1150b34f277852277aed78cbc3bb829d5b8646e2facb99c29d7acd9ea67d22e086a708ba2');
    // data.append('image', fs.createReadStream('/Users/duskomirkovic/Downloads/preis-gueltigkeit.jpg'));
    // data.append('async', 'true');
    // let config = {
    // method: 'post',
    // maxBodyLength: Infinity,
    // url: 'http://localhost:21000/invoke/3886',
    // headers: { 
    //     ...data.getHeaders()
    // },
    // data : data
    // };
    // axios.request(config)
    // .then((response) => {
    // console.log(JSON.stringify(response.data));
    // })
    // .catch((error) => {
    // console.log(error);
    // });


    try {
      const response = await axios.post('http://192.168.136.163:21000/invoke/3902', formData, {
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
