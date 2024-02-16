import { useContext, useRef, useState } from 'react';
import Button from '../Button';
import { IconClose } from '../../assets/icons';
import Radio from '../Radio';
import ConsentBox from '../ConsentBox';
import Popup from '../Popup';
import PropTypes from 'prop-types';
import EkycOtpInput from '../OtpInput/EkycOtpInput';
import ValidateScan from './ValidateScan';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';

// Add ekyc methods
const ekycMethods = [
  {
    label: 'OTP',
    value: 'otp',
  },
  {
    label: 'Biometrics',
    value: 'biometrics',
  },
  {
    label: 'IRIS',
    value: 'iris',
  },
  {
    label: 'Face Authentication',
    value: 'faceAuthentication',
  },
];

export default function EkycDrawer({ setOpenEkycPopup }) {
  const { setToastMessage } = useContext(LeadContext);
  const { setErrorToastMessage } = useContext(AuthContext);
  // otp will be default selected for ekyc
  const [selectedEkycMethod, setSelectedEkycMethod] = useState('otp');
  const [performVerification, setPerformVerification] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [deviceScanPopup, setDeviceScanPopup] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [hasSentEkycOTPOnce, setHasSentEkycOTPOnce] = useState(true);
  // loading, error, success (default would be loading state)
  const [scanningState, setScanningState] = useState('loading');

  const consentRef = useRef();
  const updateConsentRef = (consent) => {
    consentRef.current = consent;
  };
  const sendMobileOtp = () => {
    console.log('sending otp on mobile no. linked to aadhar');
  };

  const handleVerify = () => {
    console.log('sending otp on mobile no. linked to aadhar');
    setPerformVerification(true);
  };

  const handleVerifyAadharOtp = () => {
    console.log('verifing aadhar otp');
    setTimeout(() => {
      if (Math.floor(Math.random() * 10) % 2) {
        setToastMessage('Information fetched Successfully');
      } else {
        setErrorToastMessage('Technical error');
      }
      setOpenEkycPopup(false);
    }, 3000);
  };

  const handleScan = () => {
    console.log('searching for device');
    setDeviceScanPopup(true);
    setTimeout(() => {
      if (Math.floor(Math.random() * 10) % 2) {
        setScanningState('success');
      } else {
        setScanningState('error');
      }
    }, 3000);
  };
  console.log(consentRef.current);
  return performVerification ? (
    selectedEkycMethod === 'otp' ? (
      <>
        <div className='px-4 py-2 flex gap-2 justify-start w-full border-b border-lighter-grey'>
          <button
            onClick={() => {
              setPerformVerification(false);
              setIsVerifyOtp(false);
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
          <p className='font-semibold'>Verify OTP</p>
        </div>
        <div className='w-full px-4 pt-4 pb-6'>
          {/* Aadhar will provide the masked email and masked mobile no. */}
          <p className='text-sm text-dark-grey mb-3'>
            OTP successfully sent to ******1234 and ra******@gmail.com
          </p>
          <EkycOtpInput
            label='Enter OTP'
            required
            onSendOTPClick={sendMobileOtp}
            setIsVerifyOtp={setIsVerifyOtp}
            hasSentOTPOnce={hasSentEkycOTPOnce}
          />
          <Button
            primary
            disabled={!isVerifyOtp}
            onClick={handleVerifyAadharOtp}
            inputClasses='mt-6 !py-3'
          >
            Verify OTP
          </Button>
        </div>
      </>
    ) : (
      // handling biometrics, iris, faceAuth scan
      <ValidateScan
        type={selectedEkycMethod}
        setPerformVerification={setPerformVerification}
        setScanningState={setScanningState}
        setOpenEkycPopup={setOpenEkycPopup}
      />
    )
  ) : (
    <div className='relative'>
      <div className='w-full h-[550px] flex flex-col'>
        <div className='flex justify-between px-4 py-2 border-b border-lighter-grey'>
          <p className='font-semibold'>Select verification method</p>
          <button onClick={() => setOpenEkycPopup(false)}>
            <IconClose />
          </button>
        </div>
        <div className='px-4 pt-4 overflow-y-scroll'>
          <div className='flex flex-col gap-2'>
            {ekycMethods.map((method) => {
              return (
                <Radio
                  key={method.label}
                  label={method.label}
                  value={method.value}
                  current={selectedEkycMethod}
                  onChange={() => setSelectedEkycMethod(method.value)}
                />
              );
            })}
          </div>
          <hr className='my-4 bg-lighter-grey h-px w-full' />
          <ConsentBox
            isChecked={isConsentChecked}
            setIsChecked={setIsConsentChecked}
            updateConsentRef={updateConsentRef}
          />
        </div>
        <div className={`py-6 px-4 bg-[#FEFEFE] ${deviceScanPopup && 'opacity-0'}`}>
          <Button
            primary
            disabled={!isConsentChecked}
            onClick={() => {
              if (selectedEkycMethod === 'otp') {
                handleVerify();
                return;
              }
              handleScan();
            }}
            inputClasses='!py-3'
          >
            {selectedEkycMethod === 'otp' ? 'Verify' : 'Scan'}
          </Button>
        </div>
      </div>
      <Popup
        open={deviceScanPopup}
        handleSuccess={() => {
          setDeviceScanPopup(false);
          setPerformVerification(true);
        }}
        title={
          scanningState === 'loading'
            ? 'Please wait while we are detecting your device'
            : scanningState === 'error'
            ? 'Device not found'
            : 'Device found successfully'
        }
        description={scanningState === 'error' && 'Please try again or try another method'}
        state={scanningState}
        bottom={4}
        handleClose={() => {
          setDeviceScanPopup(false);
          // setting default scanning state
          setScanningState('loading');
        }}
      />
    </div>
  );
}

EkycDrawer.propTypes = {
  setOpenEkycPopup: PropTypes.func,
};
