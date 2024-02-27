import { useContext, useEffect, useState, useCallback } from 'react';
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
export const ekycMethods = [
  {
    label: 'OTP',
    value: 'otp',
  },
  {
    label: 'Biometrics',
    value: 'FMR',
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

export default function EkycDrawer({ setOpenEkycPopup, setLoading }) {
  const ecsBioHelper = window.ecsBioHelper;
  const { setToastMessage, values } = useContext(LeadContext);
  const { setErrorToastMessage, token } = useContext(AuthContext);

  // aadharInputDrawser states
  const [isAadharInputDrawer, setIsAadharInputDrawer] = useState(true);
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [aadhaarNoError, setAadhaarNoError] = useState('');

  // select kyc method screen states
  // otp will be default selected for ekyc
  const [performVerification, setPerformVerification] = useState(false);
  const [selectedEkycMethod, setSelectedEkycMethod] = useState('otp');
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [consent, setConsent] = useState('');
  const [deviceScanPopup, setDeviceScanPopup] = useState(false);
  // loading, error, success (default would be loading state)
  const [scanningState, setScanningState] = useState('loading');

  // verify OTP screen states
  const [maskedMobile, setMaskedMobile] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);

  useEffect(() => {
    if (
      !ecsBioHelper.init(
        '0929343689fd09b252906caca8612081858126cb315c367ff43462c320559b63b3f9ee1f2dfb',
      )
    ) {
      console.log('ecsBioHelper terminate');
    }
  }, []);

  const updateConsent = useCallback(
    (consent) => {
      setConsent(consent);
    },
    [consent],
  );

  // resend otp on mobile and email
  const sendMobileOtp = async () => {
    try {
      console.log('sending otp on mobile no. linked to aadhar');
      const data = await generateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consent,
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
      setLoading(true);
      const data = await generateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consent,
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
      setPerformVerification(true);
    } catch (error) {
      console.log(error);
      setErrorToastMessage(error.response.data.error);
      setOpenEkycPopup(false);
      setIsAadharInputDrawer(true);
      setAadhaarNo('');
      setIsConsentChecked(false);
    } finally {
      setLoading(false);
    }
  };

  // handle otp and aadhaar verification
  const handleVerifyAadharOtp = async () => {
    try {
      setLoading(true);
      const res = await validateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consent,
          otp_txn_id: otpTxnId,
          otp_value: otp,
          applicant_id: values?.lead?.id,
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
      setErrorToastMessage('Technical error');
    } finally {
      setLoading(false);
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setIsAadharInputDrawer(true);
    }
  };

  // detecting biometric device
  const handleScan = async () => {
    console.log('searching for device');
    setDeviceScanPopup(true);
    ecsBioHelper.detectDevices(function () {
      if (ecsBioHelper.getDetectedDevices().length !== 0) {
        setScanningState('success');
      } else {
        setScanningState('error');
      }
    });
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
        <p className='font-semibold'>Enter Aadhar No</p>
        <button onClick={() => setOpenEkycPopup(false)}>
          <IconClose />
        </button>
      </div>
      <TextInput
        placeholder='Enter Aadhar number'
        type='number'
        name='aadhaarNo'
        value={aadhaarNo}
        onChange={handleAadhaarNoChange}
        error={aadhaarNoError}
        touched={true}
        min={0} // hanlde mousewheel down
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
        ecsBioHelper={ecsBioHelper}
        aadhaarNo={aadhaarNo}
        consent={consent}
        setLoading={setLoading}
      />
    )
  ) : (
    <>
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
              updateConsent={updateConsent}
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
    </>
  );
}

EkycDrawer.propTypes = {
  setOpenEkycPopup: PropTypes.func,
  setLoading: PropTypes.func,
};
