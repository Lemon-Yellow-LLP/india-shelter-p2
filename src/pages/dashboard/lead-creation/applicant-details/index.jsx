import { useContext } from 'react';
import { useState, useCallback } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { IconHomeLoan, IconLoanAgainstProperty } from '../../../../assets/icons';
import DatePicker from '../../../../components/DatePicker';
import { CardRadio, TextInput, DropDown, OtpInput } from '../../../../components';

const loanTypeOptions = [
  {
    label: 'Home Loan',
    value: 'Home Loan',
    icon: <IconHomeLoan />,
  },
  {
    label: 'Loan against Property',
    value: 'LAP',
    icon: <IconLoanAgainstProperty />,
  },
];

const loanOptions = {
  'Home Purchase': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
    {
      label: 'Ready Built Flat',
      value: 'Ready Built Flat',
    },
  ],
  'Home Construction': [
    {
      label: 'Owned Plot',
      value: 'Owned Plot',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
  ],
  'Home Renovation/Extension': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
  ],
  'BT+Top-up': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
    {
      label: 'Ready Built Flat',
      value: 'Ready Built Flat',
    },
  ],
};

const arr = [
  { 'Home Purchase': [1, 2] },
  { 'Home Construction': [3, 4] },
  { 'Home Renovation/Extension': [5, 6] },
  { 'BT+Top-up': [7, 8] },
];

for (let i of arr) {
  // console.log(i);
  for (let j in i) {
    console.log(j);
  }
}

const loanPurposeData = [
  {
    label: 'Home Purchase',
    value: 'Home Purchase',
  },
  {
    label: 'Home Construction',
    value: 'Home Construction',
  },
  {
    label: 'Home Renovation/Extension',
    value: 'Home Renovation/Extension',
  },
  {
    label: 'BT+Top-up',
    value: 'BT+Top-up',
  },
];

// const fieldsRequiredForLeadGeneration = ['first_name', 'phone_number', 'pincode'];
const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];
// const disableNextFields = ['loan_request_amount', 'first_name', 'pincode', 'phone_number'];

