import { personalDetailsGenderOption, personalMaritalStatusOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import DropDown from '../../../../components/DropDown';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import Checkbox from '../../../../components/Checkbox';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import { manualModeDropdownOptions } from './manualModeDropdownOptions';
import OtpInput from '../../../../components/OtpInput/index';
import otpVerified from '../../../../assets/icons/otp-verified.svg';
import axios from 'axios';
import { getEmailOtp, verifyEmailOtp } from '../../../../global';

export default function ManualMode({ requiredFieldsStatus, setRequiredFieldsStatus }) {
  const {
    values,
    setValues,
    errors,
    updateProgress,
    touched,
    handleBlur,
    handleSubmit,
    setFieldValue,
    addressProofcheckbox,
    setAddressProofCheckbox,
  } = useContext(AuthContext);

  const [disableEmailInput, setDisableEmailInput] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);

  const [showOTPInput, setShowOTPInput] = useState(false);

  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);

  useEffect(() => {
    updateProgress(1, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[1];
      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeIdType = useCallback(
    (e) => {
      setFieldValue('personal_details.id_type', e);
      if (!requiredFieldsStatus.id_type) {
        setRequiredFieldsStatus((prev) => ({ ...prev, id_type: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeSelectedAddressProof = useCallback(
    (e) => {
      setFieldValue('personal_details.selected_address_proof', e);
      if (!requiredFieldsStatus.selected_address_proof) {
        setRequiredFieldsStatus((prev) => ({ ...prev, selected_address_proof: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      setFieldValue(e.target.name, e.target.value);
      const name = e.target.name.split('.')[1];
      if (
        requiredFieldsStatus[name] !== undefined &&
        !requiredFieldsStatus[name] &&
        e.target.value.length > 1
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleSearchableTextInputChange = useCallback(
    (name, value) => {
      setFieldValue(name, value);
      const fieldName = name.split('.')[0];
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

  const handleDateChange = useCallback(
    (e) => {
      setFieldValue('personal_details.date_of_birth', e);
      if (!requiredFieldsStatus.date_of_birth) {
        setRequiredFieldsStatus((prev) => ({ ...prev, date_of_birth: true }));
      }
    },
    [requiredFieldsStatus],
  );

  useEffect(() => {
    if (addressProofcheckbox) {
      setFieldValue('personal_details.selected_address_proof', values.personal_details?.id_type);
      setFieldValue('personal_details.address_proof_number', values.personal_details?.id_number);
    }
  }, [addressProofcheckbox]);

  useEffect(() => {
    if (addressProofcheckbox) {
      setFieldValue('personal_details.selected_address_proof', values.personal_details?.id_type);
      setFieldValue('personal_details.address_proof_number', values.personal_details?.id_number);
    }

    if (values.personal_details?.id_type === 'PAN Card') {
      setFieldValue('personal_details.selected_address_proof', '');
      setFieldValue('personal_details.address_proof_number', '');
      setAddressProofCheckbox(false);
    }
  }, [values.personal_details?.id_type, values.personal_details?.id_number]);

  const sendEmailOTP = () => {
    getEmailOtp(1)
      .then((res) => {
        console.log(res);
        setHasSentOTPOnce(true);
        setDisableEmailInput((prev) => !prev);
        setShowOTPInput(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verifyOTP = useCallback((otp) => {
    verifyEmailOtp(1, otp)
      .then((res) => {
        console.log(res);
        setEmailVerified(true);
        setShowOTPInput(false);
        return true;
      })
      .catch((err) => {
        console.log(err);
        setEmailVerified(false);
        setShowOTPInput(true);
        return false;
      });
  }, []);

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
        onBlur={handleBlur}
      />

      <TextInput
        label='Enter ID number'
        placeholder='Eg: SABCD67120'
        required
        name='personal_details.id_number'
        value={values.personal_details?.id_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
        error={errors.personal_details?.id_number}
        touched={touched.personal_details?.id_number}
        onBlur={handleBlur}
        disabled={!values.personal_details?.id_type}
      />

      <div className='flex items-center gap-2'>
        {values.personal_details?.id_type &&
        values.personal_details?.id_type !== 'PAN Card' &&
        values.personal_details?.id_number ? (
          <>
            <Checkbox
              checked={addressProofcheckbox}
              setChecked={setAddressProofCheckbox}
              name='terms-agreed'
              onChange={(e) => {
                if (!e.target.checked) {
                  setFieldValue('personal_details.selected_address_proof', '');
                  setFieldValue('personal_details.address_proof_number', '');
                }
                setAddressProofCheckbox(e.target.checked);
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
              checked={addressProofcheckbox}
              setChecked={setAddressProofCheckbox}
              name='terms-agreed'
              onChange={(e) => {
                if (!e.target.checked) {
                  setFieldValue('personal_details.selected_address_proof', '');
                  setFieldValue('personal_details.address_proof_number', '');
                }
                setAddressProofCheckbox(e.target.checked);
              }}
              disabled={true}
            />

            <span className='text-[gray]'>Address proof will be as same as ID type</span>
          </>
        )}
      </div>

      <DropDown
        label='Select address proof'
        name='personal_details.address_proof'
        required
        options={manualModeDropdownOptions[1].options}
        placeholder='Choose address proof'
        onChange={changeSelectedAddressProof}
        defaultSelected={values.personal_details?.selected_address_proof}
        error={errors.personal_details?.selected_address_proof}
        touched={touched.personal_details?.selected_address_proof}
        onBlur={handleBlur}
        disabled={addressProofcheckbox}
        disableOption={values.personal_details?.id_type}
      />

      <TextInput
        label='Enter address proof number'
        placeholder='Eg: 32432432423'
        required
        name='personal_details.address_proof_number'
        value={values.personal_details?.address_proof_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
        error={errors.personal_details?.address_proof_number}
        touched={touched.personal_details?.address_proof_number}
        onBlur={handleBlur}
        disabled={!values.personal_details?.selected_address_proof || addressProofcheckbox}
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
        onBlur={handleBlur}
      />
      <TextInput
        label='Middle Name'
        placeholder='Eg: Sham'
        name='personal_details.middle_name'
        value={values.personal_details?.middle_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.middle_name}
        touched={touched.personal_details?.middle_name}
        onBlur={handleBlur}
      />
      <TextInput
        label='Last Name'
        placeholder='Eg: Picha'
        name='personal_details.last_name'
        value={values.personal_details?.last_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.last_name}
        touched={touched.personal_details?.last_name}
        onBlur={handleBlur}
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
        startDate={values.personal_details?.date_of_birth}
        setStartDate={handleDateChange}
        required
        name='personal_details.date_of_birth'
        label='Date of Birth'
        error={errors.personal_details?.date_of_birth}
        touched={touched.personal_details?.date_of_birth}
        onBlur={handleBlur}
        disabled={true}
      />

      <TextInput
        label='Mobile number'
        placeholder='1234567890'
        required
        name='personal_details.mobile_number'
        value={values.personal_details?.mobile_number}
        onChange={handleTextInputChange}
        error={errors.personal_details?.mobile_number}
        touched={touched.personal_details?.mobile_number}
        onBlur={handleBlur}
        disabled={true}
      />

      <TextInput
        label='Father/Husbands name'
        placeholder='Eg: Akash'
        required
        name='personal_details.father_husband_name'
        value={values.personal_details?.father_husband_name}
        onChange={handleTextInputChange}
        error={errors.personal_details?.father_husband_name}
        touched={touched.personal_details?.father_husband_name}
        onBlur={handleBlur}
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
        onBlur={handleBlur}
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
        onChange={(e) => handleSearchableTextInputChange('religion', e)}
        defaultSelected={values.personal_details?.religion}
        error={errors.personal_details?.religion}
        touched={touched.personal_details?.religion}
        onBlur={handleBlur}
      />

      <DropDown
        label='Preferred language'
        name='personal_details.preferred_language'
        required
        options={manualModeDropdownOptions[3].options}
        placeholder='Eg: Hindi'
        onChange={(e) => handleSearchableTextInputChange('preferred_language', e)}
        defaultSelected={values.personal_details?.preferred_language}
        error={errors.personal_details?.preferred_language}
        touched={touched.personal_details?.preferred_language}
        onBlur={handleBlur}
      />

      <DropDown
        label='Qualification'
        name='personal_details.qualification'
        required
        options={manualModeDropdownOptions[4].options}
        placeholder='Eg: Graduate'
        onChange={(e) => handleSearchableTextInputChange('qualification', e)}
        defaultSelected={values.personal_details?.qualification}
        error={errors.personal_details?.qualification}
        touched={touched.personal_details?.qualification}
        onBlur={handleBlur}
      />

      <TextInputWithSendOtp
        label='Email'
        placeholder='Eg: xyz@gmail.com'
        name='personal_details.email'
        value={values.personal_details?.email}
        onChange={handleTextInputChange}
        error={errors.personal_details?.email}
        touched={touched.personal_details?.email}
        onBlur={handleBlur}
        onOTPSendClick={sendEmailOTP}
        disabledOtpButton={!!errors.personal_details?.email || emailVerified || hasSentOTPOnce}
        disabled={disableEmailInput}
        message={
          emailVerified
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
