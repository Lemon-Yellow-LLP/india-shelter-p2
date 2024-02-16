import Button from '../Button';
import Scanner from '../Scanner';
import PropTypes from 'prop-types';
import { Fingerprint_failure, Fingerprint_success, Scanning_fingerprint } from './ScanAnimations';
import { useEffect, useState } from 'react';

// type = "biometric", "iris", "faceAuth"
export default function ValidateScan({ type, setPerformVerification }) {
  const [validateScanObj, setValidateScanObj] = useState({});
  const [isCaptureSuccessful, setIsCaptureSuccessful] = useState(false);
  const [scannerAnimation, setScannerAnimation] = useState(null);
  const [scannerMsg, setScannerMsg] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsCaptureSuccessful(true);
    }, 3000);
  }, []);

  useEffect(() => {
    setScannerAnimation(validateScanObj.scanSuccessAnimation);
    setScannerMsg(validateScanObj.scanSuccessMsg);
  }, [isCaptureSuccessful]);

  useEffect(() => {
    if (type === 'biometrics') {
      let obj = {
        title: 'Biometrics Scan',
        scanLoadingMsg: 'Place your THUMB/FINGER on scanner',
        scanFailureMsg: 'Successfully captured information, validating Aadhar details',
        scanSuccessMsg: 'Unable to capture information, place your THUMB/FINGER on scanner',
        scanLoadingAnimation: Scanning_fingerprint,
        scanSuccessAnimation: Fingerprint_success,
        scanFailureAnimation: Fingerprint_failure,
      };
      setValidateScanObj(obj);
      console.log('setting validatescanobj');
      setScannerAnimation(obj.scanLoadingAnimation);
      setScannerMsg(obj.scanLoadingMsg);
    }
  }, [type]);
  console.log(type);
  return (
    <>
      <div className='px-4 py-2 flex gap-2 justify-start w-full border-b border-lighter-grey'>
        <button
          onClick={() => {
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
        <Scanner animationFile={scannerAnimation} message={scannerMsg} />
        <Button
          primary
          disabled={!isCaptureSuccessful}
          onClick={() => console.log('validating captured biometrics')}
          inputClasses='!py-3 mt-6'
        >
          Validate
        </Button>
      </div>
    </>
  );
}

ValidateScan.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  setPerformVerification: PropTypes.func,
};
