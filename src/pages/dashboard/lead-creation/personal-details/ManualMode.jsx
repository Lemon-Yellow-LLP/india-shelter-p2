import { personalDetailsGenderOption, personalMaritalStatusOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import DropDown from '../../../../components/DropDown';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import Checkbox from '../../../../components/Checkbox';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import { manualModeDropdownOptions } from './manualModeDropdownOptions';
import OtpInput from '../../../../components/OtpInput/index';
import otpVerified from '../../../../assets/icons/otp-verified.svg';
import { addApi, editFieldsById, getEmailOtp, verifyEmailOtp } from '../../../../global';
import { AuthContext } from '../../../../context/AuthContextProvider';
import { defaultValuesLead } from '../../../../context/defaultValuesLead';

function ManualMode({ requiredFieldsStatus, setRequiredFieldsStatus, updateFields }) {
  const {
    values,
    errors,
    updateProgressApplicantSteps,
    touched,
    handleBlur,
    setFieldValue,
    setToastMessage,
    activeIndex,
    setFieldError,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const [disableEmailInput, setDisableEmailInput] = useState(false);

  const [emailVerified, setEmailVerified] = useState(
    values?.applicants?.[activeIndex]?.personal_details?.is_email_verified,
  );

  const [showOTPInput, setShowOTPInput] = useState(false);

  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);

  const [date, setDate] = useState(null);

  useEffect(() => {
    if (values?.applicants[activeIndex]?.applicant_details?.date_of_birth?.length) {
      var dateParts = values?.applicants[activeIndex]?.applicant_details?.date_of_birth.split('-');
      var day = parseInt(dateParts[2], 10);
      var month = parseInt(dateParts[1], 10);
      var year = parseInt(dateParts[0], 10);
      setDate(`${day}/${month}/${year}`);
    }
  }, [activeIndex, values?.applicants[activeIndex]?.applicant_details.date_of_birth]);

  useEffect(() => {
    updateProgressApplicantSteps(1, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[2];
      updateFields(name, e.value);
      if (e.value === 'Married') {
        setFieldValue(`applicants[${activeIndex}].personal_details.spouse_name`, null);
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true, spouse_name: false }));
      } else if (e.value === 'Single') {
        let newRequiredFields = {};
        Object.keys(requiredFieldsStatus).reduce((newObject, key) => {
          if (key !== 'spouse_name') {
            newRequiredFields[key] = requiredFieldsStatus[key];
          }
        });
        setFieldValue(`applicants[${activeIndex}].personal_details.spouse_name`, null);
        setRequiredFieldsStatus({ ...newRequiredFields, [name]: true });
      } else {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeIdType = useCallback(
    (e) => {
      setFieldValue(`applicants[${activeIndex}].personal_details.id_type`, e);

      if (values?.applicants?.[activeIndex]?.work_income_detail?.pan_number && e === 'PAN') {
        setFieldValue(
          `applicants[${activeIndex}].personal_details.id_number`,
          values?.applicants?.[activeIndex]?.work_income_detail?.pan_number,
        );

        setRequiredFieldsStatus((prev) => {
          let newPrev = {
            ...prev,
            ['id_number']: true,
          };

          return newPrev;
        });
      } else {
        setFieldValue(`applicants[${activeIndex}].personal_details.id_number`, '');
        updateFields('id_number', '');
        setRequiredFieldsStatus((prev) => ({ ...prev, id_type: true, id_number: false }));
      }

      updateFields('id_type', e);

      if (values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type) {
        if (e === 'PAN') {
          setFieldValue(
            `applicants[${activeIndex}].personal_details.extra_params.same_as_id_type`,
            false,
          );
          setFieldValue(`applicants[${activeIndex}].personal_details.selected_address_proof`, '');
          setFieldValue(`applicants[${activeIndex}].personal_details.address_proof_number`, '');
          updateFields('selected_address_proof', '');
          updateFields('address_proof_number', '');
          setRequiredFieldsStatus((prev) => ({
            ...prev,
            selected_address_proof: false,
            address_proof_number: false,
          }));
        } else {
          setFieldValue(`applicants[${activeIndex}].personal_details.selected_address_proof`, e);
          setFieldValue(`applicants[${activeIndex}].personal_details.address_proof_number`, '');
          updateFields('selected_address_proof', e);
          updateFields('address_proof_number', '');
          setRequiredFieldsStatus((prev) => ({ ...prev, address_proof_number: false }));
        }
      }
    },
    [requiredFieldsStatus],
  );

  const changeSelectedAddressProof = useCallback(
    (e) => {
      setFieldValue(`applicants[${activeIndex}].personal_details.selected_address_proof`, e);
      setFieldValue(`applicants[${activeIndex}].personal_details.address_proof_number`, '');
      updateFields('selected_address_proof', e);
      updateFields('address_proof_number', '');
      setRequiredFieldsStatus((prev) => ({
        ...prev,
        selected_address_proof: true,
        address_proof_number: false,
      }));
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    async (e) => {
      if (e.target.value === ' ') {
        return;
      }
      let value = e.target.value;
      value = value.trimStart().replace(/\s\s+/g, ' ');
      const pattern = /^[A-Za-z]+$/;
      const pattern2 = /^[a-zA-Z\s]*$/;

      if (value?.trim() == '') {
        setFieldValue(e.target.name, value);
      }

      if (
        pattern2.test(value) &&
        (e.target.name == `applicants[${activeIndex}].personal_details.father_name` ||
          e.target.name == `applicants[${activeIndex}].personal_details.mother_name` ||
          e.target.name == `applicants[${activeIndex}].personal_details.spouse_name`)
      ) {
        setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (
        pattern.test(value) &&
        e.target.name !== `applicants[${activeIndex}].personal_details.email` &&
        e.target.name !== `applicants[${activeIndex}].personal_details.id_number` &&
        e.target.name !== `applicants[${activeIndex}].personal_details.address_proof_number`
      ) {
        setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (e.target.name === `applicants[${activeIndex}].personal_details.email`) {
        const value = e.currentTarget.value;
        const email_pattern = /^[a-zA-Z0-9\s,@\.\/]+$/;

        if (!email_pattern.test(value)) {
          return;
        }

        setFieldValue(e.target.name, value);
        setHasSentOTPOnce(false);
        setShowOTPInput(false);
      }

      if (
        e.target.name === `applicants[${activeIndex}].personal_details.id_number` &&
        values?.applicants?.[activeIndex]?.personal_details?.id_type === 'Passport'
      ) {
        if (value[0] === 'Q' || value[0] === 'X' || value[0] === 'Z') {
          return;
        }
      }

      if (
        e.target.name === `applicants[${activeIndex}].personal_details.address_proof_number` &&
        values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof === 'Passport'
      ) {
        if (value[0] === 'Q' || value[0] === 'X' || value[0] === 'Z') {
          return;
        }
      }

      if (
        e.target.name === `applicants[${activeIndex}].personal_details.id_number` ||
        e.target.name === `applicants[${activeIndex}].personal_details.address_proof_number`
      ) {
        if (
          e.target.name === `applicants[${activeIndex}].personal_details.id_number` &&
          values?.applicants?.[activeIndex]?.personal_details?.id_type === 'AADHAR'
        ) {
          if (e.target.selectionStart !== value.length) {
            e.target.selectionStart = e.target.selectionEnd = value.length;
            return;
          }
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (
            value.length < values?.applicants?.[activeIndex]?.personal_details?.id_number.length
          ) {
            setFieldValue(e.target.name, value);
          }
        } else if (
          e.target.name === `applicants[${activeIndex}].personal_details.address_proof_number` &&
          values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof === 'AADHAR'
        ) {
          if (e.target.selectionStart !== value.length) {
            e.target.selectionStart = e.target.selectionEnd = value.length;
            return;
          }
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (
            value.length <
            values?.applicants?.[activeIndex]?.personal_details?.address_proof_number.length
          ) {
            setFieldValue(e.target.name, value);
          }
        } else if (
          e.target.name === `applicants[${activeIndex}].personal_details.id_number` &&
          values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN'
        ) {
          setFieldValue(`applicants[${activeIndex}].work_income_detail.pan_number`, value);
          setFieldValue(`applicants[${activeIndex}].personal_details.id_number`, value);

          if (values?.applicants?.[activeIndex]?.work_income_detail?.id) {
            await editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                pan_number: value,
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
          } else {
            await addApi('work-income', defaultValuesLead?.applicants?.[0]?.work_income_detail, {
              headers: {
                Authorization: token,
              },
            })
              .then(async (res) => {
                setFieldValue(`applicants[${activeIndex}].work_income_detail`, {
                  ...res,
                });
                await editFieldsById(
                  values?.applicants?.[activeIndex]?.applicant_details?.id,
                  'applicant',
                  { work_income_detail: res.id },
                  {
                    headers: {
                      Authorization: token,
                    },
                  },
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          const pattern2 = /^[A-Za-z0-9]+$/;
          if (pattern2.test(value)) {
            setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }
      }
    },
    [requiredFieldsStatus, values],
  );

  const handleDropdownChange = useCallback(
    (name, value) => {
      setFieldValue(name, value);
      const fieldName = name.split('.')[2];
      updateFields(fieldName, value);
      if (requiredFieldsStatus[fieldName] !== undefined) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [fieldName]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  useEffect(() => {
    if (values?.applicants[activeIndex]?.personal_details?.id) {
      // console.log(errors?.applicants?.[activeIndex]);
      if (
        !errors?.applicants?.[activeIndex]?.personal_details?.id_type &&
        !errors?.applicants?.[activeIndex]?.personal_details?.id_number
      ) {
        updateFields();
      }
    }
  }, [values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type]);

  useEffect(() => {
    if (values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type) {
      let newData = structuredClone(values);

      newData.applicants[activeIndex].personal_details = {
        ...newData.applicants[activeIndex].personal_details,
        selected_address_proof: values?.applicants[activeIndex]?.personal_details?.id_type,
        address_proof_number: values?.applicants[activeIndex]?.personal_details?.id_number,
      };

      setFieldValue(
        `applicants[${activeIndex}].personal_details`,
        newData.applicants[activeIndex].personal_details,
      );
    }

    if (
      values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type &&
      values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN Card'
    ) {
      let newData = structuredClone(values);

      newData.applicants[activeIndex].personal_details = {
        ...newData.applicants[activeIndex].personal_details,
        selected_address_proof: '',
        address_proof_number: '',
      };

      newData.applicants[activeIndex].personal_details.extra_params.same_as_id_type = false;

      setFieldValue(
        `applicants[${activeIndex}].personal_details`,
        newData.applicants[activeIndex].personal_details,
      );
    }
  }, [
    values?.applicants?.[activeIndex]?.personal_details?.id_type,
    values?.applicants?.[activeIndex]?.personal_details?.id_number,
  ]);

  const sendEmailOTP = () => {
    // setDisableEmailInput((prev) => !prev);
    setShowOTPInput(true);
    setHasSentOTPOnce(true);

    getEmailOtp(values?.applicants?.[activeIndex]?.personal_details?.id, {
      headers: {
        Authorization: token,
      },
    });
    setToastMessage('OTP has been sent to your mail id');
  };

  const verifyOTP = (otp) => {
    verifyEmailOtp(values?.applicants?.[activeIndex]?.personal_details?.id, otp, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        setEmailVerified(true);
        setShowOTPInput(false);
        setFieldValue(`applicants[${activeIndex}].personal_details.is_email_verified`, true);
        updateFields('is_email_verified', true);
        return true;
      })
      .catch((err) => {
        setEmailVerified(false);
        setShowOTPInput(true);
        return false;
      });
  };

  const dobUpdate = useCallback(() => {
    if (date && date.length) {
      var dateParts = date?.split('/');
      var day = parseInt(dateParts[0], 10);
      var month = parseInt(dateParts[1], 10);
      var year = parseInt(dateParts[2], 10);

      const finalDate = `${year}-${month}-${day}`;

      setFieldValue(`applicants[${activeIndex}].personal_details.date_of_birth`, finalDate);
      if (values?.applicants[activeIndex]?.personal_details?.id) {
        updateFields('date_of_birth', finalDate);
      }
    }
  }, [date]);

  useEffect(() => {
    dobUpdate();
  }, [date]);

  const mobileNumberUpdate = useCallback(() => {
    setFieldValue(
      `applicants[${activeIndex}].personal_details.mobile_number`,
      values?.applicants?.[activeIndex]?.applicant_details?.mobile_number,
    );
    updateFields('mobile_number', values.applicant_details?.mobile_number);
  }, [values?.applicants?.[activeIndex]?.applicant_details?.mobile_number]);

  useEffect(() => {
    mobileNumberUpdate();
  }, [values?.applicants?.[activeIndex]?.applicant_details?.mobile_number]);

  return (
    <>
      <DropDown
        label='Select ID type'
        name={`applicants[${activeIndex}].personal_details.id_type`}
        required
        options={manualModeDropdownOptions[0].options}
        placeholder='Choose ID type'
        onChange={changeIdType}
        defaultSelected={values?.applicants?.[activeIndex]?.personal_details?.id_type}
        error={errors.applicants?.[activeIndex]?.personal_details?.id_type}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.id_type
        }
        disableOption={values?.applicants[activeIndex]?.personal_details?.selected_address_proof}
        onBlur={(e) => {
          handleBlur(e);
          if (values?.applicants[activeIndex]?.personal_details?.extra_params?.same_as_id_type) {
            updateFields(
              'selected_address_proof',
              values?.applicants[activeIndex]?.personal_details.id_type,
            );
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <TextInput
        label='Enter ID number'
        placeholder='Enter Id number'
        required
        name={`applicants[${activeIndex}].personal_details.id_number`}
        value={values?.applicants?.[activeIndex]?.personal_details?.id_number}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          handleTextInputChange(e);
        }}
        inputClasses='capitalize'
        error={errors.applicants?.[activeIndex]?.personal_details?.id_number}
        touched={
          touched?.applicants && touched?.applicants?.[activeIndex]?.personal_details?.id_number
        }
        disabled={
          !values?.applicants?.[activeIndex]?.personal_details?.id_type ||
          values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
        }
        labelDisabled={!values?.applicants?.[activeIndex]?.personal_details?.id_type}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN') {
            setFieldValue(
              `applicants[${activeIndex}].work_income_detail.pan_number`,
              values?.applicants?.[activeIndex]?.personal_details?.id_number,
            );
          }

          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }

            if (
              values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type
            ) {
              updateFields(
                'address_proof_number',
                values?.applicants?.[activeIndex]?.personal_details?.[name],
              );
              if (
                requiredFieldsStatus.address_proof_number !== undefined &&
                !requiredFieldsStatus.address_proof_number
              ) {
                setRequiredFieldsStatus((prev) => ({ ...prev, address_proof_number: true }));
              }
            }
          } else {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            updateFields(name, '');
          }
        }}
        onKeyDown={(e) => {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.id_type === 'AADHAR' &&
            (e.key === 'ArrowUp' ||
              e.key === 'ArrowDown' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowRight' ||
              e.key === ' ' ||
              e.keyCode === 32 ||
              (e.keyCode >= 65 && e.keyCode <= 90))
          ) {
            e.preventDefault();
          }
        }}
      />

      <div className='flex items-center gap-2'>
        <Checkbox
          checked={
            values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type
          }
          name='terms-agreed'
          onTouchEnd={(e) => {
            if (!e.target.checked) {
              setFieldValue(
                `applicants[${activeIndex}].personal_details.selected_address_proof`,
                '',
              );
              setFieldValue(`applicants[${activeIndex}].personal_details.address_proof_number`, '');

              setRequiredFieldsStatus((prev) => ({
                ...prev,
                selected_address_proof: false,
                address_proof_number: false,
              }));
            } else {
              if (!errors?.applicants?.[activeIndex]?.personal_details?.id_type) {
                setFieldValue(
                  `applicants[${activeIndex}].personal_details.selected_address_proof`,
                  values?.applicants?.[activeIndex]?.personal_details?.id_type,
                );
                setFieldError(
                  `applicants[${activeIndex}].personal_details.selected_address_proof`,
                  null,
                );
              }
              if (
                !errors?.applicants?.[activeIndex]?.personal_details?.id_type &&
                !errors?.applicants?.[activeIndex]?.personal_details?.id_number
              ) {
                setFieldValue(
                  `applicants[${activeIndex}].personal_details.address_proof_number`,
                  values?.applicants?.[activeIndex]?.personal_details?.id_number,
                );

                setFieldError(
                  `applicants[${activeIndex}].personal_details.address_proof_number`,
                  null,
                );

                setRequiredFieldsStatus((prev) => ({
                  ...prev,
                  selected_address_proof: true,
                  address_proof_number: true,
                }));
              }
            }

            setFieldValue(
              `applicants[${activeIndex}].personal_details.extra_params.same_as_id_type`,
              e.target.checked,
            );
          }}
          disabled={
            !values?.applicants?.[activeIndex]?.personal_details?.id_type
              ? true
              : values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN'
              ? true
              : !values?.applicants?.[activeIndex]?.personal_details?.id_number
              ? true
              : false ||
                values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
          }
        />
        <span
          className={`${
            values?.applicants?.[activeIndex]?.personal_details?.id_type !== 'PAN Card' &&
            values?.applicants?.[activeIndex]?.personal_details?.id_type &&
            values?.applicants?.[activeIndex]?.personal_details?.id_number
              ? 'text-[black]'
              : 'text-[gray]'
          }`}
        >
          Address proof will be as same as ID type
        </span>
      </div>

      <DropDown
        label='Select address proof'
        name={`applicants[${activeIndex}].personal_details.selected_address_proof`}
        required
        options={manualModeDropdownOptions[1].options}
        placeholder='Choose address proof'
        onChange={changeSelectedAddressProof}
        defaultSelected={
          values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof
        }
        error={errors.applicants?.[activeIndex]?.personal_details?.selected_address_proof}
        touched={
          touched?.applicants &&
          touched.applicants?.[activeIndex]?.personal_details?.selected_address_proof
        }
        disabled={
          values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type ||
          values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
        }
        disableOption={values?.applicants?.[activeIndex]?.personal_details?.id_type}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <TextInput
        label='Enter address proof number'
        placeholder='Enter address proof number'
        required
        name={`applicants[${activeIndex}].personal_details.address_proof_number`}
        value={values?.applicants?.[activeIndex]?.personal_details?.address_proof_number}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          handleTextInputChange(e);
        }}
        inputClasses='capitalize'
        error={errors.applicants?.[activeIndex]?.personal_details?.address_proof_number}
        touched={
          touched?.applicants &&
          touched.applicants?.[activeIndex]?.personal_details?.address_proof_number
        }
        disabled={
          !values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof ||
          values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type ||
          values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
        }
        labelDisabled={!values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            updateFields(name, '');
          }
        }}
        onKeyDown={(e) => {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof ===
              'AADHAR' &&
            (e.key === 'ArrowUp' ||
              e.key === 'ArrowDown' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowRight' ||
              e.key === ' ' ||
              e.keyCode === 32 ||
              (e.keyCode >= 65 && e.keyCode <= 90))
          ) {
            e.preventDefault();
          }
        }}
      />

      <TextInput
        label='First Name'
        placeholder='Eg: Sanjay'
        required
        name={`applicants[${activeIndex}].personal_details.first_name`}
        value={values?.applicants?.[activeIndex]?.applicant_details?.first_name}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.applicant_details?.first_name}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.applicant_details?.first_name
        }
        disabled={true}
      />
      <TextInput
        label='Middle Name'
        placeholder='Eg: Sham'
        name={`applicants[${activeIndex}].personal_details.middle_name`}
        value={values?.applicants?.[activeIndex]?.applicant_details?.middle_name}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.applicant_details?.middle_name}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.applicant_details?.middle_name
        }
        disabled={true}
      />
      <TextInput
        label='Last Name'
        placeholder='Eg: Picha'
        name={`applicants[${activeIndex}].personal_details.last_name`}
        value={values?.applicants?.[activeIndex]?.applicant_details?.last_name}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.applicant_details?.last_name}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.applicant_details?.last_name
        }
        disabled={true}
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          Gender <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className={`flex gap-4 w-full`}>
          {personalDetailsGenderOption.map((option, index) => (
            <CardRadio
              key={index}
              label={option.label}
              name={`applicants[${activeIndex}].personal_details.gender`}
              value={option.value}
              current={values?.applicants?.[activeIndex]?.personal_details?.gender}
              onChange={handleRadioChange}
              disabled={
                values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              }
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.applicants?.[activeIndex]?.personal_details?.gender &&
      touched?.applicants &&
      touched.applicants?.[activeIndex]?.personal_details?.gender ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.applicants?.[activeIndex]?.personal_details?.gender,
          }}
        />
      ) : (
        ''
      )}

      <DatePicker
        value={date}
        required
        name={`applicants[${activeIndex}].personal_details.date_of_birth`}
        label='Date of Birth'
        error={errors.applicants?.[activeIndex]?.personal_details?.date_of_birth}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.date_of_birth
        }
        disabled={true}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
          }
        }}
      />

      <TextInput
        label='Mobile number'
        placeholder='1234567890'
        required
        name={`applicants[${activeIndex}].personal_details.mobile_number`}
        value={values?.applicants?.[activeIndex]?.applicant_details?.mobile_number}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.personal_details?.mobile_number}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.mobile_number
        }
        disabled={true}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
          } else {
            updateFields(name, '');
          }
        }}
      />

      <TextInput
        label={`Father's name`}
        placeholder='Eg: Akash'
        required
        name={`applicants[${activeIndex}].personal_details.father_name`}
        value={values?.applicants?.[activeIndex]?.personal_details?.father_name}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.personal_details?.father_name}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.father_name
        }
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            updateFields(name, '');
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <TextInput
        label={`Mother's name`}
        placeholder='Eg: Rupali'
        required
        name={`applicants[${activeIndex}].personal_details.mother_name`}
        value={values?.applicants?.[activeIndex]?.personal_details?.mother_name}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.personal_details?.mother_name}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.mother_name
        }
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            updateFields(name, '');
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          Marital Status <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className={`flex gap-4 w-full`}>
          {personalMaritalStatusOptions.map((option, index) => (
            <CardRadio
              key={index}
              label={option.label}
              name={`applicants[${activeIndex}].personal_details.marital_status`}
              value={option.value}
              current={values?.applicants?.[activeIndex]?.personal_details?.marital_status}
              onChange={handleRadioChange}
              disabled={
                values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              }
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.applicants?.[activeIndex]?.personal_details?.marital_status &&
      touched?.applicants &&
      touched.applicants?.[activeIndex]?.personal_details?.marital_status ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.applicants?.[activeIndex]?.personal_details?.marital_status,
          }}
        />
      ) : (
        ''
      )}

      {values?.applicants?.[activeIndex]?.personal_details?.marital_status === 'Married' ? (
        <TextInput
          label={`Spouse name`}
          placeholder='Eg: Rupali'
          required
          name={`applicants[${activeIndex}].personal_details.spouse_name`}
          value={values?.applicants?.[activeIndex]?.personal_details?.spouse_name}
          onChange={handleTextInputChange}
          error={errors.applicants?.[activeIndex]?.personal_details?.spouse_name}
          touched={
            touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.spouse_name
          }
          onBlur={(e) => {
            handleBlur(e);
            const name = e.target.name.split('.')[2];
            if (
              !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
              values?.applicants?.[activeIndex]?.personal_details?.[name]
            ) {
              updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
              if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            } else {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
              updateFields(name, '');
            }
          }}
          disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
        />
      ) : null}

      <DropDown
        label='Religion'
        name={`applicants[${activeIndex}].personal_details.religion`}
        required
        options={manualModeDropdownOptions[2].options}
        placeholder='Eg: Hindu'
        onChange={(e) =>
          handleDropdownChange(`applicants[${activeIndex}].personal_details.religion`, e)
        }
        defaultSelected={values?.applicants?.[activeIndex]?.personal_details?.religion}
        error={errors?.applicants?.[activeIndex]?.personal_details?.religion}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.religion
        }
        onBlur={(e) => {
          handleBlur(e);
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <DropDown
        label='Preferred language'
        name={`applicants[${activeIndex}].personal_details.preferred_language`}
        required
        options={manualModeDropdownOptions[3].options}
        placeholder='Eg: Hindi'
        onChange={(e) =>
          handleDropdownChange(`applicants[${activeIndex}].personal_details.preferred_language`, e)
        }
        defaultSelected={values?.applicants?.[activeIndex]?.personal_details?.preferred_language}
        error={errors?.applicants?.[activeIndex]?.personal_details?.preferred_language}
        touched={
          touched?.applicants &&
          touched.applicants?.[activeIndex]?.personal_details?.preferred_language
        }
        onBlur={(e) => {
          handleBlur(e);
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <DropDown
        label='Qualification'
        name={`applicants[${activeIndex}].personal_details.qualification`}
        required
        options={manualModeDropdownOptions[4].options}
        placeholder='Eg: Graduate'
        onChange={(e) =>
          handleDropdownChange(`applicants[${activeIndex}].personal_details.qualification`, e)
        }
        defaultSelected={values?.applicants?.[activeIndex]?.personal_details?.qualification}
        error={errors?.applicants?.[activeIndex]?.personal_details?.qualification}
        touched={
          touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.qualification
        }
        onBlur={(e) => {
          handleBlur(e);
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <TextInputWithSendOtp
        label='Email'
        placeholder='Eg: xyz@gmail.com'
        name={`applicants[${activeIndex}].personal_details.email`}
        value={values?.applicants?.[activeIndex]?.personal_details?.email}
        onChange={handleTextInputChange}
        error={errors.applicants?.[activeIndex]?.personal_details?.email}
        touched={touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.email}
        onOTPSendClick={sendEmailOTP}
        disabledOtpButton={
          !values.applicants?.[activeIndex]?.personal_details?.email ||
          !!errors.applicants?.[activeIndex]?.personal_details?.email ||
          emailVerified ||
          hasSentOTPOnce
        }
        disabled={
          disableEmailInput ||
          emailVerified ||
          values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
        }
        message={
          emailVerified
            ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
            : null
        }
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[2];
          if (
            !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
            values?.applicants?.[activeIndex]?.personal_details?.[name]
          ) {
            updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
          } else {
            updateFields(name, '');
          }
        }}
      />

      {showOTPInput && (
        <OtpInput
          label='Enter OTP'
          required
          verified={emailVerified}
          setOTPVerified={setEmailVerified}
          onSendOTPClick={sendEmailOTP}
          defaultResendTime={30}
          disableSendOTP={!emailVerified}
          verifyOTPCB={verifyOTP}
          hasSentOTPOnce={hasSentOTPOnce}
        />
      )}
    </>
  );
}

export default memo(ManualMode);