const ApplicantDetails = () => {
  const [leadExists, setLeadExists] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);
  const [loanPurpose, setLoanPurpose] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [date, setDate] = useState();

  const {
    inputDisabled,
    currentLeadId,
    setFieldValue,
    setFieldError,
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    phoneNumberVerified,
    setPhoneNumberVerified,
    isLeadGenerated,
  } = useContext(AuthContext);

  const [disablePhoneNumber, setDisablePhoneNumber] = useState(phoneNumberVerified);
  const [showOTPInput, setShowOTPInput] = useState(isLeadGenerated);
  // searchParams.has('li') && !isLeadGenerated

  // useEffect(() => {
  //   setLoanPurpose(values.purpose_of_loan);
  // }, [values.purpose_of_loan]);

  // useEffect(() => {
  //   setPropertyType(values.property_type);
  // }, [values.property_type]);

  const onLoanTypeChange = useCallback(
    (e) => {
      const value = e;
      setSelectedLoanType(value);
      setFieldValue('loan_type', value);
      // updateLeadDataOnBlur(currentLeadId, 'gender', value);
    },
    [currentLeadId, setFieldValue],
  );

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleLoanPurposeChange = useCallback(
    (value) => {
      setLoanPurpose(value);
      // disableOneOption(value);
      // setFieldValue('reference_two_type', value);
    },
    [currentLeadId, setFieldValue, loanPurpose],
  );

  const handlePropertyType = useCallback(
    (value) => {
      // setPropertyType(value);
      // setFieldValue('property_type', value);
      // updateLeadDataOnBlur(currentLeadId, 'property_type', value);
    },
    [currentLeadId, setFieldValue, propertyType],
  );

  // const handlePropertyTypeChange = useCallback(
  //   (value) => {
  //     setPropertyTypeOptions(value);
  //     // disableOneOption(value);
  //     // setFieldValue('reference_two_type', value);
  //   },
  //   [propertyTypeOptions],
  // );

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;
    console.log(phoneNumber);
    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }
    if (phoneNumber.length > 10) {
      console.log('true');
      return;
    }
    if (phoneNumber.charAt(0) === '0') {
      e.preventDefault();
      return;
    }
    setFieldValue('phone_number', phoneNumber);
    // if (phoneNumber?.length < 10) {
    //   setLeadExists(false);
    //   setShowOTPInput(false);
    //   return;
    // }
    // const data = await getLeadByPhoneNumber(phoneNumber);
    // if (data.length) {
    //   setLeadExists(true);
    //   setShowOTPInput(true);
    // }
  }, []);

  const onOTPSendClick = useCallback(() => {
    // setHasSentOTPOnce(true);
    // setDisablePhoneNumber(true);
    // setToastMessage('OTP has been sent to your mobile number');
    // const continueJourney = searchParams.has('li') || leadExists;
    // sendMobileOTP(phone_number, continueJourney).then((res) => {
    //   if (res.status === 500) {
    //     setFieldError('otp', res.data.message);
    //     return;
    //   }
    //   if ('OTPCredential' in window) {
    //     window.addEventListener('DOMContentLoaded', (_) => {
    //       const ac = new AbortController();
    //       navigator.credentials
    //         .get({
    //           otp: { transport: ['sms'] },
    //           signal: ac.signal,
    //         })
    //         .then((otp) => {
    //           console.log(otp.code);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     });
    //   } else {
    //     console.error('WebOTP is not supported in this browser');
    //   }
    // });
  }, [leadExists, disablePhoneNumber]);

  // phone_number, searchParams, setFieldError, setToastMessage,

  const verifyLeadOTP = useCallback(
    async (otp) => {
      // try {
      //   const res = await verifyMobileOtp(phone_number, { otp, sms_link: true });
      //   if (res.status === 200) {
      //     setPhoneNumberVerified(true);
      //     setInputDisabled(false);
      //     setFieldError('phone_number', undefined);
      //     setShowOTPInput(false);
      //     return true;
      //   }
      //   setPhoneNumberVerified(false);
      //   return false;
      // } catch {
      //   setPhoneNumberVerified(false);
      //   return false;
      // }
    },
    [setPhoneNumberVerified],
  );

  // phone_number, setFieldError, setInputDisabled,

  return (
    <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] h-[100vh] pb-[62px]'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          Loan Type <span className='text-primary-red text-xs'>*</span>
        </label>
        <div
          className={`flex gap-4 w-full ${
            inputDisabled ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto'
          }`}
        >
          {loanTypeOptions.map((data, index) => (
            <CardRadio
              key={index}
              name='years'
              label={data.label}
              value={data.value}
              current={selectedLoanType}
              onChange={onLoanTypeChange}
            >
              {data.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      <TextInput
        label='First Name'
        placeholder='Eg: Suresh, Priya'
        required
        name='first_name'
        value={values.first_name}
        error={errors.first_name}
        touched={touched.first_name}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <div className='flex flex-col md:flex-row gap-2 md:gap-6'>
        <div className='w-full'>
          <TextInput
            value={values.middle_name}
            label='Middle Name'
            placeholder='Eg: Ramji, Sreenath'
            name='middle_name'
            disabled={inputDisabled}
            onBlur={handleBlur}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />
        </div>
        <div className='w-full'>
          <TextInput
            value={values.last_name}
            onBlur={handleBlur}
            label='Last Name'
            placeholder='Eg: Swami, Singh'
            disabled={inputDisabled}
            name='last_name'
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />
        </div>
      </div>

      <DatePicker
        startDate={date}
        setStartDate={setDate}
        required
        name='date_of_birth'
        label='Date of Birth'
      />
      {/* <span className='text-xs text-primary-red'>
        {errors.date_of_birth || touched.date_of_birth
          ? errors.date_of_birth
          : String.fromCharCode(160)}
      </span> */}

      <DropDown
        label='Purpose of loan'
        required
        options={loanPurposeOptions}
        placeholder='Choose reference type'
        onChange={handleLoanPurposeChange}
        defaultSelected={loanPurpose}
        inputClasses='mt-2'
      />

      {loanPurpose ? (
        <DropDown
          label='Property Type'
          required
          placeholder='Eg: Residential'
          options={loanFields[loanPurpose] || ['Home Purchase']}
          onChange={handlePropertyType}
          defaultSelected={propertyType}
          disabled={!loanPurpose}
        />
      ) : null}

      <div>
        <div className='flex justify-between gap-2'>
          <div className='w-full'>
            <TextInput
              label='Mobile number'
              placeholder='Eg: 1234567890'
              required
              name='phone_number'
              type='tel'
              value={values.phone_number}
              error={errors.phone_number}
              touched={touched.phone_number}
              onBlur={handleBlur}
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
              onChange={handleOnPhoneNumberChange}
              onPaste={(e) => {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
                e.target.value = text;
                handleChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  setFieldValue(
                    'phone_number',
                    values.phone_number.slice(0, values.phone_number.length - 1),
                  );
                  e.preventDefault();
                  return;
                }
                if (DISALLOW_CHAR.includes(e.key)) {
                  e.preventDefault();
                  return;
                }
              }}
              disabled={inputDisabled || disablePhoneNumber}
              inputClasses='hidearrow'
              message={
                phoneNumberVerified
                  ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
                  : null
              }
              displayError={disablePhoneNumber}
            />
          </div>
          <button
            className={`min-w-[93px] self-end font-normal py-3 px-2 rounded disabled:text-dark-grey disabled:bg-stroke ${
              disablePhoneNumber
                ? 'text-dark-grey bg-stroke mb-[22px] pointer-events-none'
                : 'bg-primary-red text-white'
            }`}
            disabled={
              !((isLeadGenerated && !phoneNumberVerified && !disablePhoneNumber) || leadExists)
            }
            onClick={onOTPSendClick}
          >
            Send OTP
          </button>
        </div>
        {!disablePhoneNumber && <div className='h-4'></div>}
      </div>

      {console.log(showOTPInput)}

      {showOTPInput && (
        <OtpInput
          label='Enter OTP'
          required
          verified={phoneNumberVerified}
          setOTPVerified={setPhoneNumberVerified}
          onSendOTPClick={onOTPSendClick}
          defaultResendTime={30}
          disableSendOTP={(isLeadGenerated && !phoneNumberVerified) || leadExists}
          verifyOTPCB={verifyLeadOTP}
          hasSentOTPOnce={hasSentOTPOnce}
        />
      )}
    </div>
  );
};

export default ApplicantDetails;
