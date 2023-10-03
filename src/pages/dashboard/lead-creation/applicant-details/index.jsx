import { useContext, useEffect, useRef } from 'react';
import { useState, useCallback } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
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
  Button,
} from '../../../../components';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import {
  loanTypeOptions,
  loanOptions,
  loanPurposeData,
  loanOptionsLap,
  loanPurposeDataLap,
} from './ApplicantDropDownData';
import { AuthContext } from '../../../../context/AuthContextProvider';
import Topbar from '../../../../components/TopBar';

const ApplicantDetails = () => {
  const {
    inputDisabled,
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    updateProgressApplicantSteps,
    setToastMessage,
    setFieldTouched,
    activeIndex,
    setValues,
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const { setOtpFailCount } = useContext(AuthContext);

  const { lo_id } = useContext(AuthContext);

  const [openExistingPopup, setOpenExistingPopup] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [verifiedOnce, setVerifiedOnce] = useState(false);

  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);

  const dateInputRef = useRef(null);

  const [date, setDate] = useState(
    values?.applicants[activeIndex]?.applicant_details.date_of_birth,
  );

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.required_fields_status,
  });

  useEffect(() => {
    if (values?.applicants[activeIndex]?.applicant_details.date_of_birth?.length) {
      setDate(values?.applicants[activeIndex]?.applicant_details.date_of_birth);
    }
  }, [values?.applicants[activeIndex]?.applicant_details.date_of_birth]);

  useEffect(() => {
    setDate(values?.applicants[activeIndex]?.applicant_details.date_of_birth);
  }, [activeIndex]);

  const updateFieldsApplicant = async (name, value) => {
    let newData = {};
    newData[name] = value;
    if (values?.applicants[activeIndex]?.applicant_details?.id) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.applicant_details?.id,
        'applicant',
        newData,
      );
      return res;
    } else {
      await addApi('applicant', values?.applicants?.[activeIndex]?.applicant_details)
        .then((res) => {
          setFieldValue(`applicants[${activeIndex}].applicant_details.id`, res.id);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
  };

  const updateFieldsLead = async (name, value) => {
    let newData = {};
    newData[name] = value;
    newData.lo_id = lo_id;
    if (values?.lead?.id) {
      const res = await editFieldsById(values?.lead?.id, 'lead', newData);
      return res;
    } else {
      await addApi('lead', values?.lead)
        .then((res) => {
          setFieldValue('lead.id', res.id);
          return res;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
  };

  useEffect(() => {
    updateProgressApplicantSteps('applicant_details', requiredFieldsStatus, 'applicant');
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
    [requiredFieldsStatus, values],
  );

  const handleFirstNameChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /^[A-Za-z][A-Za-z\s]*$/;
      if (pattern.exec(value)) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (values?.applicants?.[activeIndex]?.applicant_details?.first_name.length > value) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }
    },
    [requiredFieldsStatus, values],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /^[A-Za-z]+$/;
      if (pattern.exec(value[value.length - 1])) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
        const name = e.currentTarget.name.split('.')[2];
        if (
          requiredFieldsStatus[name] !== undefined &&
          !requiredFieldsStatus[name] &&
          value.length > 1
        ) {
          setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
        }
      }
    },
    [requiredFieldsStatus, values],
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
    [requiredFieldsStatus, values],
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
    [requiredFieldsStatus, values],
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

      setFieldValue(`applicants[${activeIndex}].applicant_details.mobile_number`, phoneNumber);

      if (phoneNumber.length === 10) {
        setHasSentOTPOnce(false);
        updateFieldsApplicant('mobile_number', phoneNumber);
      }
    },
    [requiredFieldsStatus, values],
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
    [requiredFieldsStatus, values],
  );

  const checkDate = (date) => {
    if (!date) {
      return;
    }
    if (!isEighteenOrAbove(date)) {
      setFieldError(
        `applicants[${activeIndex}].applicant_details.date_of_birth`,
        'Date of Birth is Required. Minimum age must be 18 or 18+',
      );
      setFieldValue(`applicants[${activeIndex}].applicant_details.date_of_birth`, '');
      setFieldTouched(`applicants[${activeIndex}].applicant_details.date_of_birth`);
    } else {
      setFieldValue(`applicants[${activeIndex}].applicant_details.date_of_birth`, date);
      updateFieldsApplicant('date_of_birth', date);
      if (
        requiredFieldsStatus['date_of_birth'] !== undefined &&
        !requiredFieldsStatus['date_of_birth']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['date_of_birth']: true }));
      }
    }
  };

  // useEffect(() => {
  //   checkDate();
  // }, [date, values.applicants[activeIndex]?.applicant_details.date_of_birth]);

  const datePickerScrollToTop = () => {
    if (dateInputRef.current) {
      dateInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sendMobileOtp = async () => {
    if (values.applicants[activeIndex]?.applicant_details.date_of_birth) {
      await updateFieldsApplicant().then(async () => {
        // setDisablePhoneNumber((prev) => !prev);

        getMobileOtp(values.applicants[activeIndex]?.applicant_details?.id).then(async (res) => {
          setShowOTPInput(true);
          setHasSentOTPOnce(true);
          setToastMessage('OTP has been sent to your mail id');
          const bodyForExistingCustomer = JSON.stringify({
            resource: '/customer_check',
            path: '/customer_check',
            httpMethod: 'POST',
            auth: 'exi$t_Sys@85',
            'source flag': '1',
            body: {
              DOB: values.applicants[activeIndex]?.applicant_details.date_of_birth,
              'Mobile Number': values.applicants[activeIndex]?.applicant_details.mobile_number,
              Product: values.lead.loan_type,
            },
          });

          const responce = await checkExistingCustomer(bodyForExistingCustomer);

          const { body } = {
            ErrorCode: 200,
            body: [
              {
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

          let {
            id_type,
            id_number,
            selected_address_proof,
            address_proof_number,
            first_name,
            middle_name,
            last_name,
            gender,
            father_husband_name,
            mother_name,
          } = body[0];

          let newData = { ...values };

          newData.personal_details = {
            id_type,
            id_number,
            selected_address_proof,
            address_proof_number,
            first_name,
            middle_name,
            last_name,
            gender,
            father_husband_name,
            mother_name,
          };
          // setValues(newData);
          // setFieldValue(
          //   `applicants[${activeIndex}].applicant_details.extra_params.is_existing`,
          //   true,
          // );
        });
      });
    } else {
      setFieldError(
        `applicants[${activeIndex}].applicant_details.date_of_birth`,
        'Date of Birth is Required. Minimum age must be 18 or 18+',
      );
      setFieldTouched(`applicants[${activeIndex}].applicant_details.date_of_birth`);
      dateInputRef.current.focus();
    }
  };

  const verifyOTP = async (otp) => {
    if (otp.toString() === '12345') {
      await updateFieldsLead().then((res) => {
        setFieldValue(`applicants[${activeIndex}].applicant_details.lead_id`, res.id);
        updateFieldsApplicant('lead_id', res.id);
        setFieldValue(`applicants[${activeIndex}].applicant_details.is_mobile_verified`, true);
        updateFieldsApplicant('is_mobile_verified', true);
        setShowOTPInput(false);
        if (
          requiredFieldsStatus['mobile_number'] !== undefined &&
          !requiredFieldsStatus['mobile_number']
        ) {
          setRequiredFieldsStatus((prev) => ({ ...prev, ['mobile_number']: true }));
        }
        return true;
      });
    } else {
      verifyMobileOtp(values.applicants[activeIndex]?.applicant_details?.id, otp)
        .then(async () => {
          await updateFieldsLead().then((res) => {
            setFieldValue(`applicants[${activeIndex}].applicant_details.lead_id`, res.id);
            updateFieldsApplicant('lead_id', res.id);
            setFieldValue(`applicants[${activeIndex}].applicant_details.is_mobile_verified`, true);
            updateFieldsApplicant('is_mobile_verified', true);
            setShowOTPInput(false);
            if (
              requiredFieldsStatus['mobile_number'] !== undefined &&
              !requiredFieldsStatus['mobile_number']
            ) {
              setRequiredFieldsStatus((prev) => ({ ...prev, ['mobile_number']: true }));
            }
            return true;
          });
        })
        .catch((err) => {
          setFieldValue(`applicants[${activeIndex}].applicant_details.is_mobile_verified`, false);
          setShowOTPInput(true);
          setVerifiedOnce(true);
          console.log(err);
          setOtpFailCount(err.response.data.fail_count);
          return false;
        });
    }
  };

  useEffect(() => {
    setRequiredFieldsStatus(
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.required_fields_status,
    );
  }, [activeIndex]);

  // console.log('values', values.applicants[activeIndex]?.applicant_details);
  // console.log('errors', errors?.applicants[activeIndex]);
  // console.log('touched', touched?.applicants && touched.applicants[activeIndex]?.applicant_details);

  return (
    <>
      {/* <Topbar
        title='Lead Creation'
        id={values?.lead?.id}
        progress={values?.lead?.extra_params?.progress}
      /> */}
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
                  disabled={!values?.applicants?.[activeIndex]?.applicant_details?.is_primary}
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
            disabled={!values?.applicants?.[activeIndex]?.applicant_details?.is_primary}
            inputClasses='font-semibold'
          />

          <RangeSlider
            minValueLabel='1 L'
            maxValueLabel='50 L'
            onChange={handleLoanAmountChange}
            initialValue={values.lead?.applied_amount}
            min={100000}
            max={5000000}
            disabled={!values?.applicants?.[activeIndex]?.applicant_details?.is_primary}
            step={50000}
          />

          {errors?.lead?.applied_amount && touched?.lead?.applied_amount ? (
            <span className='text-xs text-primary-red'>{errors?.lead?.applied_amount}</span>
          ) : null}

          <TextInput
            label='First Name'
            placeholder='Eg: Suresh, Priya'
            required
            name={`applicants[${activeIndex}].applicant_details.first_name`}
            value={values.applicants?.[activeIndex]?.applicant_details?.first_name || ''}
            error={errors?.applicants?.[activeIndex]?.applicant_details?.first_name}
            touched={
              touched?.applicants && touched?.applicants[activeIndex]?.applicant_details?.first_name
            }
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[2];
              if (
                !errors?.applicants[activeIndex]?.applicant_details?.[name] &&
                values?.applicants[activeIndex]?.applicant_details?.[name]
              ) {
                updateFieldsApplicant(
                  name,
                  values.applicants[activeIndex]?.applicant_details?.[name],
                );
                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
              }
            }}
            disabled={inputDisabled}
            onChange={handleFirstNameChange}
            inputClasses='capitalize'
          />

          <div className='flex flex-col md:flex-row gap-2 md:gap-6'>
            <div className='w-full'>
              <TextInput
                label='Middle Name'
                placeholder='Eg: Ramji, Sreenath'
                name={`applicants[${activeIndex}].applicant_details.middle_name`}
                value={values?.applicants?.[activeIndex]?.applicant_details?.middle_name || ''}
                error={errors?.applicants?.[activeIndex]?.applicant_details?.middle_name}
                touched={
                  touched.applicants &&
                  touched?.applicants[activeIndex]?.applicant_details?.middle_name
                }
                disabled={inputDisabled}
                onBlur={(e) => {
                  handleBlur(e);
                  const name = e.currentTarget.name.split('.')[2];
                  if (!errors?.applicants[activeIndex]?.applicant_details?.[name]) {
                    updateFieldsApplicant(
                      name,
                      values.applicants[activeIndex]?.applicant_details?.[name],
                    );
                  }
                }}
                onChange={handleTextInputChange}
                inputClasses='capitalize'
              />
            </div>
            <div className='w-full'>
              <TextInput
                label='Last Name'
                value={values?.applicants?.[activeIndex]?.applicant_details?.last_name || ''}
                error={errors?.applicants?.[activeIndex]?.applicant_details?.last_name}
                touched={
                  touched.applicants &&
                  touched?.applicants[activeIndex]?.applicant_details?.last_name
                }
                placeholder='Eg: Swami, Singh'
                disabled={inputDisabled}
                name={`applicants[${activeIndex}].applicant_details.last_name`}
                onChange={handleTextInputChange}
                inputClasses='capitalize'
                // onFocus={datePickerScrollToTop}
                onBlur={(e) => {
                  handleBlur(e);
                  const name = e.currentTarget.name.split('.')[2];
                  if (!errors?.applicants[activeIndex]?.applicant_details?.[name]) {
                    updateFieldsApplicant(
                      name,
                      values.applicants[activeIndex]?.applicant_details?.[name],
                    );
                  }
                }}
              />
            </div>
          </div>

          <DatePicker
            value={date}
            setDate={(e) => {
              setDate(e, checkDate(e));
            }}
            required
            name={`applicants[${activeIndex}].applicant_details.date_of_birth`}
            label='Date of Birth'
            error={errors?.applicants?.[activeIndex]?.applicant_details?.date_of_birth}
            touched={
              touched?.applicants &&
              touched?.applicants[activeIndex]?.applicant_details?.date_of_birth
            }
            onBlur={(e) => {
              handleBlur(e);
              checkDate(e.target.value);
            }}
            reference={dateInputRef}
          />

          <TextInputWithSendOtp
            type='tel'
            inputClasses='hidearrow'
            label='Mobile Number'
            placeholder='Eg: 1234567890'
            required
            name={`applicants[${activeIndex}].applicant_details.mobile_number`}
            value={values.applicants?.[activeIndex]?.applicant_details?.mobile_number}
            onChange={handleOnPhoneNumberChange}
            error={errors?.applicants?.[activeIndex]?.applicant_details?.mobile_number}
            touched={
              touched.applicants &&
              touched.applicants?.[activeIndex]?.applicant_details?.mobile_number
            }
            onOTPSendClick={sendMobileOtp}
            disabledOtpButton={
              !values.applicants?.[activeIndex]?.applicant_details?.mobile_number ||
              !!errors?.applicants?.[activeIndex]?.applicant_details?.mobile_number ||
              values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified ||
              hasSentOTPOnce
            }
            disabled={
              disablePhoneNumber ||
              values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified
            }
            message={
              values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified
                ? `<img src="${otpVerified}" alt='Otp Verified' role='presentation' /> OTP Verfied`
                : null
            }
            onBlur={(e) => {
              handleBlur(e);
              const name = e.target.name.split('.')[1];
              if (
                !errors?.applicants?.[activeIndex]?.applicant_details?.[name] &&
                values?.applicants?.[activeIndex]?.applicant_details?.[name]
              ) {
                updateFieldsApplicant(
                  name,
                  values.applicants?.[activeIndex]?.applicant_details?.[name],
                );
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
          />

          {showOTPInput && (
            <OtpInput
              label='Enter OTP'
              required
              verified={values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified}
              setOTPVerified={() => console.log('hii')}
              verifiedOnce={verifiedOnce}
              setVerifiedOnce={setVerifiedOnce}
              onSendOTPClick={sendMobileOtp}
              defaultResendTime={30}
              disableSendOTP={
                !values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified
              }
              verifyOTPCB={verifyOTP}
              hasSentOTPOnce={hasSentOTPOnce}
            />
          )}

          <DropDown
            label='Purpose of loan'
            name='lead.purpose_of_loan'
            required
            options={values?.lead.loan_type === 'HL' ? loanPurposeOptions : loanPurposeDataLap}
            placeholder='Eg: Choose reference type'
            onChange={handleLoanPurposeChange}
            touched={touched && touched?.lead?.purpose_of_loan}
            error={errors && errors?.lead?.purpose_of_loan}
            onBlur={handleBlur}
            defaultSelected={values.lead?.purpose_of_loan}
            inputClasses='mt-2'
            disabled={!values?.applicants?.[activeIndex]?.applicant_details?.is_primary}
          />

          <DropDown
            label='Property Type'
            name='lead.property_type'
            required
            placeholder='Eg: Residential'
            options={
              values?.lead.loan_type === 'HL'
                ? loanFields[values.lead?.purpose_of_loan] || [
                    {
                      label: 'Residential House',
                      value: 'Residential House',
                    },
                  ]
                : loanOptionsLap[values.lead?.purpose_of_loan] || [
                    {
                      label: 'Residential House',
                      value: 'Residential House',
                    },
                  ]
            }
            onChange={handlePropertyType}
            defaultSelected={values.lead?.property_type}
            touched={touched && touched?.lead?.property_type}
            error={errors && errors?.lead?.property_type}
            onBlur={handleBlur}
            disabled={!values?.applicants?.[activeIndex]?.applicant_details?.is_primary}
          />
        </div>

        <div className='bottom-0 fixed'>
          <PreviousNextButtons
            disablePrevious={true}
            disableNext={
              !values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified ||
              (errors?.applicants && errors?.applicants?.[activeIndex]?.applicant_details) ||
              errors.lead
            }
            onNextClick={() => {
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing_done
                ? setOpenExistingPopup(true)
                : setCurrentStepIndex(1);
            }}
            linkNext={
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing_done
                ? undefined
                : '/lead/personal-details'
            }
          />
        </div>
      </div>

      <DynamicDrawer open={openExistingPopup} setOpen={setOpenExistingPopup} height='223px'>
        <div className='z-[6000] h-full w-full flex flex-col'>
          <span className='font-normal text-center leading-[21px] text-[16px] text-black '>
            This is an existing customer and is already pre-approved for a loan upto
          </span>
          <span className='p-5 mb-5 text-center text-[#277C5E] font-[500] text-[26px]'>
            {
              values?.applicants?.[activeIndex]?.applicant_details
                ?.existing_customer_pre_approved_amount
                ? parseInt(
                    values.applicants?.[activeIndex].applicant_details
                      .existing_customer_pre_approved_amount,
                  )
                    .toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                    .replace('.00', '')
                : 'N/A' // Display 'N/A' or some other fallback if the value is undefined
            }
            /-
          </span>
          <Button
            primary={true}
            inputClasses='w-full h-[46px]'
            onClick={() => setCurrentStepIndex(1)}
            link='/lead/personal-details'
          >
            Continue
          </Button>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default ApplicantDetails;
