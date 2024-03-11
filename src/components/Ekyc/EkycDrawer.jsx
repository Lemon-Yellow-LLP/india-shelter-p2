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
import { editFieldsById, generateEkycOtp, validateEkycOtp } from '../../global';
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
];

// generate aadhaar otp returns otpTxnId which is required in validate otp
let otpTxnId;
const biometricKey =
  import.meta.env.VITE_MANTRA_BIOMETRIC_KEY ||
  '0635457cb5902550bab01d6a3864deeab3c6cfb8012306d7716311b4b1a20a84f5ad74a58815';
export default function EkycDrawer({
  setOpenEkycPopup,
  setLoading,
  field_name,
  setRequiredFieldsStatus,
}) {
  const ecsBioHelper = window.ecsBioHelper;
  const { setToastMessage, values, setValues, activeIndex, setFieldValue } =
    useContext(LeadContext);
  const { setErrorToastMessage, setErrorToastSubMessage, token } = useContext(AuthContext);

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

  const [disableFields, setDisableFields] = useState(false);

  useEffect(() => {
    if (!ecsBioHelper.init(biometricKey)) {
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
      setLoading(true);
      await generateEkycOtp(
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
    } catch (error) {
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setIsAadharInputDrawer(true);
      setErrorToastMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  // send otp on Mobile and email
  const handleVerify = async () => {
    try {
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
      const data =
        field_name === 'id_type'
          ? { is_ekyc_performed_id: true }
          : { is_ekyc_performed_address: true };

      await editFieldsById(
        values?.applicants?.[activeIndex]?.applicant_details?.id,
        'applicant',
        {
          extra_params: {
            ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params,
            ...data,
          },
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      const res = await validateEkycOtp(
        {
          aadhaar_number: aadhaarNo,
          consent: consent,
          otp_txn_id: otpTxnId,
          otp_value: otp,
          applicant_id: values?.applicants[activeIndex]?.applicant_details?.id,
          field_name,
          // remove condition after adding ekyc credentials
          fail: otp === '123456' && true,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setValues(res.lead);
      setRequiredFieldsStatus(
        res?.lead?.applicants[activeIndex]?.personal_details?.extra_params?.required_fields_status,
      );
      setToastMessage('Information fetched Successfully');
    } catch (error) {
      console.log(error);
      const maskedPortion = aadhaarNo.slice(0, 8).replace(/\d/g, '*');
      const maskedAadhar = maskedPortion + aadhaarNo.slice(8);
      let data =
        field_name === 'id_type'
          ? {
              id_number: maskedAadhar,
              extra_params: {
                ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params,
                required_fields_status: {
                  ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                    .required_fields_status,
                  id_number: true,
                },
              },
            }
          : {
              address_proof_number: maskedAadhar,
              extra_params: {
                ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params,
                required_fields_status: {
                  ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                    .required_fields_status,
                  address_proof_number: true,
                },
              },
            };
      await editFieldsById(
        values?.applicants?.[activeIndex]?.personal_details?.id,
        'personal',
        data,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (field_name === 'id_type') {
        setFieldValue(`applicants[${activeIndex}].personal_details.id_number`, maskedAadhar);
        setRequiredFieldsStatus((prev) => ({ ...prev, id_number: true }));
        setFieldValue(
          `applicants[${activeIndex}].applicant_details.extra_params.is_ekyc_performed_id`,
          true,
        );
      } else {
        setFieldValue(
          `applicants[${activeIndex}].applicant_details.extra_params.is_ekyc_performed_address`,
          true,
        );
        setFieldValue(
          `applicants[${activeIndex}].personal_details.address_proof_number`,
          maskedAadhar,
        );
        setRequiredFieldsStatus((prev) => ({ ...prev, address_proof_number: true }));
      }

      setErrorToastMessage(error?.response?.data?.error);
      setErrorToastSubMessage(error?.response?.data?.details?.errMsg);
    } finally {
      setLoading(false);
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setIsAadharInputDrawer(true);
      setAadhaarNo('');
      setIsConsentChecked(false);
      setOtp('');
    }
  };

  // detecting biometric device
  const handleScan = async () => {
    setDisableFields(true);
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
        <button
          onClick={() => {
            setOpenEkycPopup(false);
            setAadhaarNo('');
          }}
        >
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
        setAadhaarNo={setAadhaarNo}
        consent={consent}
        setLoading={setLoading}
        field_name={field_name}
        setIsAadharInputDrawer={setIsAadharInputDrawer}
        setRequiredFieldsStatus={setRequiredFieldsStatus}
      />
    )
  ) : (
    <>
      <div className='relative'>
        <div className='w-full h-[494px] flex flex-col'>
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
                    onChange={(value) => setSelectedEkycMethod(value)}
                    disabled={disableFields}
                  />
                );
              })}
            </div>
            <hr className='my-4 bg-lighter-grey h-px w-full' />
            <ConsentBox
              isChecked={isConsentChecked}
              setIsChecked={setIsConsentChecked}
              updateConsent={updateConsent}
              disabled={disableFields}
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
            setDisableFields(false);
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
            setDisableFields(false);
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
  field_name: PropTypes.string,
};
