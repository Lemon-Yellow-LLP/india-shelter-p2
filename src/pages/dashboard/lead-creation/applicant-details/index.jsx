import { useContext, useEffect, useRef } from 'react';
import { useState, useCallback } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { IconHomeLoan, IconLoanAgainstProperty } from '../../../../assets/icons';
import DatePicker from '../../../../components/DatePicker';
import otpVerified from '../../../../assets/icons/otp-verified.svg';
import {
  editFieldsById,
  isEighteenOrAbove,
  getMobileOtp,
  verifyMobileOtp,
  addApi,
  checkExistingCustomer,
} from '../../../../global/index';

import {
  CardRadio,
  TextInput,
  DropDown,
  OtpInput,
  CurrencyInput,
  RangeSlider,
} from '../../../../components';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { Button } from '@mui/material';

const loanTypeOptions = [
  {
    label: 'Home Loan',
    value: 'HL',
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
  const {
    inputDisabled,
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    updateProgress,
    setToastMessage,
    setFieldTouched,
    handleSubmit,
  } = useContext(AuthContext);

  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);

  const [mobileVerified, setMobileVerified] = useState(
    values?.applicant_details?.is_mobile_verified,
  );

  const [showOTPInput, setShowOTPInput] = useState(false);

  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);

  const dateInputRef = useRef(null);

  const [date, setDate] = useState(values.applicant_details.date_of_birth);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    loan_type: false,
    applied_amount: true,
    first_name: false,
    date_of_birth: false,
    purpose_of_loan: false,
    property_type: false,
    mobile_number: false,
  });

  const updateFieldsApplicant = async (name, value) => {
    let newData = values.applicant_details;
    newData[name] = value;
    if (values.applicant_id) {
      const res = await editFieldsById(1, 'applicant', newData);
      return res;
    } else {
      const res = await addApi('applicant', newData);
      setFieldValue('applicant_id', res.id);
      return res;
    }
  };

  const updateFieldsLead = async (name, value) => {
    let newData = values.lead;
    newData[name] = value;
    if (values.lead_id) {
      const res = await editFieldsById(1, 'lead', newData);
      return res;
    } else {
      const res = await addApi('lead', newData);
      setFieldValue('lead_id', res.id);
      return res;
    }
  };

  useEffect(() => {
    updateProgress(0, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const onLoanTypeChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[1];
      updateFieldsLead(name, e.value);
      if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /^[A-Za-z]+$/;
      if (pattern.exec(value[value.length - 1])) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
        const name = e.currentTarget.name.split('.')[1];
        updateFieldsApplicant(name, value);
        if (
          requiredFieldsStatus[name] !== undefined &&
          !requiredFieldsStatus[name] &&
          value.length > 1
        ) {
          setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
        }
      }
    },
    [requiredFieldsStatus],
  );

  const handleLoanPurposeChange = useCallback(
    (value) => {
      setFieldValue('lead.purpose_of_loan', value);
      updateFieldsLead('purpose_of_loan', value);
      if (
        requiredFieldsStatus['purpose_of_loan'] !== undefined &&
        !requiredFieldsStatus['purpose_of_loan']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['purpose_of_loan']: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handlePropertyType = useCallback(
    (value) => {
      setFieldValue('lead.property_type', value);
      updateFieldsLead('property_type', value);
      if (
        requiredFieldsStatus['property_type'] !== undefined &&
        !requiredFieldsStatus['property_type']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['property_type']: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleOnPhoneNumberChange = useCallback(
    async (e) => {
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

      updateFieldsApplicant('mobile_number', phoneNumber);
      if (
        phoneNumber.length === 10 &&
        requiredFieldsStatus['mobile_number'] !== undefined &&
        !requiredFieldsStatus['mobile_number']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['mobile_number']: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleLoanAmountChange = useCallback(
    (e) => {
      setFieldValue('lead.applied_amount', e.currentTarget.value);
      updateFieldsLead('applied_amount', e.currentTarget.value);
      if (
        requiredFieldsStatus['applied_amount'] !== undefined &&
        !requiredFieldsStatus['applied_amount']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['applied_amount']: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const checkDate = () => {
    if (!date) {
      return;
    }
    if (!isEighteenOrAbove(date)) {
      setFieldError(
        'applicant_details.date_of_birth',
        'To apply for loan the minimum age must be 18 or 18+',
      );
      setFieldValue('applicant_details.date_of_birth', '');
      setFieldTouched('applicant_details.date_of_birth');
    } else {
      setFieldValue('applicant_details.date_of_birth', date);
      updateFieldsApplicant('date_of_birth', date);
    }
  };

  useEffect(() => {
    checkDate();
  }, [date, setFieldError, setFieldValue]);

  const datePickerScrollToTop = () => {
    if (dateInputRef.current) {
      dateInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sendMobileOtp = async () => {
    if (values.applicant_details.date_of_birth) {
      await updateFieldsApplicant().then(async () => {
        // setDisablePhoneNumber((prev) => !prev);
        setShowOTPInput(true);
        setHasSentOTPOnce(true);
        getMobileOtp(1);
        setToastMessage('OTP has been sent to your mail id');
        const bodyForExistingCustomer = JSON.stringify({
          resource: '/customer_check',
          path: '/customer_check',
          httpMethod: 'POST',
          auth: 'exi$t_Sys@85',
          'source flag': '1',
          body: {
            DOB: values.applicant_details.date_of_birth,
            'Mobile Number': values.applicant_details.mobile_number,
            Product: values.lead.loan_type,
          },
        });

        const responce = await checkExistingCustomer(bodyForExistingCustomer);

        const { body } = {
          ErrorCode: 200,
          body: [
            {
              // DOB: '',
              // 'Mobile Number': '9833563411',
              // Product: 'HL',
              is_existing_customer: 'TRUE',
              pre_approved_amount: '1000000',
              id_type: 'PAN',
              id_number: 'AAAPB2117A',
              selected_address_proof: 'AADHAR',
              address_proof_number: '654987321659',
              first_name: 'SANTOSH YADAV',
              middle_name: '',
              last_name: '',
              gender: 'MALE',
              father_husband_name: 'XYZ',
              mother_name: 'XYZ',
              current_flat_no_building_name: '12',
              current_street_area_locality: 'Thane',
              current_town: 'Delhi',
              current_landmark: 'ABC',
              current_pincode: '421202',
              current_city: 'Dombivli',
              current_state: 'Maharashtra',
              current_no_of_year_residing: '20',
              permanent_flat_no_building_name: '12',
              permanent_street_area_locality: 'Thane',
              permanent_town: 'Delhi',
              permanent_landmark: 'ABC',
              permanent_pincode: '421202',
              permanent_city: 'Dombivli',
              permanent_state: 'Maharashtra',
              permanent_no_of_year_residing: '20',
            },
          ],
        };

        console.log('Existing data', body[0]);
      });
    } else {
      setFieldError(
        'applicant_details.date_of_birth',
        'Date of Birth is Required. Minimum age must be 18 or 18+',
      );
      setFieldTouched('applicant_details.date_of_birth');
      dateInputRef.current.focus();
    }
  };

  const verifyOTP = useCallback((otp) => {
    verifyMobileOtp(1, otp)
      .then(async () => {
        await updateFieldsLead().then((res) => {
          setFieldValue('applicant_details.lead_id', res.id);
          updateFieldsApplicant('lead_id', res.id);
          setMobileVerified(true);
          setFieldValue('applicant_details.is_mobile_verified', true);
          updateFieldsApplicant('is_mobile_verified', true);
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

  console.log('values', values.applicant_details);
  // console.log('errors',errors.applicant_details);
  // console.log('touched',touched.applicant_details);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div
        className={`flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1`}
      >
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
                name='lead.loan_type'
                label={data.label}
                value={data.value}
                current={values.lead?.loan_type}
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
          name='lead.applied_amount'
          value={values.lead?.applied_amount}
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
          initialValue={values.lead?.applied_amount}
          min={100000}
          max={5000000}
          disabled={inputDisabled}
          step={50000}
        />

        {errors?.lead?.applied_amount && touched?.lead?.applied_amount ? (
          <span className='text-xs text-primary-red'>{errors?.lead?.applied_amount}</span>
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
              // onFocus={datePickerScrollToTop}
            />
          </div>
        </div>

        <DatePicker
          // value={values?.applicant_details?.date_of_birth}
          value={date}
          setDate={setDate}
          required
          name='applicant_details.date_of_birth'
          label='Date of Birth'
          error={errors?.applicant_details?.date_of_birth}
          touched={touched?.applicant_details?.date_of_birth}
          onBlur={(e) => {
            handleBlur(e);
            checkDate();
          }}
          reference={dateInputRef}
        />

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
              updateFieldsApplicant(name, values.applicant_details[name]);
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

        <DropDown
          label='Purpose of loan'
          name='lead.purpose_of_loan'
          required
          options={loanPurposeOptions}
          placeholder='Eg: Choose reference type'
          onChange={handleLoanPurposeChange}
          touched={touched?.lead?.purpose_of_loan}
          error={errors?.lead?.purpose_of_loan}
          onBlur={handleBlur}
          defaultSelected={values.lead?.purpose_of_loan}
          inputClasses='mt-2'
        />

        <DropDown
          label='Property Type'
          name='lead.property_type'
          required
          placeholder='Eg: Residential'
          options={
            loanFields[values.lead?.purpose_of_loan] || [
              {
                label: 'Residential House',
                value: 'Residential House',
              },
            ]
          }
          onChange={handlePropertyType}
          defaultSelected={values.lead?.property_type}
          touched={touched?.lead?.property_type}
          error={errors?.lead?.property_type}
          onBlur={handleBlur}
        />
      </div>
      <div className='bottom-0 fixed'>
        <PreviousNextButtons
          disablePrevious={true}
          disableNext={!mobileVerified || errors.applicant_details || errors.lead}
          linkNext='/lead/personal-details'
        />
      </div>
    </div>
  );
};

export default ApplicantDetails;
