import { personalDetailsGenderOption, personalMaritalStatusOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import DropDown from '../../../../components/DropDown';
import TextInput from '../../../../components/TextInput';
import DatePicker from '../../../../components/DatePicker';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import { top100Films } from '../../../../assets/SearchableInputTestJsonData.json';

export default function ManualMode({ requiredFieldsStatus, setRequiredFieldsStatus }) {
  const { values, setValues, errors, updateProgress } = useContext(AuthContext);

  const [disableEmailInput, setDisableEmailInput] = useState(false);

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
    (e, value) => {
      console.log(value);
      const field = e.target.name;
      let newData = values;
      newData[e.target.name] = value.value;
      setValues(newData);
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
          label: 'Voter Id',
          value: 'Voter Id',
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
      ],
    },
  ];

  return (
    <>
      <DropDown
        label='Select ID type'
        required
        options={manualModeDropdownOptions[0].options}
        placeholder='Choose ID type'
        onChange={changeIdType}
        defaultSelected={values.id_type}
      />
      <TextInput
        label='Enter ID number'
        placeholder='Eg: SABCD67120'
        required
        name='id_number'
        value={values.id_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />
      <DropDown
        label='Select address proof'
        required
        options={manualModeDropdownOptions[1].options}
        placeholder='Choose address proof'
        onChange={changeAddressProof}
        defaultSelected={values.address_proof}
      />
      <TextInput
        label='Enter address proof number'
        placeholder='Eg: 32432432423'
        required
        name='address_proof_number'
        value={values.address_proof_number}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />
      <TextInput
        label='First Name'
        placeholder='Eg: Sanjay'
        required
        name='first_name'
        value={values.first_name}
        onChange={handleTextInputChange}
      />
      <TextInput
        label='Middle Name'
        placeholder='Eg: Sham'
        required
        name='middle_name'
        value={values.middle_name}
        onChange={handleTextInputChange}
      />
      <TextInput
        label='Last Name'
        placeholder='Eg: Picha'
        required
        name='last_name'
        value={values.last_name}
        onChange={handleTextInputChange}
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

      <DatePicker
        startDate={values.date_of_birth}
        setStartDate={handleDateChange}
        required
        name='date_of_birth'
        label='Date of Birth'
      />

      <TextInput
        label='Mobile number'
        placeholder='1234567890'
        required
        name='mobile_number'
        value={values.mobile_number}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Father/Husbands name'
        placeholder='Eg: Akash'
        required
        name='father_or_husband_name'
        value={values.father_or_husband_name}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Mothers name'
        placeholder='Eg: Rupali'
        required
        name='mother_name'
        value={values.mother_name}
        onChange={handleTextInputChange}
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

      <SearchableTextInput
        label='Religion'
        placeholder='Eg: Hindu'
        required
        name='religion'
        onChange={handleSearchableTextInputChange}
        options={top100Films}
      />

      <SearchableTextInput
        label='Preferred language'
        placeholder='Eg: Hindi'
        required
        name='preferred_language'
        onChange={handleSearchableTextInputChange}
        options={top100Films}
      />

      <SearchableTextInput
        label='Qualification'
        placeholder='Eg: Graduate'
        required
        name='qualification'
        onChange={handleSearchableTextInputChange}
        options={top100Films}
      />

      <TextInput
        label='Email'
        placeholder='Eg: xyz@gmail.com'
        name='email'
        value={values.email}
        onChange={handleTextInputChange}
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
