import { personalDetailsGenderOption, personalMaritalStatusOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import DropDown from '../../../../components/DropDown';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import Checkbox from '../../../../components/Checkbox';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import { manualModeDropdownOptions } from './manualModeDropdownOptions';
import OtpInput from '../../../../components/OtpInput/index';
import otpVerified from '../../../../assets/icons/otp-verified.svg';
import { getEmailOtp, verifyEmailOtp } from '../../../../global';

export default function ManualMode({
  requiredFieldsStatus,
  setRequiredFieldsStatus,
  updateFields,
}) {
  const {
    values,
    setValues,
    errors,
    updateProgress,
    touched,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setToastMessage,
  } = useContext(LeadContext);

  const [disableEmailInput, setDisableEmailInput] = useState(false);

  const [emailVerified, setEmailVerified] = useState(values?.personal_details?.is_email_verified);

  const [showOTPInput, setShowOTPInput] = useState(false);

  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);

  useEffect(() => {
    updateProgress(1, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  useEffect(() => {
    if (emailVerified) {
      setFieldValue('personal_details.is_email_verified', true);
      updateFields('is_email_verified', true);
    }
  }, [emailVerified]);

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[1];
      updateFields(name, e.value);
      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeIdType = useCallback(
    (e) => {
      setFieldValue('personal_details.id_type', e);
      updateFields('id_type', e);
      if (!requiredFieldsStatus.id_type) {
        setRequiredFieldsStatus((prev) => ({ ...prev, id_type: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeSelectedAddressProof = useCallback(
    (e) => {
      setFieldValue('personal_details.selected_address_proof', e);
      updateFields('selected_address_proof', e);
      if (!requiredFieldsStatus.selected_address_proof) {
        setRequiredFieldsStatus((prev) => ({ ...prev, selected_address_proof: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      const pattern = /^[A-Za-z]+$/;
      if (
        pattern.exec(value[value.length - 1]) &&
        e.target.name !== 'personal_details.email' &&
        e.target.name !== 'personal_details.id_number' &&
        e.target.name !== 'personal_details.address_proof_number'
      ) {
        setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (
        e.target.name == 'personal_details.father_husband_name' ||
        e.target.name == 'personal_details.mother_name'
      ) {
        const value = e.target.value;
        const pattern2 = /^[a-zA-Z ]+$/;
        if (pattern2.test(value))
          setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (e.target.name === 'personal_details.email') {
        setFieldValue(e.target.name, value);
        setHasSentOTPOnce(false);
        setShowOTPInput(false);
      }

      if (
        e.target.name === 'personal_details.id_number' ||
        e.target.name === 'personal_details.address_proof_number'
      ) {
        if (
          e.target.name === 'personal_details.id_number' &&
          values.personal_details.id_type === 'Aadhar'
        ) {
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (value.length < values.personal_details.id_number.length) {
            setFieldValue(e.target.name, value);
          }
        } else if (
          e.target.name === 'personal_details.address_proof_number' &&
          values.personal_details.selected_address_proof === 'Aadhar'
        ) {
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (value.length < values.personal_details.address_proof_number.length) {
            setFieldValue(e.target.name, value);
          }
        } else {
          const pattern2 = /^[A-Za-z0-9]+$/;
          if (pattern2.exec(value[value.length - 1])) {
            setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }
      }

      const name = e.target.name.split('.')[1];
      if (
        requiredFieldsStatus[name] !== undefined &&
        !requiredFieldsStatus[name] &&
        e.target.value.length > 1
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [
      requiredFieldsStatus,
      values.personal_details.id_number,
      values.personal_details.address_proof_number,
      values.personal_details.id_type,
      values.personal_details.selected_address_proof,
    ],
  );

  const handleDropdownChange = useCallback(
    (name, value) => {
      setFieldValue(name, value);
      const fieldName = name.split('.')[1];
      updateFields(fieldName, value);
      if (
        requiredFieldsStatus[fieldName] !== undefined &&
        !requiredFieldsStatus[fieldName] &&
        value.length > 1
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [fieldName]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  useEffect(() => {
    updateFields();
  }, [values?.personal_details?.extra_params?.same_as_id_type]);

  useEffect(() => {
    setFieldValue('personal_details.id_number', '');
  }, [values.personal_details?.id_type]);

  useEffect(() => {
    if (!values?.personal_details?.extra_params?.same_as_id_type) {
      setFieldValue('personal_details.address_proof_number', '');
    }
  }, [values.personal_details?.selected_address_proof]);

  useEffect(() => {
    if (values?.personal_details?.extra_params?.same_as_id_type) {
      setFieldValue('personal_details.selected_address_proof', values.personal_details?.id_type);
      setFieldValue('personal_details.address_proof_number', values.personal_details?.id_number);
    }

    if (
      values?.personal_details?.extra_params?.same_as_id_type &&
      values.personal_details?.id_type === 'PAN Card'
    ) {
      setFieldValue('personal_details.selected_address_proof', '');
      setFieldValue('personal_details.address_proof_number', '');
      setFieldValue('personal_details.extra_params.same_as_id_type', false);
    }
  }, [values.personal_details?.id_type, values.personal_details?.id_number]);

  const sendEmailOTP = () => {
    // setDisableEmailInput((prev) => !prev);
    setShowOTPInput(true);
    setHasSentOTPOnce(true);
    getEmailOtp(1);
    setToastMessage('OTP has been sent to your mail id');
  };

  const verifyOTP = useCallback((otp) => {
    verifyEmailOtp(1, otp)
      .then((res) => {
        setEmailVerified(true);
        setShowOTPInput(false);
        return true;
      })
      .catch((err) => {
        setEmailVerified(false);
        setShowOTPInput(true);
        return false;
      });
  }, []);

  useEffect(() => {
    setFieldValue('personal_details.date_of_birth', values.applicant_details?.date_of_birth);
    updateFields('date_of_birth', values.applicant_details?.date_of_birth);
  }, [values.applicant_details?.date_of_birth]);

  useEffect(() => {
    setFieldValue('personal_details.mobile_number', values.applicant_details?.mobile_number);
    updateFields('mobile_number', values.applicant_details?.mobile_number);
  }, [values.applicant_details?.mobile_number]);

  console.log(values.personal_details.id_number);

  return (
    <>
      <DropDown
        label='Select ID type'
        name='personal_details.id_type'
        required
        options={manualModeDropdownOptions[0].options}
        placeholder='Choose ID type'
        onChange={changeIdType}
        defaultSelected={values.personal_details?.id_type}
        error={errors.personal_details?.id_type}
        touched={touched.personal_details?.id_type}
        disableOption={values.personal_details?.selected_address_proof}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <TextInput
        label='Enter ID number'
        placeholder='Enter Id number'
        required
        name='personal_details.id_number'
        value={values.personal_details?.id_number}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          handleTextInputChange(e);
        }}
        inputClasses='capitalize'
        error={errors.personal_details?.id_number}
        touched={touched.personal_details?.id_number}
        disabled={!values.personal_details?.id_type}
        labelDisabled={!values.personal_details?.id_type}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />

      <div className='flex items-center gap-2'>
        {values.personal_details?.id_type &&
        values.personal_details?.id_type !== 'PAN Card' &&
        values.personal_details?.id_number ? (
          <>
            <Checkbox
              checked={values?.personal_details?.extra_params?.same_as_id_type}
              name='terms-agreed'
              onChange={(e) => {
                if (!e.target.checked) {
                  setFieldValue('personal_details.selected_address_proof', '');
                  setFieldValue('personal_details.address_proof_number', '');
                } else {
                  setFieldValue(
                    'personal_details.selected_address_proof',
                    values.personal_details?.id_type,
                  );
                  setFieldValue(
                    'personal_details.address_proof_number',
                    values.personal_details?.id_number,
                  );
                }
                setFieldValue('personal_details.extra_params.same_as_id_type', e.target.checked);
                updateFields();
              }}
              disabled={!values.personal_details?.id_type}
            />

            <span
              className={`${values.personal_details?.id_type ? 'text-[black]' : 'text-[gray]'}`}
            >
              Address proof will be as same as ID type
            </span>
          </>
        ) : (
          <>
            <Checkbox
              checked={values?.personal_details?.extra_params?.same_as_id_type}
              name='terms-agreed'
              onChange={(e) => {
                if (!e.target.checked) {
                  setFieldValue('personal_details.selected_address_proof', '');
                  setFieldValue('personal_details.address_proof_number', '');
                } else {
                  setFieldValue(
                    'personal_details.selected_address_proof',
                    values.personal_details?.id_type,
                  );
                  setFieldValue(
                    'personal_details.address_proof_number',
                    values.personal_details?.id_number,
                  );
                }
                setFieldValue('personal_details.extra_params.same_as_id_type', e.target.checked);
              }}
              disabled={true}
            />

            <span className='text-[gray]'>Address proof will be as same as ID type</span>
          </>
        )}
      </div>

      <DropDown
        label='Select address proof'
        name='personal_details.selected_address_proof'
        required
        options={manualModeDropdownOptions[1].options}
        placeholder='Choose address proof'
        onChange={changeSelectedAddressProof}
        defaultSelected={values.personal_details?.selected_address_proof}
        error={errors.personal_details?.selected_address_proof}
        touched={touched.personal_details?.selected_address_proof}
        disabled={values?.personal_details?.extra_params?.same_as_id_type}
        disableOption={values.personal_details?.id_type}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <TextInput
        label='Enter address proof number'
        placeholder='Enter address proof number'
        required
        name='personal_details.address_proof_number'
        value={values.personal_details?.address_proof_number}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          handleTextInputChange(e);
        }}
        inputClasses='capitalize'
        error={errors.personal_details?.address_proof_number}
        touched={touched.personal_details?.address_proof_number}
        disabled={
          !values.personal_details?.selected_address_proof ||
          values?.personal_details?.extra_params?.same_as_id_type
        }
        labelDisabled={!values.personal_details?.selected_address_proof}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />

      <TextInput
        label='First Name'
        placeholder='Eg: Sanjay'
        required
        name='personal_details.first_name'
        value={values.personal_details?.first_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.first_name}
        touched={touched.personal_details?.first_name}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />
      <TextInput
        label='Middle Name'
        placeholder='Eg: Sham'
        name='personal_details.middle_name'
        value={values.personal_details?.middle_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.middle_name}
        touched={touched.personal_details?.middle_name}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />
      <TextInput
        label='Last Name'
        placeholder='Eg: Picha'
        name='personal_details.last_name'
        value={values.personal_details?.last_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.last_name}
        touched={touched.personal_details?.last_name}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
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
              name='personal_details.gender'
              value={option.value}
              current={values.personal_details?.gender}
              onChange={handleRadioChange}
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.personal_details?.gender && touched.personal_details?.gender ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.personal_details?.gender,
          }}
        />
      ) : (
        ''
      )}

      <DatePicker
        value={values.applicant_details?.date_of_birth}
        required
        name='personal_details.date_of_birth'
        label='Date of Birth'
        error={errors.personal_details?.date_of_birth}
        touched={touched.personal_details?.date_of_birth}
        disabled={true}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, personal_details[name]);
          }
        }}
      />

      <TextInput
        label='Mobile number'
        placeholder='1234567890'
        required
        name='personal_details.mobile_number'
        value={values.applicant_details?.mobile_number}
        onChange={handleTextInputChange}
        error={errors.personal_details?.mobile_number}
        touched={touched.personal_details?.mobile_number}
        disabled={true}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />

      <TextInput
        label={`Father/Husband's name`}
        placeholder='Eg: Akash'
        required
        name='personal_details.father_husband_name'
        value={values.personal_details?.father_husband_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.father_husband_name}
        touched={touched.personal_details?.father_husband_name}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
      />

      <TextInput
        label='Mothers name'
        placeholder='Eg: Rupali'
        required
        name='personal_details.mother_name'
        value={values.personal_details?.mother_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.mother_name}
        touched={touched.personal_details?.mother_name}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
          }
        }}
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
              name='personal_details.marital_status'
              value={option.value}
              current={values.personal_details?.marital_status}
              onChange={handleRadioChange}
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.personal_details?.marital_status && touched.personal_details?.marital_status ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.personal_details?.marital_status,
          }}
        />
      ) : (
        ''
      )}

      <DropDown
        label='Religion'
        name='personal_details.religion'
        required
        options={manualModeDropdownOptions[2].options}
        placeholder='Eg: Hindu'
        onChange={(e) => handleDropdownChange('personal_details.religion', e)}
        defaultSelected={values.personal_details?.religion}
        error={errors.personal_details?.religion}
        touched={touched.personal_details?.religion}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <DropDown
        label='Preferred language'
        name='personal_details.preferred_language'
        required
        options={manualModeDropdownOptions[3].options}
        placeholder='Eg: Hindi'
        onChange={(e) => handleDropdownChange('personal_details.preferred_language', e)}
        defaultSelected={values.personal_details?.preferred_language}
        error={errors.personal_details?.preferred_language}
        touched={touched.personal_details?.preferred_language}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <DropDown
        label='Qualification'
        name='personal_details.qualification'
        required
        options={manualModeDropdownOptions[4].options}
        placeholder='Eg: Graduate'
        onChange={(e) => handleDropdownChange('personal_details.qualification', e)}
        defaultSelected={values.personal_details?.qualification}
        error={errors.personal_details?.qualification}
        touched={touched.personal_details?.qualification}
        onBlur={(e) => {
          handleBlur(e);
        }}
      />

      <TextInputWithSendOtp
        label='Email'
        placeholder='Eg: xyz@gmail.com'
        name='personal_details.email'
        value={values.personal_details?.email}
        onChange={handleTextInputChange}
        error={errors.personal_details?.email}
        touched={touched.personal_details?.email}
        onOTPSendClick={sendEmailOTP}
        disabledOtpButton={!!errors.personal_details?.email || emailVerified || hasSentOTPOnce}
        disabled={disableEmailInput || emailVerified}
        message={
          emailVerified
            ? `OTP Verfied
          <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
          `
            : null
        }
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];
          if (!errors.personal_details[name] && values.personal_details[name]) {
            updateFields(name, values.personal_details[name]);
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
