import { useContext, useEffect, useRef, useState } from 'react';
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
import { generateEkycOtp, validateEkycOtp } from '../../global';
import TextInput from '../TextInput';

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

// generate aadhaar otp returns otpTxnId which is required in validate otp
let otpTxnId;
export default function EkycDrawer({ setOpenEkycPopup }) {
  const { setToastMessage } = useContext(LeadContext);
  const { setErrorToastMessage, token } = useContext(AuthContext);

  const [isAadharInputDrawer, setIsAadharInputDrawer] = useState(true);
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [aadhaarNoError, setAadhaarNoError] = useState('');

  // otp will be default selected for ekyc
  const [selectedEkycMethod, setSelectedEkycMethod] = useState('otp');
  const [performVerification, setPerformVerification] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [deviceScanPopup, setDeviceScanPopup] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [hasSentEkycOTPOnce, setHasSentEkycOTPOnce] = useState(true);
  // loading, error, success (default would be loading state)
  const [scanningState, setScanningState] = useState('loading');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState('');

  const consentRef = useRef();
  const updateConsentRef = (consent) => {
    consentRef.current = consent;
  };

  // resend otp on mobile and email
  const sendMobileOtp = async () => {
    try {
      console.log('sending otp on mobile no. linked to aadhar');
      const data = await generateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consentRef.current,
          send_sms: true,
          send_email: true,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // send otp on Mobile and email
  const handleVerify = async () => {
    try {
      console.log('sending otp on mobile no. linked to aadhar');
      const data = await generateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consentRef.current,
          send_sms: true,
          send_email: true,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      otpTxnId = data.OtpTxnId;
      setMaskedMobile(data?.maskedMobile);
      setMaskedEmail(data?.maskedEmail);
      console.log(data);
      setPerformVerification(true);
    } catch (error) {
      console.log(error);
      setErrorToastMessage(error.response.data.error);
      setOpenEkycPopup(false);
      setIsAadharInputDrawer(true);
      setAadhaarNo('');
      setIsConsentChecked(false);
    }
  };

  // handle otp and aadhaar verification
  const handleVerifyAadharOtp = async () => {
    try {
      console.log('verifing aadhar otp');
      const res = await validateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consentRef.current,
          otp_txn_id: otpTxnId,
          otp_value: otp,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log(res);
      setToastMessage('Information fetched Successfully');
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setIsAadharInputDrawer(true);
    } catch (error) {
      setErrorToastMessage('Technical error');
    }
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

  // aadhaar no validation
  const handleAadhaarNoChange = (e) => {
    const value = e.target.value;
    const aadhaarPattern = /^\d{12}$/;
    if (value[0] == '0' || value[0] == '1') return;
    setAadhaarNo(value);
    if (aadhaarPattern.test(value)) {
      setAadhaarNoError('');
    } else {
      setAadhaarNoError('Enter valid 12 digit Aadhaar no.');
    }
  };

  return isAadharInputDrawer ? (
    <div className='w-full px-4 py-6 flex flex-col gap-3'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold'>Enter Aadhaar No</p>
        <button onClick={() => setOpenEkycPopup(false)}>
          <IconClose />
        </button>
      </div>
      <TextInput
        placeholder='Enter Aadhaar number'
        type='number'
        name='aadhaarNo'
        value={aadhaarNo}
        onChange={handleAadhaarNoChange}
        error={aadhaarNoError}
        touched={true}
        onKeyDown={(e) => {
          if (
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === ' ' ||
            e.keyCode === 32 ||
            (e.keyCode >= 65 && e.keyCode <= 90)
          ) {
            e.preventDefault();
          }
        }}
      />
      <Button
        primary
        inputClasses='!py-3'
        disabled={aadhaarNoError || !aadhaarNo}
        onClick={() => setIsAadharInputDrawer(false)}
      >
        Next
      </Button>
    </div>
  ) : performVerification ? (
    selectedEkycMethod === 'otp' ? (
      <>
        <div className='px-4 py-2 flex gap-2 justify-start w-full border-b border-lighter-grey'>
          <button
            onClick={() => {
              setPerformVerification(false);
              setIsVerifyOtp(false);
              setOtp('');
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
            OTP successfully sent to {maskedMobile} and {maskedEmail}
          </p>
          <EkycOtpInput
            label='Enter OTP'
            required
            onSendOTPClick={sendMobileOtp}
            setIsVerifyOtp={setIsVerifyOtp}
            hasSentOTPOnce={hasSentEkycOTPOnce}
            defaultResendTime={30}
            otp={otp}
            setOtp={setOtp}
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
          <button
            onClick={() => {
              setOpenEkycPopup(false);
              setAadhaarNo('');
              setIsAadharInputDrawer(true);
              setIsConsentChecked(false);
            }}
          >
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
        description={scanningState === 'error' ? 'Please try again or try another method' : ''}
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
