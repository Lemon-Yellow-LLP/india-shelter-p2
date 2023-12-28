import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { AuthContext } from '../../context/AuthContextProvider';

axiosRetry(axios, { retries: 0 });

export default function FaceAuth() {
  const { isAuthenticated, setIsAuthenticated, token } = useContext(AuthContext);

  const navigate = useNavigate();

  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState('');

  const [faceAuthFailed, setFaceAuthFailed] = useState(false);

  const [retries, setRetries] = useState(false);

  const sendImageToAPI = async () => {
    if (capturedImage) {
      setRetries(true);
      await axios
        .post(
          `/api/bre-100`,
          { capturedImage },
          {
            headers: {
              Authorization: token,
            },
            timeout: 90000,
            'axios-retry': {
              retries: 2,
              retryCondition: () => true,
            },
          },
        )
        .then((res) => {
          setIsAuthenticated(true);
          navigate('/');
        })
        .catch((err) => {
          setIsAuthenticated(false);
          setFaceAuthFailed(true);
          navigate('/manual-login');
        });
    }
  };

  useEffect(() => {
    if (faceAuthFailed) {
      navigate('/manualLogin');
    }
  }, [faceAuthFailed]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    sendImageToAPI();
  };

  useEffect(() => {
    if (!retries) {
      capture();
    }
  }, [capturedImage]);

  useEffect(() => {
    const timeOutId = setInterval(capture, 3000);

    return () => {
      clearInterval(timeOutId);
    };
  }, []);

  return (
    <div>
      <Webcam
        mirrored={true}
        audio={false}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        onLoad={capture}
        // className='opacity-0'
      />
      {/* {capturedImage && <img src={capturedImage} />} */}
    </div>
  );
}
