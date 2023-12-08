import { useContext, useEffect, useRef } from 'react';
import { useState, useCallback } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
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
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';
import DatePicker2 from '../../../../components/DatePicker/DatePicker2';
import moment from 'moment';

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
    setCurrentStepIndex,
    removeCoApplicant,
  } = useContext(LeadContext);

  const { setOtpFailCount, phoneNumberList, setPhoneNumberList } = useContext(AuthContext);

  const { loData } = useContext(AuthContext);

  const { token } = useContext(AuthContext);

  const [openExistingPopup, setOpenExistingPopup] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [verifiedOnce, setVerifiedOnce] = useState(false);

  const [loanFields, setLoanFields] = useState(loanOptions);
  const [loanPurposeOptions, setLoanPurposeOptions] = useState(loanPurposeData);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.required_fields_status,
  });

  const [date, setDate] = useState(null);

  const datePickerInputRef = useRef();

  useEffect(() => {
    if (values?.applicants[activeIndex]?.applicant_details?.date_of_birth?.length) {
      var dateParts = values?.applicants[activeIndex]?.applicant_details?.date_of_birth.split('-');
      var day = parseInt(dateParts[2], 10);
      var month = parseInt(dateParts[1], 10);
      var year = parseInt(dateParts[0], 10);
      setDate(`${day}/${month}/${year}`);
    }
  }, [values?.applicants[activeIndex]?.applicant_details.date_of_birth]);

  useEffect(() => {
    if (values?.applicants[activeIndex]?.applicant_details?.date_of_birth?.length) {
      var dateParts = values?.applicants[activeIndex]?.applicant_details?.date_of_birth.split('-');
      var day = parseInt(dateParts[2], 10);
      var month = parseInt(dateParts[1], 10);
      var year = parseInt(dateParts[0], 10);
      setDate(`${day}/${month}/${year}`);
    } else {
      setDate(null);
    }
  }, [activeIndex]);

  const updateFieldsApplicant = async (name, value) => {
    let newData = {};
    newData[name] = value;
    if (values?.applicants[activeIndex]?.applicant_details?.id) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.applicant_details?.id,
        'applicant',
        newData,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return res;
    } else {
      await addApi('applicant', values?.applicants?.[activeIndex]?.applicant_details, {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          setFieldValue(`applicants[${activeIndex}].applicant_details.id`, res.id);
          return res;
        })
        .catch((err) => {
          return err;
        });
    }
  };

  const updateFieldsLead = async (name, value) => {
    if (values?.lead?.id) {
      let newData = {};
      newData[name] = value;
      newData.lo_id = loData.session.user_id;
      const res = await editFieldsById(values?.lead?.id, 'lead', newData, {
        headers: {
          Authorization: token,
        },
      });
      return res;
    } else {
      let newData = { ...values?.lead };
      newData[name] = value;
      newData.lo_id = loData.session.user_id;
      await addApi('lead', newData, {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          setFieldValue('lead.id', res.id);
          return res;
        })
        .catch((err) => {
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

      if (values.lead?.purpose_of_loan) {
        setFieldValue('lead.purpose_of_loan', '');
        updateFieldsLead('purpose_of_loan', '');
      }

      if (values?.lead.loan_type) {
        setFieldValue('lead.property_type', '');
        updateFieldsLead('property_type', '');
      }

      if (requiredFieldsStatus[name] !== undefined) {
        setRequiredFieldsStatus((prev) => ({
          ...prev,
          [name]: true,
          purpose_of_loan: false,
          property_type: false,
        }));
      }
    },
    [requiredFieldsStatus, values],
  );

  const handleFirstNameChange = useCallback(
    (e) => {
      let value = e.currentTarget.value;
      value = value.trimStart().replace(/\s\s+/g, ' ');
      const pattern = /^[A-Za-z][A-Za-z\s]*$/;
      if (pattern.exec(value)) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (values?.applicants?.[activeIndex]?.applicant_details?.first_name.length > value) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }
    },
    [activeIndex, setFieldValue, values?.applicants],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /[^a-zA-Z]+/;
      if (pattern.test(value)) return;
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      const name = e.currentTarget.name.split('.')[2];
      if (
        requiredFieldsStatus[name] !== undefined &&
        !requiredFieldsStatus[name] &&
        value.length > 1
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
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

      const pattern = /[^\d]/g;
      if (pattern.test(phoneNumber)) {
        e.preventDefault();
        return;
      }

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
        if (values?.applicants[activeIndex]?.applicant_details?.id) {
          await editFieldsById(
            values?.applicants[activeIndex]?.applicant_details?.id,
            'applicant',
            {
              otp: null,
              otp_send_on: null,
              otp_fail_count: 0,
              otp_fail_release: null,
            },
            {
              headers: {
                Authorization: token,
              },
            },
          );
        }
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

  const checkDate = async (date) => {
    if (!date) {
      return;
    }

    const finalDate = date;

    if (date === 'Invalid date' || !isEighteenOrAbove(finalDate)) {
      setFieldError(
        `applicants[${activeIndex}].applicant_details.date_of_birth`,
        'Date of Birth is Required. Minimum age must be 18 or 18+',
      );
      setFieldValue(`applicants[${activeIndex}].applicant_details.date_of_birth`, '');
      setFieldTouched(`applicants[${activeIndex}].applicant_details.date_of_birth`);
    } else {
      setFieldValue(`applicants[${activeIndex}].applicant_details.date_of_birth`, finalDate);
      updateFieldsApplicant('date_of_birth', finalDate);
      if (
        requiredFieldsStatus['date_of_birth'] !== undefined &&
        !requiredFieldsStatus['date_of_birth']
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['date_of_birth']: true }));
      }
      if (values?.applicants?.[activeIndex]?.personal_details?.id) {
        await editFieldsById(
          values?.applicants[activeIndex]?.personal_details?.id,
          'personal',
          {
            date_of_birth: finalDate,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }
    }
  };

  const sendMobileOtp = async () => {
    if (values.applicants[activeIndex]?.applicant_details.date_of_birth) {
      await updateFieldsApplicant().then(async () => {
        // setDisablePhoneNumber((prev) => !prev);

        getMobileOtp(values.applicants[activeIndex]?.applicant_details?.id, {
          headers: {
            Authorization: token,
          },
        }).then(async (res) => {
          setShowOTPInput(true);
          setHasSentOTPOnce(true);
          setToastMessage('OTP has been sent to your mail id');

          const bodyForExistingCustomer = {
            resource: '/customer_check',
            path: '/customer_check',
            httpMethod: 'POST',
            auth: 'exi$t_Sys@85',
            'source flag': '1',
            body: {
              loan_type: values.lead.loan_type,
              date_of_birth: values?.applicants?.[activeIndex]?.applicant_details?.date_of_birth,
              mobile_number: values?.applicants?.[activeIndex]?.applicant_details?.mobile_number,
            },
          };

          await checkExistingCustomer(bodyForExistingCustomer)
            .then((body) => {
              if (body && body?.length !== 0) {
                const { existing_customer_is_existing_customer } = body[0];
                if (
                  existing_customer_is_existing_customer &&
                  existing_customer_is_existing_customer?.toLowercase() === 'false'
                ) {
                  editFieldsById(
                    values?.applicants[activeIndex]?.applicant_details?.id,
                    'applicant',
                    {
                      extra_params: {
                        ...values?.applicants[activeIndex]?.applicant_details?.extra_params,
                        is_existing: false,
                      },
                    },
                  );
                  setFieldValue(
                    `applicants[${activeIndex}].applicant_details.extra_params.is_existing`,
                    false,
                  );
                  return;
                }

                const { loan_type, ...dataWithoutLoanType } = body[0];
                setFieldValue(`applicants[${activeIndex}].applicant_details`, {
                  ...values?.applicants[activeIndex]?.applicant_details,
                  ...dataWithoutLoanType,
                });
                editFieldsById(
                  values?.applicants[activeIndex]?.applicant_details?.id,
                  'applicant',
                  {
                    ...values?.applicants[activeIndex]?.applicant_details,
                    ...dataWithoutLoanType,
                    extra_params: {
                      ...values?.applicants[activeIndex]?.applicant_details?.extra_params,
                      is_existing: true,
                    },
                  },
                  {
                    headers: {
                      Authorization: token,
                    },
                  },
                );
                setFieldValue(
                  `applicants[${activeIndex}].applicant_details.extra_params.is_existing`,
                  true,
                );
              } else {
                editFieldsById(
                  values?.applicants[activeIndex]?.applicant_details?.id,
                  'applicant',
                  {
                    extra_params: {
                      ...values?.applicants[activeIndex]?.applicant_details?.extra_params,
                      is_existing: false,
                    },
                  },
                );
                setFieldValue(
                  `applicants[${activeIndex}].applicant_details.extra_params.is_existing`,
                  false,
                );
              }
            })
            .catch((err) => {
              console.log(err);
              editFieldsById(values?.applicants[activeIndex]?.applicant_details?.id, 'applicant', {
                extra_params: {
                  ...values?.applicants[activeIndex]?.applicant_details?.extra_params,
                  is_existing: false,
                },
              });
              setFieldValue(
                `applicants[${activeIndex}].applicant_details.extra_params.is_existing`,
                false,
              );
            });
        });
      });
    } else {
      setFieldError(
        `applicants[${activeIndex}].applicant_details.date_of_birth`,
        'Date of Birth is Required. Minimum age must be 18 or 18+',
      );
      setFieldTouched(`applicants[${activeIndex}].applicant_details.date_of_birth`);
      datePickerInputRef.current.focus();
    }
  };

  const verifyOTP = async (otp) => {
    verifyMobileOtp(values.applicants[activeIndex]?.applicant_details?.id, otp, {
      headers: {
        Authorization: token,
      },
    })
      .then(async (res) => {
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
        setOtpFailCount(err.response.data.fail_count);
        return false;
      });
  };

  useEffect(() => {
    setRequiredFieldsStatus(
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.required_fields_status,
    );
  }, [activeIndex]);

  // For unique phone numbers
  useEffect(() => {
    const _phoneNumberList = Object.assign({}, phoneNumberList);
    if (_phoneNumberList?.[`applicant_${activeIndex}`]) {
      delete _phoneNumberList?.[[`applicant_${activeIndex}`]];
    }

    if (
      values?.applicants?.[activeIndex]?.applicant_details?.mobile_number &&
      _phoneNumberList &&
      Object.values(_phoneNumberList)?.includes(
        values?.applicants?.[activeIndex]?.applicant_details?.mobile_number,
      )
    ) {
      setFieldError(
        `applicants[${activeIndex}].applicant_details.mobile_number`,
        'Phone number must be unique',
      );
    } else {
      setPhoneNumberList((prev) => {
        return {
          ...prev,
          [`applicant_${activeIndex}`]:
            values?.applicants?.[activeIndex]?.applicant_details?.mobile_number,
        };
      });
    }
  }, [
    values?.applicants?.[activeIndex]?.applicant_details,
    errors?.applicants?.[activeIndex]?.applicant_details,
  ]);

  const handleBack = () => {
    if (!values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified) {
      removeCoApplicant(activeIndex);
    }
  };

  const onDatePickerBlur = (e) => {
    let date = moment(e.target.value).format('YYYY-DD-MM');
    checkDate(date);
    //   handleBlur(e);
  };

  useEffect(() => {
    datePickerInputRef.current.addEventListener('blur', onDatePickerBlur);
    datePickerInputRef.current.name = `applicants[${activeIndex}].applicant_details.date_of_birth`;
  }, [datePickerInputRef, datePickerInputRef.current]);

  // useEffect(() => {
  //   if (values?.applicants?.[activeIndex]?.applicant_details?.date_of_birth === '') {
  //     setFieldTouched(`applicants[${activeIndex}].applicant_details.date_of_birth`);
  //   }
  // }, [values?.applicants?.[activeIndex]?.applicant_details?.date_of_birth]);

  // console.log('errors', errors?.applicants[activeIndex]);
  // console.log('touched', touched?.applicants && touched.applicants[activeIndex]?.applicant_details);

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh] justify-between'>
        {values?.applicants[activeIndex]?.applicant_details?.is_primary ? (
          <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
        ) : (
          <Topbar
            title='Adding Co-applicant'
            id={values?.lead?.id}
            showClose={false}
            showBack={true}
            coApplicant={true}
            handleBack={handleBack}
            coApplicantName={values?.applicants[activeIndex]?.applicant_details?.first_name}
          />
        )}
        <div
          className={`flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[150px] flex-1`}
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
                  disabled={
                    !values?.applicants?.[activeIndex]?.applicant_details?.is_primary ||
                    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                  }
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
            disabled={
              !values?.applicants?.[activeIndex]?.applicant_details?.is_primary ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
            inputClasses='font-semibold'
          />

          <RangeSlider
            minValueLabel='1 L'
            maxValueLabel='50 L'
            onChange={handleLoanAmountChange}
            initialValue={values.lead?.applied_amount}
            min={100000}
            max={5000000}
            disabled={
              !values?.applicants?.[activeIndex]?.applicant_details?.is_primary ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
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
            onBlur={async (e) => {
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

                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      first_name: values?.applicants?.[activeIndex]?.applicant_details?.first_name,
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
                updateFieldsApplicant(name, '');

                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      first_name: '',
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              }
            }}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
            onChange={handleFirstNameChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Middle Name'
            placeholder='Eg: Ramji, Sreenath'
            name={`applicants[${activeIndex}].applicant_details.middle_name`}
            value={values?.applicants?.[activeIndex]?.applicant_details?.middle_name || ''}
            error={errors?.applicants?.[activeIndex]?.applicant_details?.middle_name}
            touched={
              touched.applicants && touched?.applicants[activeIndex]?.applicant_details?.middle_name
            }
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
            onBlur={async (e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[2];
              if (!errors?.applicants[activeIndex]?.applicant_details?.[name]) {
                updateFieldsApplicant(
                  name,
                  values.applicants[activeIndex]?.applicant_details?.[name],
                );

                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      middle_name:
                        values?.applicants?.[activeIndex]?.applicant_details?.middle_name,
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              } else {
                updateFieldsApplicant(name, '');
                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      middle_name: '',
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              }
            }}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Last Name'
            value={values?.applicants?.[activeIndex]?.applicant_details?.last_name || ''}
            error={errors?.applicants?.[activeIndex]?.applicant_details?.last_name}
            touched={
              touched.applicants && touched?.applicants[activeIndex]?.applicant_details?.last_name
            }
            placeholder='Eg: Swami, Singh'
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
            name={`applicants[${activeIndex}].applicant_details.last_name`}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
            // onFocus={datePickerScrollToTop}
            onBlur={async (e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[2];
              if (!errors?.applicants[activeIndex]?.applicant_details?.[name]) {
                updateFieldsApplicant(
                  name,
                  values.applicants[activeIndex]?.applicant_details?.[name],
                );

                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      last_name: values?.applicants?.[activeIndex]?.applicant_details?.last_name,
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              } else {
                updateFieldsApplicant(name, '');
                if (values?.applicants?.[activeIndex]?.personal_details?.id) {
                  const res = await editFieldsById(
                    values?.applicants[activeIndex]?.personal_details?.id,
                    'personal',
                    {
                      last_name: '',
                    },
                    {
                      headers: {
                        Authorization: token,
                      },
                    },
                  );
                }
              }
            }}
          />

          <DatePicker2
            label='Date of Birth'
            name={`applicants[${activeIndex}].applicant_details.date_of_birth`}
            error={errors?.applicants?.[activeIndex]?.applicant_details?.date_of_birth}
            touched={
              touched?.applicants &&
              touched?.applicants[activeIndex]?.applicant_details?.date_of_birth
            }
            disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
            value={date}
            onAccept={(e) => {
              checkDate(e);
            }}
            inputRef={datePickerInputRef}
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
              values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
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
                setPhoneNumberList((prev) => {
                  return {
                    ...prev,
                    [`applicant_${activeIndex}`]:
                      values.applicants?.[activeIndex]?.applicant_details?.[name],
                  };
                });
              } else {
                updateFieldsApplicant(name, '');
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
            options={
              values?.lead.loan_type === 'Home Loan' ? loanPurposeOptions : loanPurposeDataLap
            }
            placeholder='Choose purpose of loan'
            onChange={handleLoanPurposeChange}
            touched={touched && touched?.lead?.purpose_of_loan}
            error={errors && errors?.lead?.purpose_of_loan}
            onBlur={handleBlur}
            defaultSelected={values.lead?.purpose_of_loan}
            inputClasses='mt-2'
            disabled={
              !values?.applicants?.[activeIndex]?.applicant_details?.is_primary ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
          />

          <DropDown
            label='Property Type'
            name='lead.property_type'
            required
            placeholder='Choose property type'
            options={
              values?.lead.loan_type === 'Home Loan'
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
            disabled={
              !values?.applicants?.[activeIndex]?.applicant_details?.is_primary ||
              values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
            }
          />
        </div>
        <PreviousNextButtons
          disablePrevious={true}
          disableNext={
            !values?.applicants?.[activeIndex]?.applicant_details?.is_mobile_verified ||
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.progress !== 100
          }
          onNextClick={() => {
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
            !values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing_done
              ? setOpenExistingPopup(true)
              : setCurrentStepIndex(1);
          }}
          linkNext={
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
            !values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing_done
              ? undefined
              : '/lead/personal-details'
          }
        />

        <SwipeableDrawerComponent />
      </div>

      {openExistingPopup ? (
        <DynamicDrawer open={openExistingPopup} setOpen={setOpenExistingPopup} height='223px'>
          <div className='z-[6000] h-full w-full flex flex-col'>
            <span className='font-normal text-center leading-[21px] text-[16px] text-black '>
              This is an existing customer and is already pre-approved for a loan upto
            </span>
            {
              values?.applicants?.[activeIndex]?.applicant_details
                ?.existing_customer_pre_approved_amount ? (
                <span className='p-5 mb-5 text-center text-[#277C5E] font-[500] text-[26px]'>
                  {parseInt(
                    values.applicants?.[activeIndex].applicant_details
                      .existing_customer_pre_approved_amount,
                  )
                    .toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })
                    .replace('.00', '')}
                  /-
                </span>
              ) : (
                <span className='p-5 mb-5 text-center text-[#277C5E] font-[500] text-[26px]'>
                  N/A
                </span>
              ) // Display 'N/A' or some other fallback if the value is undefined
            }
            <Button
              primary={true}
              inputClasses='w-full h-[46px]'
              onClick={() => {
                setFieldValue(
                  `applicants[${activeIndex}].applicant_details.extra_params.is_existing_done`,
                  true,
                );
                editFieldsById(
                  values?.applicants[activeIndex]?.applicant_details?.id,
                  'applicant',
                  {
                    extra_params: {
                      ...values?.applicants[activeIndex]?.applicant_details?.extra_params,
                      is_existing_done: true,
                    },
                  },
                  {
                    headers: {
                      Authorization: token,
                    },
                  },
                );
                setOpenExistingPopup(false);
                setCurrentStepIndex(1);
              }}
              link='/lead/personal-details'
            >
              Continue
            </Button>
          </div>
        </DynamicDrawer>
      ) : null}
    </>
  );
};

export default ApplicantDetails;
