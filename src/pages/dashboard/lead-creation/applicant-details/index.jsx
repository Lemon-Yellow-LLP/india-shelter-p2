import { useContext, useEffect, useRef } from 'react';
import { useState, useCallback } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { IconHomeLoan, IconLoanAgainstProperty } from '../../../../assets/icons';
import DatePicker from '../../../../components/DatePicker';
import { isEighteenOrAbove } from '../../../../global/index';
import {
  CardRadio,
  TextInput,
  DropDown,
  OtpInput,
  CurrencyInput,
  RangeSlider,
} from '../../../../components';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';

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

const ApplicantDetails = () => {
  const [leadExists, setLeadExists] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);
  const [date, setDate] = useState();

  const dateInputRef = useRef(null);

  const {
    inputDisabled,
    currentLeadId,
    setValues,
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    phoneNumberVerified,
    setPhoneNumberVerified,
    isLeadGenerated,
    setFieldValue,
    setFieldError,
    handleSubmit,
  } = useContext(AuthContext);

  const [disablePhoneNumber, setDisablePhoneNumber] = useState(phoneNumberVerified);
  const [showOTPInput, setShowOTPInput] = useState(isLeadGenerated);

  const onLoanTypeChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value.charAt(0).toUpperCase() + e.value.slice(1));
    },
    [currentLeadId, setValues],
  );

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleLoanPurposeChange = useCallback((value) => {
    setFieldValue('applicant_details.purpose_of_loan', value);
  }, []);

  const handlePropertyType = useCallback((value) => {
    setFieldValue('applicant_details.property_type', value);
  }, []);

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

    setFieldValue('applicant_details.mobile_number', phoneNumber);
  }, []);

  const onOTPSendClick = useCallback(() => {}, [leadExists, disablePhoneNumber]);

  const verifyLeadOTP = useCallback(async (otp) => {}, [setPhoneNumberVerified]);

  const handleLoanAmountChange = useCallback((e) => {
    setFieldValue('applicant_details.applied_amount', e.currentTarget.value);
  }, []);

  useEffect(() => {
    if (!date) return;
    if (!isEighteenOrAbove(date)) {
      setFieldError(
        'applicant_details.date_of_birth',
        'To apply for loan the minimum age must be 18 or 18+',
      );
      return;
    }
    setFieldValue('applicant_details.date_of_birth', date);

    let returnDate = new Date(date.toString());
    // Get the month (0-11, where 0 represents January)
    let month = returnDate.getMonth() + 1;
    month = month.toString().padStart(2, '0');
    // Get the day of the month
    const dayOfMonth = returnDate.getDate().toString().padStart(2, '0');
    // Get the year from the Date object
    const year = returnDate.getFullYear();
    const finalDate = `${year}-${month}-${dayOfMonth}T00:00:00.000Z`;
  }, [date, setFieldError, setFieldValue]);

  const datePickerScrollToTop = () => {
    if (dateInputRef.current) {
      dateInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  console.log('values', values);
  console.log(errors);
  console.log(touched);

  return (
    <div className='flex flex-col bg-medium-grey gap-2 h-[92vh] overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px]'>
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
              name='applicant_details.loan_type'
              label={data.label}
              value={data.value}
              current={values.applicant_details?.loan_type}
              onChange={onLoanTypeChange}
              containerClasses='flex-1'
            >
              {data.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      <CurrencyInput
        label='Required loan amount'
        placeholder='5,00,000'
        required
        name='applicant_details.applied_amount'
        value={values.applicant_details?.applied_amount}
        onBlur={handleBlur}
        onChange={handleLoanAmountChange}
        displayError={false}
        disabled={inputDisabled}
        inputClasses='font-semibold'
      />

      <RangeSlider
        minValueLabel='1 L'
        maxValueLabel='50 L'
        onChange={handleLoanAmountChange}
        initialValue={values.applicant_details?.applied_amount}
        min={100000}
        max={5000000}
        disabled={inputDisabled}
        step={50000}
      />

      {errors?.applicant_details?.applied_amount && touched?.applicant_details?.applied_amount ? (
        <span className='text-xs text-primary-red'>
          {errors?.applicant_details?.applied_amount}
        </span>
      ) : null}

      <TextInput
        label='First Name'
        placeholder='Eg: Suresh, Priya'
        required
        name='applicant_details.first_name'
        value={values.applicant_details?.first_name}
        error={errors?.applicant_details?.first_name}
        touched={touched?.applicant_details?.first_name}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <div className='flex flex-col md:flex-row gap-2 md:gap-6'>
        <div className='w-full'>
          <TextInput
            label='Middle Name'
            placeholder='Eg: Ramji, Sreenath'
            name='applicant_details.middle_name'
            value={values.applicant_details?.middle_name}
            error={errors?.applicant_details?.middle_name}
            touched={touched?.applicant_details?.middle_name}
            disabled={inputDisabled}
            onBlur={handleBlur}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />
        </div>
        <div className='w-full'>
          <TextInput
            onBlur={handleBlur}
            label='Last Name'
            value={values.applicant_details?.last_name}
            error={errors?.applicant_details?.last_name}
            touched={touched?.applicant_details?.last_name}
            placeholder='Eg: Swami, Singh'
            disabled={inputDisabled}
            name='applicant_details.last_name'
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />
        </div>
      </div>

      <DatePicker
        startDate={date}
        setStartDate={setDate}
        required
        name='applicant_details.date_of_birth'
        label='Date of Birth'
        error={errors?.applicant_details?.date_of_birth}
        touched={touched?.applicant_details?.date_of_birth}
        onBlur={handleBlur}
        reference={dateInputRef}
        datePickerScrollToTop={datePickerScrollToTop}
      />

      <DropDown
        label='Purpose of loan'
        name='applicant_details.purpose_of_loan'
        required
        options={loanPurposeOptions}
        placeholder='Eg: Choose reference type'
        onChange={handleLoanPurposeChange}
        touched={touched?.applicant_details?.purpose_of_loan}
        error={errors?.applicant_details?.purpose_of_loan}
        onBlur={handleBlur}
        defaultSelected={values.applicant_details?.purpose_of_loan}
        inputClasses='mt-2'
      />

      <DropDown
        label='Property Type'
        name='applicant_details.property_type'
        required
        placeholder='Eg: Residential'
        options={
          loanFields[values.applicant_details?.purpose_of_loan] || [
            {
              label: 'Residential House',
              value: 'Residential House',
            },
          ]
        }
        onChange={handlePropertyType}
        defaultSelected={values.applicant_details?.property_type}
        touched={touched?.applicant_details?.property_type}
        error={errors?.applicant_details?.property_type}
        onBlur={handleBlur}
      />

      <TextInputWithSendOtp
        label='Mobile number'
        placeholder='Eg: 1234567890'
        required
        name='applicant_details.mobile_number'
        type='tel'
        value={values.applicant_details?.mobile_number}
        error={errors?.applicant_details?.mobile_number}
        touched={touched?.applicant_details?.mobile_number}
        onBlur={handleBlur}
        onOTPSendClick={onOTPSendClick}
        disabledOtpButton={
          !((isLeadGenerated && !phoneNumberVerified && !disablePhoneNumber) || leadExists)
        }
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
        disabled={inputDisabled || disablePhoneNumber}
        inputClasses='hidearrow'
        message={
          phoneNumberVerified
            ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
            : null
        }
      />

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
