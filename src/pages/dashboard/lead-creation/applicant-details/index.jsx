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

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const ApplicantDetails = () => {
  const [leadExists, setLeadExists] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);
  const [propertyType, setPropertyType] = useState(null);
  const [date, setDate] = useState();

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
  } = useContext(AuthContext);

  const [disablePhoneNumber, setDisablePhoneNumber] = useState(phoneNumberVerified);
  const [showOTPInput, setShowOTPInput] = useState(isLeadGenerated);

  const onLoanTypeChange = useCallback(
    (e) => {
      let newData = values;
      newData[e.name] = e.value;
      setValues({ ...newData });
    },
    [currentLeadId, setValues],
  );

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      let newData = values;
      newData[e.currentTarget.name] = value.charAt(0).toUpperCase() + value.slice(1);
      setValues({ ...newData });
    }
  }, []);

  const handleLoanPurposeChange = useCallback(
    (value) => {
      let newData = values;
      newData.loan_purpose = value;
      setValues({ ...newData });
    },
    [setValues],
  );

  const handlePropertyType = useCallback(
    (value) => {
      let newData = values;
      newData.property_type = value;
      setValues({ ...newData });
    },
    [currentLeadId, setValues, values.property_type],
  );

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;

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
    // let newData = values;
    // newData.mobile_number = phoneNumber;
    // setValues({ ...newData });
    setFieldValue('mobile_number', phoneNumber);
  }, []);

  const handleDateChange = useCallback((e) => {
    let newData = values;
    newData.date_of_birth = e;
    setValues(newData);
  }, []);

  const onOTPSendClick = useCallback(() => {}, [leadExists, disablePhoneNumber]);

  const verifyLeadOTP = useCallback(async (otp) => {}, [setPhoneNumberVerified]);

  return (
    <div className='flex flex-col bg-medium-grey gap-2 h-[95vh] overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[62px]'>
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
              name='loan_type'
              label={data.label}
              value={data.value}
              current={values.loan_type}
              onChange={onLoanTypeChange}
              containerClasses='flex-1'
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
            values={values.middle_name}
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
            values={values.last_name}
            placeholder='Eg: Swami, Singh'
            disabled={inputDisabled}
            name='last_name'
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />
        </div>
      </div>

      <DatePicker
        startDate={values.date_of_birth}
        setStartDate={handleDateChange}
        required
        name='date_of_birth'
        label='Date of Birth'
        error={errors.date_of_birth}
        touched={touched.date_of_birth}
        onBlur={handleBlur}
      />

      <DropDown
        label='Purpose of loan'
        required
        options={loanPurposeOptions}
        placeholder='Choose reference type'
        onChange={handleLoanPurposeChange}
        touched={touched.loan_purpose}
        error={errors.loan_purpose}
        onBlur={handleBlur}
        defaultSelected={values.loan_purpose}
        inputClasses='mt-2'
      />

      {values?.loan_purpose ? (
        <DropDown
          label='Property Type'
          required
          placeholder='Eg: Residential'
          options={loanFields[values.loan_purpose] || ['Home Purchase']}
          onChange={handlePropertyType}
          defaultSelected={values.property_type}
          disabled={!values.loan_purpose}
          touched={touched.property_type}
          error={errors.property_type}
        />
      ) : null}

      <div>
        <div className='flex justify-between gap-2 items-center'>
          <div className='w-full'>
            <TextInput
              label='Mobile number'
              placeholder='Eg: 1234567890'
              required
              name='mobile_number'
              type='tel'
              value={values.mobile_number}
              error={errors.mobile_number}
              touched={touched.mobile_number}
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
                  setValues(
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
