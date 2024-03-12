import Button from '../Button';
import Scanner from '../Scanner';
import PropTypes from 'prop-types';

import Fingerprint_scanning from '../../assets/anim/Fingerprint_Scanning.json';
import Fingerprint_success from '../../assets/anim/Fingerprint_Success.json';
import Fingerprint_failure from '../../assets/anim/Fingerprint_Failure.json';

import { useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import { editFieldsById, performBiometric } from '../../global';

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
];

// type = "FMR", "iris", "faceAuth"
export default function ValidateScan({
  type,
  setPerformVerification,
  setScanningState,
  setOpenEkycPopup,
  ecsBioHelper,
  aadhaarNo,
  setAadhaarNo,
  setIsAadharInputDrawer,
  consent,
  setLoading,
  field_name,
  setRequiredFieldsStatus,
}) {
  const { setToastMessage, values, activeIndex, setValues, setFieldValue } =
    useContext(LeadContext);
  const { setErrorToastMessage, setErrorToastSubMessage, token } = useContext(AuthContext);
  // storing current selected scan meta data
  const [validateScanObj, setValidateScanObj] = useState({});
  const [disableCapture, setdisableCapture] = useState(false);

  // capture biometric
  const [isCapturing, SetIsCapturing] = useState(true);
  const [isCaptureSuccessful, setIsCaptureSuccessful] = useState(false);
  const [biometricData, setBiometricData] = useState(null);

  useEffect(() => {
    if (type === 'FMR') {
      setValidateScanObj(obj[0]);
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
      setValues(res.lead);
      setRequiredFieldsStatus(
        res?.lead?.applicants[activeIndex]?.personal_details?.extra_params?.required_fields_status,
      );
      setToastMessage('Information fetched Successfully');
    } catch (error) {
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
      console.log(error);
    } finally {
      setOpenEkycPopup(false);
      setPerformVerification(false);
      setLoading(false);
      setBiometricData(null);
      setAadhaarNo('');
      setIsAadharInputDrawer(true);
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
              primary
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
  field_name: PropTypes.string,
  setIsAadharInputDrawer: PropTypes.func,
  setAadhaarNo: PropTypes.func,
  setRequiredFieldsStatus: PropTypes.func,
};
