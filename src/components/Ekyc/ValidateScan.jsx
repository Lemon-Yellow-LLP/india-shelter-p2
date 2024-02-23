import Button from '../Button';
import Scanner from '../Scanner';
import PropTypes from 'prop-types';
import {
  Fingerprint_scanning,
  Fingerprint_success,
  Fingerprint_failure,
  Iris_scanning,
  Iris_success,
  Iris_failure,
  FaceAuth_scanning,
  FaceAuth_success,
  FaceAuth_failure,
} from './ScanAnimations';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';

let obj = [
  {
    title: 'Biometrics Scan',
    scanLoadingMsg: 'Place your THUMB/FINGER on scanner',
    scanSuccessMsg: 'Successfully captured information, validating Aadhar details',
    scanFailureMsg: 'Unable to capture information, place your THUMB/FINGER on scanner',
    scanLoadingAnimation: Fingerprint_scanning,
    scanSuccessAnimation: Fingerprint_success,
    scanFailureAnimation: Fingerprint_failure,
  },
  {
    title: 'IRIS scan',
    scanLoadingMsg: 'Place your EYE in front of machine',
    scanSuccessMsg: 'Successfully captured information, validating Aadhar details',
    scanFailureMsg: 'Unable to capture information, Place your EYE in front of machine',
    scanLoadingAnimation: Iris_scanning,
    scanSuccessAnimation: Iris_success,
    scanFailureAnimation: Iris_failure,
  },
  {
    title: 'Face Authentication',
    scanLoadingMsg: 'Place your Face in front of Machine',
    scanSuccessMsg: 'Successfully captured information, validating Aadhar details',
    scanFailureMsg: 'Unable to capture information, Place your Face in front of Machine',
    scanLoadingAnimation: FaceAuth_scanning,
    scanSuccessAnimation: FaceAuth_success,
    scanFailureAnimation: FaceAuth_failure,
  },
];

// type = "biometric", "iris", "faceAuth"
export default function ValidateScan({
  type,
  setPerformVerification,
  setScanningState,
  setOpenEkycPopup,
  ecsBioHelper,
}) {
  const { setToastMessage } = useContext(LeadContext);
  const { setErrorToastMessage } = useContext(AuthContext);
  // storing current selected scan meta data
  const [validateScanObj, setValidateScanObj] = useState({});

  // capture biometric
  const [isCaptureSuccessful, setIsCaptureSuccessful] = useState(false);
  const [isCaptureFailure, setIsCaptureFailure] = useState(false);

  useEffect(() => {
    if (type === 'FMR') {
      setValidateScanObj(obj[0]);
    } else if (type === 'iris') {
      setValidateScanObj(obj[1]);
    } else {
      setValidateScanObj(obj[2]);
    }
  }, [type]);

  const captureScan = async () => {
    console.log('capturing scan', Math.random());

    // setting it to 0 for FMR
    var deviceSelectedIndex = 0;

    await ecsBioHelper.enableLog();

    if (type == 'FMR') {
      const wadh = '18f4CEiXeXcfGXvgWA/blxD+w2pw7hfQPY45JMytkPw=';
      const fType = 2;
      const otpValue = null;
      await ecsBioHelper.captureFMR(
        deviceSelectedIndex,
        'P',
        'K',
        1,
        fType,
        false,
        otpValue,
        wadh,
        function (responseXml) {
          console.log(responseXml, 'fingerprint data');
          if (responseXml) {
            setIsCaptureSuccessful(true);
          }
          // performKyc(aadhaarNumber, consent, responseXml, 'FMR', fType, otpValue != null);
        },
        function (errorMessage) {
          console.log(errorMessage);
        },
      );
    }

    // const { data } = await axios.get(
    //   `https://reqres.in/api/users/${Math.floor(Math.random() * 10)}?delay=4`,
    // );
    // if (data) {
    //   if (Math.floor(Math.random() * 10) % 2) {
    //     // capture successful
    //   } else {
    //     // capture unsuccessful
    //     setIsCaptureFailure(true);
    //   }
    // }
  };
  // useEffect(() => {
  //   setTimeout(() => captureScan(), 1000);
  // }, []);

  const validateCapturedScan = () => {
    console.log('validating captured scan with aadhar');
    setTimeout(() => {
      if (Math.floor(Math.random() * 10) % 2) {
        setToastMessage('Information fetched Successfully');
      } else {
        setErrorToastMessage('Technical error');
      }
      setOpenEkycPopup(false);
      setPerformVerification(false);
    }, 3000);
  };
  return (
    <>
      <div className='px-4 py-2 flex gap-2 justify-start w-full border-b border-lighter-grey'>
        <button
          onClick={() => {
            // setting scanning state to default loading state(searching for device)
            setScanningState('loading');
            setPerformVerification(false);
          }}
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M18.0001 12.125H6.0293'
              stroke='#373435'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M6 12.125L9.91844 16.25'
              stroke='#373435'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M6 12.125L9.91844 8'
              stroke='#373435'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <p className='font-semibold'>{validateScanObj.title}</p>
      </div>
      <div className='w-full px-4 pt-4 pb-6'>
        {isCaptureFailure ? (
          <>
            {/* if Capture fails show "Try again" or "Try another method" */}
            <Scanner
              animationFile={validateScanObj.scanFailureAnimation}
              message={validateScanObj.scanFailureMsg}
            />
            <Button
              primary
              onClick={() => {
                setIsCaptureFailure(false);
                captureScan();
              }}
              inputClasses='!py-3 mt-6'
            >
              Try again
            </Button>
            <Button
              onClick={() => {
                // setting scanning state to default loading state(searching for device)
                setScanningState('loading');
                setPerformVerification(false);
              }}
              inputClasses='!py-3 mt-3'
            >
              Try another method
            </Button>
          </>
        ) : (
          <>
            {/* validating if capture successful */}
            <Scanner
              animationFile={
                isCaptureSuccessful
                  ? validateScanObj.scanSuccessAnimation
                  : validateScanObj.scanLoadingAnimation
              }
              message={
                isCaptureSuccessful
                  ? validateScanObj.scanSuccessMsg
                  : validateScanObj.scanLoadingMsg
              }
            />
            <Button
              primary
              disabled={!isCaptureSuccessful}
              onClick={validateCapturedScan}
              inputClasses='!py-3 mt-6'
            >
              Validate
            </Button>
          </>
        )}
      </div>
      <Button
        primary
        onClick={() => {
          captureScan();
        }}
        inputClasses='!py-3 mt-6'
      >
        Try again
      </Button>
    </>
  );
}

ValidateScan.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  setPerformVerification: PropTypes.func,
};
