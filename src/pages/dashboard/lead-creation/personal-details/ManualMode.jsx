import { personalDetailsGenderOption, personalMaritalStatusOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import DropDown from '../../../../components/DropDown';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import { top100Films } from '../../../../assets/SearchableInputTestJsonData.json';
import Checkbox from '../../../../components/Checkbox';

export default function ManualMode({ requiredFieldsStatus, setRequiredFieldsStatus }) {
  const { values, setValues, errors, updateProgress, touched, handleBlur, handleSubmit } =
    useContext(AuthContext);

  const [disableEmailInput, setDisableEmailInput] = useState(false);

  const [checkbox, setCheckbox] = useState(false);

  const handleRadioChange = useCallback(
    (e) => {
      let newData = values;
      newData[e.name] = e.value;
      setValues(newData);
      if (!requiredFieldsStatus[e.name]) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [e.name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeIdType = useCallback(
    (e) => {
      let newData = values;
      newData.id_type = e;
      setValues(newData);
      if (!requiredFieldsStatus.id_type) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, id_type: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const changeAddressProof = useCallback(
    (e) => {
      let newData = values;
      newData.address_proof = e;
      setValues(newData);
      if (!requiredFieldsStatus.address_proof) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, address_proof: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const field = e.target.name;
      let newData = values;
      newData[e.target.name] = e.target.value;
      setValues({ ...newData });
      if (
        requiredFieldsStatus[e.target.name] !== undefined &&
        !requiredFieldsStatus[e.target.name]
      ) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [field]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleSearchableTextInputChange = useCallback(
    (name, value) => {
      let newData = values;
      newData[name] = value;
      setValues({ ...newData });
      if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleDateChange = useCallback(
    (e) => {
      let newData = values;
      newData.date_of_birth = e;
      setValues(newData);
      if (!requiredFieldsStatus.date_of_birth) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, date_of_birth: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const sendEmailOTP = () => {
    setDisableEmailInput((prev) => !prev);
  };

  const manualModeDropdownOptions = [
    {
      title: 'Id Type',
      options: [
        {
          label: 'PAN Card',
          value: 'PAN Card',
        },
        {
          label: 'Aadhar',
          value: 'Aadhar',
        },
        {
          label: 'Driving license',
          value: 'Driving license',
        },
        {
          label: 'Voter ID',
          value: 'Voter ID',
        },
        {
          label: 'Passport',
          value: 'Passport',
        },
      ],
    },
    {
      title: 'Address Proof',
      options: [
        {
          label: 'Aadhar',
          value: 'Aadhar',
        },
        {
          label: 'Driving license',
          value: 'Driving license',
        },
        {
          label: 'Voter ID',
          value: 'Voter ID',
        },
        {
          label: 'Passport',
          value: 'Passport',
        },
        {
          label: 'Gas bill',
          value: 'Gas bill',
        },
        {
          label: 'Rent agreement',
          value: 'Rent agreement',
        },
        {
          label: 'Electricity bill',
          value: 'Electricity bill',
        },
      ],
    },
    {
      title: 'Religion',
      options: [
        {
          label: 'Hindu',
          value: 'Hindu',
        },

        {
          label: 'Buddhist',
          value: 'Buddhist',
        },
        {
          label: 'Christian',
          value: 'Christian',
        },
        {
          label: 'Jain',
          value: 'Jain',
        },
        {
          label: 'Muslim',
          value: 'Muslim',
        },
        {
          label: 'Sikh',
          value: 'Sikh',
        },
        {
          label: 'Others',
          value: 'Others',
        },
      ],
    },

    {
      title: 'Language',
      options: [
        {
          label: 'Hindi',
          value: 'Hindi',
        },

        {
          label: 'English',
          value: 'English',
        },
        {
          label: 'Marathi',
          value: 'Marathi',
        },
        {
          label: 'Gujarati',
          value: 'Gujarati',
        },
        {
          label: 'Kannada',
          value: 'Kannada',
        },
        {
          label: 'Tamil',
          value: 'Tamil',
        },
      ],
    },

    {
      title: 'Qualification',
      options: [
        {
          label: 'Graduate',
          value: 'Graduate',
        },

        {
          label: 'Illetrate',
          value: 'Illetrate',
        },
        {
          label: 'Matriculate',
          value: 'Matriculate',
        },
        {
          label: 'Non-Metric',
          value: 'Non-Metric',
        },
        {
          label: 'Post Graduate',
          value: 'Post Graduate',
        },
        {
          label: 'Professional',
          value: 'Professional',
        },
        {
          label: 'Student',
          value: 'Student',
        },
        {
          label: 'Under Graduate',
          value: 'Under Graduate',
        },
      ],
    },
  ];

  useEffect(() => {
    if (checkbox) {
      let newData = values;
      newData.address_proof = values.id_type;
      newData.address_proof_number = values.id_number;
      setValues({ ...newData });
    } else {
      let newData = values;
      newData.address_proof = '';
      newData.address_proof_number = '';
      setValues({ ...newData });
    }
  }, [checkbox]);

  return (
    <>
      <DropDown
        label='Select ID type'
        name='id_type'
        required
        options={manualModeDropdownOptions[0].options}
        placeholder='Choose ID type'
        onChange={changeIdType}
        defaultSelected={values.id_type}
        error={errors.id_type}
        touched={touched.id_type}
        onBlur={handleBlur}
      />

      <TextInput
        label='Enter ID number'
        placeholder='Eg: SABCD67120'
        required
        name='id_number'
        value={values.id_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
        error={errors.id_number}
        touched={touched.id_number}
        onBlur={handleBlur}
        disabled={!values.id_type}
      />

      <div className='flex items-center gap-2'>
        {values.id_type !== 'PAN Card' ? (
          <>
            <Checkbox
              checked={checkbox}
              name='terms-agreed'
              onChange={() => setCheckbox((prev) => !prev)}
              disabled={!values.id_type}
            />

            <span className={`${values.id_type ? 'text-[black]' : 'text-[gray]'}`}>
              Address proof will be as same as ID type
            </span>
          </>
        ) : (
          <>
            <Checkbox
              checked={checkbox}
              name='terms-agreed'
              onChange={() => setCheckbox((prev) => !prev)}
              disabled={true}
            />

            <span className='text-[gray]'>Address proof will be as same as ID type</span>
          </>
        )}
      </div>

      <DropDown
        label='Select address proof'
        name='address_proof'
        required
        options={manualModeDropdownOptions[1].options}
        placeholder='Choose address proof'
        onChange={changeAddressProof}
        defaultSelected={values.address_proof}
        error={errors.address_proof}
        touched={touched.address_proof}
        onBlur={handleBlur}
        disabled={checkbox}
        disableOption={values.id_type}
      />

      <TextInput
        label='Enter address proof number'
        placeholder='Eg: 32432432423'
        required
        name='address_proof_number'
        value={values.address_proof_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
        error={errors.address_proof_number}
        touched={touched.address_proof_number}
        onBlur={handleBlur}
        disabled={!values.address_proof || checkbox}
      />

      <TextInput
        label='First Name'
        placeholder='Eg: Sanjay'
        required
        name='first_name'
        value={values.first_name}
        onChange={handleTextInputChange}
        error={errors.first_name}
        touched={touched.first_name}
        onBlur={handleBlur}
      />
      <TextInput
        label='Middle Name'
        placeholder='Eg: Sham'
        required
        name='middle_name'
        value={values.middle_name}
        onChange={handleTextInputChange}
        error={errors.middle_name}
        touched={touched.middle_name}
        onBlur={handleBlur}
      />
      <TextInput
        label='Last Name'
        placeholder='Eg: Picha'
        required
        name='last_name'
        value={values.last_name}
        onChange={handleTextInputChange}
        error={errors.last_name}
        touched={touched.last_name}
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
              name='gender'
              value={option.value}
              current={values.gender}
              onChange={handleRadioChange}
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.gender && touched.gender ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.gender,
          }}
        />
      ) : (
        ''
      )}

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

      <TextInput
        label='Mobile number'
        placeholder='1234567890'
        required
        name='mobile_number'
        value={values.mobile_number}
        onChange={handleTextInputChange}
        error={errors.mobile_number}
        touched={touched.mobile_number}
        onBlur={handleBlur}
        disabled={true}
      />

      <TextInput
        label='Father/Husbands name'
        placeholder='Eg: Akash'
        required
        name='father_or_husband_name'
        value={values.father_or_husband_name}
        onChange={handleTextInputChange}
        error={errors.father_or_husband_name}
        touched={touched.father_or_husband_name}
        onBlur={handleBlur}
      />

      <TextInput
        label='Mothers name'
        placeholder='Eg: Rupali'
        required
        name='mother_name'
        value={values.mother_name}
        onChange={handleTextInputChange}
        error={errors.mother_name}
        touched={touched.mother_name}
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
              name='marital_status'
              value={option.value}
              current={values.marital_status}
              onChange={handleRadioChange}
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {errors.marital_status && touched.marital_status ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: errors.marital_status,
          }}
        />
      ) : (
        ''
      )}

      <DropDown
        label='Religion'
        name='religion'
        required
        options={manualModeDropdownOptions[2].options}
        placeholder='Eg: Hindu'
        onChange={(e) => handleSearchableTextInputChange('religion', e)}
        defaultSelected={values.religion}
        error={errors.religion}
        touched={touched.religion}
        onBlur={handleBlur}
      />

      <DropDown
        label='Preferred language'
        name='preferred_language'
        required
        options={manualModeDropdownOptions[3].options}
        placeholder='Eg: Hindi'
        onChange={(e) => handleSearchableTextInputChange('preferred_language', e)}
        defaultSelected={values.preferred_language}
        error={errors.preferred_language}
        touched={touched.preferred_language}
        onBlur={handleBlur}
      />

      <DropDown
        label='Qualification'
        name='qualification'
        required
        options={manualModeDropdownOptions[4].options}
        placeholder='Eg: Graduate'
        onChange={(e) => handleSearchableTextInputChange('qualification', e)}
        defaultSelected={values.qualification}
        error={errors.qualification}
        touched={touched.qualification}
        onBlur={handleBlur}
      />

      <TextInput
        label='Email'
        placeholder='Eg: xyz@gmail.com'
        name='email'
        value={values.email}
        onChange={handleTextInputChange}
        error={errors.email}
        touched={touched.email}
        onBlur={handleBlur}
      />

      <span
        className={`text-right text-[16px] font-semibold ${
          disableEmailInput ? 'text-[#96989A]' : 'text-[#E33439]'
        }`}
        disabled={!!errors.email}
        onClick={sendEmailOTP}
      >
        Send OTP
      </span>
    </>
  );
}
