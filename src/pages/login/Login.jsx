import React, { useCallback, useContext, useState } from 'react';
import TextInputWithSendOtp from '../../components/TextInput/TextInputWithSendOtp';
import { AuthContext } from '../../context/AuthContext';
import { OtpInput } from '../../components';

export default function Login() {
  const { values, errors, touched, handleBlur, setFieldValue, setFieldError } =
    useContext(AuthContext);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(
    values?.applicant_details?.is_mobile_verified,
  );

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;

    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }
    if (phoneNumber.length > 10) {
      return;
    }
    if (
      phoneNumber.charAt(0) === '0' ||
      phoneNumber.charAt(0) === '1' ||
      phoneNumber.charAt(0) === '2' ||
      phoneNumber.charAt(0) === '3' ||
      phoneNumber.charAt(0) === '4' ||
      phoneNumber.charAt(0) === '5'
    ) {
      e.preventDefault();
      return;
    }

    setShowOTPInput(false);

    setFieldValue('applicant_details.mobile_number', phoneNumber);

    if (phoneNumber.length === 10) {
      setHasSentOTPOnce(false);
    }

    // updateFieldsApplicant('mobile_number', phoneNumber);
  }, []);

  const sendMobileOtp = async () => {
    // setDisablePhoneNumber((prev) => !prev);
    setShowOTPInput(true);
    setHasSentOTPOnce(true);
    // getMobileOtp(1);
    setToastMessage('OTP has been sent to your mail id');
  };

  console.log(showOTPInput);

  const verifyOTP = useCallback((otp) => {
    verifyMobileOtp(1, otp)
      .then(async () => {
        await updateFieldsLead().then((res) => {
          // setFieldValue('applicant_details.lead_id', res.id);
          // updateFieldsApplicant('lead_id', res.id);
          setMobileVerified(true);
          // setFieldValue('applicant_details.is_mobile_verified', true);
          // updateFieldsApplicant('is_mobile_verified', true);
          setShowOTPInput(false);
          return true;
        });
      })
      .catch((err) => {
        setMobileVerified(false);
        setShowOTPInput(true);
        return false;
      });
  }, []);

  return (
    <div>
      <TextInputWithSendOtp
        type='tel'
        inputClasses='hidearrow'
        label='Mobile Number'
        placeholder='Eg: 1234567890'
        required
        name='applicant_details.mobile_number'
        value={values.applicant_details?.mobile_number}
        onChange={handleOnPhoneNumberChange}
        error={errors.applicant_details?.mobile_number}
        touched={touched.applicant_details?.mobile_number}
        onOTPSendClick={sendMobileOtp}
        disabledOtpButton={
          !values.applicant_details?.mobile_number ||
          !!errors.applicant_details?.mobile_number ||
          mobileVerified ||
          hasSentOTPOnce
        }
        disabled={disablePhoneNumber || mobileVerified}
        message={
          mobileVerified
            ? `<img src="${otpVerified}" alt='Otp Verified' role='presentation' /> OTP Verfied`
            : null
        }
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          console.log(name);
          console.log(errors);
          if (
            errors?.applicant_details &&
            !errors?.applicant_details[name] &&
            values?.applicant_details[name]
          ) {
            // updateFieldsApplicant(name, values.applicant_details[name]);
          }
        }}
        pattern='\d*'
        onFocus={(e) =>
          e.target.addEventListener(
            'wheel',
            function (e) {
              e.preventDefault();
            },
            { passive: false },
          )
        }
        min='0'
        onInput={(e) => {
          if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
        }}
      />

      {showOTPInput && (
        <OtpInput
          label='Enter OTP'
          required
          verified={mobileVerified}
          setOTPVerified={setMobileVerified}
          onSendOTPClick={sendMobileOtp}
          defaultResendTime={30}
          disableSendOTP={!mobileVerified}
          verifyOTPCB={verifyOTP}
          hasSentOTPOnce={hasSentOTPOnce}
        />
      )}
    </div>
  );
}
