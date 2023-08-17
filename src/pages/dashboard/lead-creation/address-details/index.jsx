import { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import IconRent from '../../../../assets/icons/rent';
import { CardRadio, TextInput } from '../../../../components';
import IconSelfOwned from '../../../../assets/icons/self-owned';

const residenceData = [
  {
    label: 'Rented',
    value: 'Rented',
    icon: <IconRent />,
  },
  {
    label: 'Self owned',
    value: 'Self owned',
    icon: <IconSelfOwned />,
  },
];

const yearsResidingData = [
  {
    label: '0-1',
    value: '0',
  },
  {
    label: '2-5',
    value: '1',
  },
  {
    label: '6-10',
    value: '2',
  },
  {
    label: '10+',
    value: '3',
  },
];

// const fieldsRequiredForLeadGeneration = ['first_name', 'phone_number', 'pincode'];
const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];
// const disableNextFields = ['loan_request_amount', 'first_name', 'pincode', 'phone_number'];

const AddressDetails = () => {
  const {
    inputDisabled,
    values,
    currentLeadId,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldError,
    setFieldValue,
  } = useContext(AuthContext);
  const [selectedResidence, setSelectedResidence] = useState(null);
  const [currentAddressResidingYears, setCurrentAddressResidingYears] = useState(null);
  const [permanentAddressResidingYears, setPermanentAddressResidingYears] = useState(null);
  // const [selectedResidingIndex, setSelectedResidingIndex] = useState(null);

  const onResidenceChange = useCallback(
    (e) => {
      const value = e;
      setSelectedResidence(value);
      setFieldValue('residence', value);
      // updateLeadDataOnBlur(currentLeadId, 'gender', value);
    },
    [currentLeadId, setFieldValue],
  );

  const currentAddressYearsResidingChange = useCallback(
    (e) => {
      const value = e;
      setCurrentAddressResidingYears(value);
      // setSelectedResidingIndex(value);
      setFieldValue('current_address_residing_years', value);
      // updateLeadDataOnBlur(currentLeadId, 'gender', value);
    },
    [currentLeadId, setFieldValue],
  );

  const permanentAddressYearsResidingChange = useCallback(
    (e) => {
      const value = e;
      setPermanentAddressResidingYears(value);
      // setSelectedResidingIndex(value);
      setFieldValue('permanent_address_residing_years', value);
      // updateLeadDataOnBlur(currentLeadId, 'gender', value);
    },
    [currentLeadId, setFieldValue],
  );

  // useEffect(()=>{

  // },[selectedResidingYears])

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleOnPincodeChange = useCallback(async () => {
    if (!values.pincode || values.pincode.toString().length < 5 || errors.pincode) return;

    // const validStatePin = await checkIsValidStatePincode(values.reference_one_pincode);
    // if (!validStatePin) {
    //   setFieldError('reference_one_pincode', 'Invalid Pincode');
    //   return;
    // }
  }, [errors.pincode, values.pincode, setFieldError, setFieldValue]);

  console.log(values);

  return (
    <div className='bg-medium-grey p-4 flex flex-col gap-2'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          Type of residence <span className='text-primary-red text-xs'>*</span>
        </label>
        <h2 className='text-xs text-dark-grey'>
          If the applicant is in rented house, please enter permanent address too.
        </h2>
        <div
          className={`flex gap-4 w-full ${
            inputDisabled ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto'
          }`}
        >
          {residenceData.map((residence, index) => (
            <CardRadio
              key={index}
              label={residence.label}
              name='gender'
              value={residence.value}
              current={selectedResidence}
              onChange={onResidenceChange}
            >
              {residence.icon}
            </CardRadio>
          ))}
        </div>
      </div>
      
      {/* Current Address */}
      <label
        htmlFor='loan-purpose'
        className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
      >
        Current Address
      </label>

      <TextInput
        label='Flat no/Building name'
        placeholder='C-101'
        required
        name='current_address_flatNoBuidlingNo'
        value={values.current_address_flatNoBuidlingNo}
        error={errors.current_address_flatNoBuidlingNo}
        touched={touched.current_address_flatNoBuidlingNo}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Street/Area/Locality'
        placeholder='Senapati road'
        required
        name='current_address_streetAreaLocality'
        value={values.current_streetAreaLocality}
        error={errors.current_streetAreaLocality}
        touched={touched.current_streetAreaLocality}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Town'
        placeholder='Igatpuri'
        required
        name='current_address_town'
        value={values.current_address_town}
        error={errors.current_address_town}
        touched={touched.current_address_town}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Landmark'
        placeholder='Near apollo hospital'
        required
        name='current_address_landmark'
        value={values.current_address_landmark}
        error={errors.current_address_landmark}
        touched={touched.current_address_landmark}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Pincode'
        placeholder='Eg: 123456'
        required
        name='current_address_pincode'
        type='tel'
        hint='City and State fields will get filled based on Pincode'
        value={values.current_address_pincode}
        error={errors.current_address_pincode}
        touched={touched.current_address_pincode}
        disabled={inputDisabled}
        onBlur={(e) => {
          handleBlur(e);
          handleOnPincodeChange();
        }}
        min='0'
        onInput={(e) => {
          if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
        }}
        onChange={(e) => {
          if (e.currentTarget.value.length > 6) {
            e.preventDefault();
            return;
          }
          const value = e.currentTarget.value;
          if (value.charAt(0) === '0') {
            e.preventDefault();
            return;
          }
          handleChange(e);
        }}
        onKeyDown={(e) => {
          //capturing ctrl V and ctrl C
          (e.key == 'v' && (e.metaKey || e.ctrlKey)) ||
          DISALLOW_CHAR.includes(e.key) ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
            ? e.preventDefault()
            : null;
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
        onPaste={(e) => {
          e.preventDefault();
          const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
          e.target.value = text;
          handleChange(e);
        }}
        inputClasses='hidearrow'
      />

      <TextInput
        label='City'
        placeholder='Eg: Nashik'
        name='current_address_city'
        value={values.current_address_city}
        error={errors.current_address_city}
        touched={touched.current_address_city}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='State'
        placeholder='Eg: Maharashtra'
        name='current_address_state'
        value={values.current_address_state}
        error={errors.current_address_state}
        touched={touched.current_address_state}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          No. of years residing <span className='text-primary-red text-xs'>*</span>
        </label>
        <div
          className={`flex gap-4 w-full ${
            inputDisabled ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto'
          }`}
        >
          {yearsResidingData.map((data, index) => (
            <CardRadio
              key={index}
              name='years'
              value={data.value}
              current={currentAddressResidingYears}
              onChange={currentAddressYearsResidingChange}
            >
              <span
                className={`${
                  index == currentAddressResidingYears && 'text-secondary-green font-semibold'
                }`}
              >
                {data.label}
              </span>
            </CardRadio>
          ))}
        </div>
      </div>
      
      {/* Permanent Address */}
      <label
        htmlFor='loan-purpose'
        className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
      >
        Permanent Address
      </label>

      <TextInput
        label='Flat no/Building name'
        placeholder='C-101'
        required
        name='permanent_address_flatNoBuidlingNo'
        value={values.permanent_address_flatNoBuidlingNo}
        error={errors.permanent_address_flatNoBuidlingNo}
        touched={touched.permanent_address_flatNoBuidlingNo}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Street/Area/Locality'
        placeholder='Senapati road'
        required
        name='permanent_address_streetAreaLocality'
        value={values.permanent_address_streetAreaLocality}
        error={errors.permanent_address_streetAreaLocality}
        touched={touched.permanent_address_streetAreaLocality}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Town'
        placeholder='Igatpuri'
        required
        name='permanent_address_town'
        value={values.permanent_address_town}
        error={errors.permanent_address_town}
        touched={touched.permanent_address_town}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Landmark'
        placeholder='Near apollo hospital'
        required
        name='permanent_address_landmark'
        value={values.permanent_address_landmark}
        error={errors.permanent_address_landmark}
        touched={touched.permanent_address_landmark}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Pincode'
        placeholder='Eg: 123456'
        required
        name='permanent_address_pincode'
        type='tel'
        hint='City and State fields will get filled based on Pincode'
        value={values.permanent_address_pincode}
        error={errors.permanent_address_pincode}
        touched={touched.permanent_address_pincode}
        disabled={inputDisabled}
        onBlur={(e) => {
          handleBlur(e);
          handleOnPincodeChange();
        }}
        min='0'
        onInput={(e) => {
          if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
        }}
        onChange={(e) => {
          if (e.currentTarget.value.length > 6) {
            e.preventDefault();
            return;
          }
          const value = e.currentTarget.value;
          if (value.charAt(0) === '0') {
            e.preventDefault();
            return;
          }
          handleChange(e);
        }}
        onKeyDown={(e) => {
          //capturing ctrl V and ctrl C
          (e.key == 'v' && (e.metaKey || e.ctrlKey)) ||
          DISALLOW_CHAR.includes(e.key) ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
            ? e.preventDefault()
            : null;
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
        onPaste={(e) => {
          e.preventDefault();
          const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
          e.target.value = text;
          handleChange(e);
        }}
        inputClasses='hidearrow'
      />

      <TextInput
        label='City'
        placeholder='Eg: Nashik'
        name='permanent_address_city'
        value={values.permanent_address_city}
        error={errors.permanent_address_city}
        touched={touched.permanent_address_city}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='State'
        placeholder='Eg: Maharashtra'
        name='permanent_address_state'
        value={values.permanent_address_state}
        error={errors.permanent_address_state}
        touched={touched.permanent_address_state}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
          No. of years residing <span className='text-primary-red text-xs'>*</span>
        </label>
        <div
          className={`flex gap-4 w-full ${
            inputDisabled ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto'
          }`}
        >
          {yearsResidingData.map((data, index) => (
            <CardRadio
              key={index}
              name='years'
              value={data.value}
              current={permanentAddressResidingYears}
              onChange={permanentAddressYearsResidingChange}
            >
              <span
                className={`${
                  index == permanentAddressResidingYears && 'text-secondary-green font-semibold'
                }`}
              >
                {data.label}
              </span>
            </CardRadio>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
