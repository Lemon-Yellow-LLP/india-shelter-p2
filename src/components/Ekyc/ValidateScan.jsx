import Button from '../Button';
import Scanner from '../Scanner';
import PropTypes from 'prop-types';

import Fingerprint_scanning from '../../assets/anim/Fingerprint_Scanning.json';
import Fingerprint_success from '../../assets/anim/Fingerprint_Success.json';
import Fingerprint_failure from '../../assets/anim/Fingerprint_Failure.json';

import Iris_scanning from '../../assets/anim/Iris_Scanning.json';
import Iris_success from '../../assets/anim/Iris_Success.json';
import Iris_failure from '../../assets/anim/Iris_Failure.json';

import FaceAuth_scanning from '../../assets/anim/FaceAuth_Scanning.json';
import FaceAuth_success from '../../assets/anim/FaceAuth_Success.json';
import FaceAuth_failure from '../../assets/anim/FaceAuth_Failure.json';

import { useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import { performBiometric } from '../../global';

// biometric screen meta based on type
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

// type = "FMR", "iris", "faceAuth"
export default function ValidateScan({
  type,
  setPerformVerification,
  setScanningState,
  setOpenEkycPopup,
  ecsBioHelper,
  aadhaarNo,
  consent,
  setLoading,
  field_name,
}) {
  const { setToastMessage, values, activeIndex } = useContext(LeadContext);
  const { setErrorToastMessage, setErrorToastSubMessage, token } = useContext(AuthContext);
  // storing current selected scan meta data
  const [validateScanObj, setValidateScanObj] = useState({});
  const [disableCapture, setdisableCapture] = useState(false);

  // capture biometric
  const [isCapturing, SetIsCapturing] = useState(true);
  const [isCaptureSuccessful, setIsCaptureSuccessful] = useState(false);
  const [biometricData, setBiometricData] = useState(null);

  useEffect(() => {
    captureScan();
  }, []);
  useEffect(() => {
    if (type === 'FMR') {
      setValidateScanObj(obj[0]);
    } else if (type === 'iris') {
      setValidateScanObj(obj[1]);
    } else {
      setValidateScanObj(obj[2]);
    }
  }, [type]);

  // capture biometric
  const captureScan = async () => {
    setdisableCapture(true);

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
          console.log(responseXml, ' data from mantra device');
          if (responseXml.includes('errCode="0"')) {
            setBiometricData(responseXml);
            SetIsCapturing(false);
            setdisableCapture(false);
            setIsCaptureSuccessful(true);
          } else {
            SetIsCapturing(false);
            setdisableCapture(false);
            setIsCaptureSuccessful(false);
          }
          // performKyc(aadhaarNumber, consent, responseXml, 'FMR', fType, otpValue != null);
        },
        function (errorMessage) {
          setdisableCapture(false);
          setIsCaptureSuccessful(false);
          SetIsCapturing(false);
          console.log(errorMessage);
        },
      );
    }
  };

  // validate captured biometric
  const validateCapturedScan = async () => {
    try {
      setLoading(true);
      const res = await performBiometric(
        {
          aadhaar_number: aadhaarNo, //<---- Enter aadhar number here
          consent: consent,
          pid_data: biometricData,
          bio_type: 'FMR',
          fmr_type: '2',
          uses_otp: 'false',
          applicant_id: values?.applicants[activeIndex]?.applicant_details?.id,
          field_name,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log(res);
      setToastMessage('Information fetched Successfully');
    } catch (error) {
      setErrorToastMessage(error.response.data.error);
      setErrorToastSubMessage(error.response.data.details.errMsg);
      console.log(error);
    } finally {
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setLoading(false);
    }
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
        {isCapturing ? (
          // capturing biometric
          <>
            <Scanner
              animationFile={validateScanObj.scanLoadingAnimation}
              message={validateScanObj.scanLoadingMsg}
            />
            <Button
              primaryapplicant_id
              disabled={disableCapture}
              onClick={captureScan}
              inputClasses='!py-3 mt-6 w-full'
            >
              Capture
            </Button>
          </>
        ) : isCaptureSuccessful ? (
          // validating captured biometric
          <>
            <Scanner
              animationFile={validateScanObj.scanSuccessAnimation}
              message={validateScanObj.scanSuccessMsg}
            />
            <Button primary onClick={validateCapturedScan} inputClasses='!py-3 mt-6'>
              Validate
            </Button>
          </>
        ) : (
          // on Capture failure "Try again" or "Try another method"
          <>
            <Scanner
              animationFile={validateScanObj.scanFailureAnimation}
              message={validateScanObj.scanFailureMsg}
            />
            <Button
              primary
              onClick={() => {
                SetIsCapturing(true);
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
                SetIsCapturing(true);
              }}
              inputClasses='!py-3 mt-3'
            >
              Try another method
            </Button>
          </>
        )}
      </div>
    </>
  );
}

ValidateScan.propTypes = {
  type: PropTypes.string,
  setPerformVerification: PropTypes.func,
  setScanningState: PropTypes.func,
  setOpenEkycPopup: PropTypes.func,
  ecsBioHelper: PropTypes.any,
  aadhaarNo: PropTypes.string,
  consent: PropTypes.string,
  setLoading: PropTypes.func,
};
