import { useCallback, useContext } from 'react';
import { DropDown, TextInput } from '../../../../components/index';
import { AuthContext } from '../../../../context/AuthContext';

const fieldsRequiredForLeadGeneration = ['first_name', 'phone_number', 'pincode'];
const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];
const disableNextFields = ['loan_request_amount', 'first_name', 'pincode', 'phone_number'];

const ReferenceForm = ({ count, selectedReferenceType, options, callback }) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    inputDisabled,
    setFieldValue,
    setInputDisabled,
  } = useContext(AuthContext);

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;
    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }
    if (phoneNumber.length >= 10) {
      return;
    }
    if (phoneNumber.charAt(0) === '0') {
      e.preventDefault();
      return;
    }
    setFieldValue('phone_number', phoneNumber);
  }, []);

  // const handleOnEmailBlur = useCallback(
  //   async (email) => {
  //     await editLeadById(currentLeadId, { email });
  //   },
  //   [currentLeadId],
  // );

  return (
    <div className='flex flex-col gap-2'>
      <label
        htmlFor='loan-purpose'
        className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
      >
        Reference detail {count} <span className='text-primary-red text-xs'>*</span>
      </label>

      <DropDown
        label='Reference type'
        required
        options={options}
        placeholder='Choose reference type'
        onChange={callback}
        defaultSelected={selectedReferenceType}
        inputClasses='mt-2'
      />

      <TextInput
        label='Full Name'
        placeholder='Eg: Pratik Akash Singh'
        required
        name='full_name'
        value={values.full_name}
        error={errors.full_name}
        touched={touched.full_name}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Mobile number'
        placeholder='Please enter 10 digit mobile no'
        required
        name='phone_number'
        type='tel'
        value={values.phone_number}
        error={errors.phone_number}
        touched={touched.phone_number}
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
            setFieldValue(
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
        // disabled={inputDisabled || disablePhoneNumber}
        inputClasses='hidearrow'
      />

      <TextInput
        label='Address'
        placeholder='Eg: Near Sanjay hospital'
        required
        name='address'
        value={values.address}
        error={errors.address}
        touched={touched.address}
        onBlur={handleBlur}
        disabled={inputDisabled}
        onChange={handleChange}
        inputClasses='capitalize'
        maxLength={90}
      />

      <TextInput
        label='Pincode'
        placeholder='Eg: 123456'
        required
        name='pincode'
        type='tel'
        hint='City and State fields will get filled based on Pincode'
        value={values.pincode}
        error={errors.pincode}
        touched={touched.pincode}
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
        name='city'
        value={values.city}
        error={errors.city}
        touched={touched.city}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='State'
        placeholder='Eg: Maharashtra'
        name='state'
        value={values.state}
        error={errors.state}
        touched={touched.state}
        onBlur={handleBlur}
        disabled={true}
        onChange={handleTextInputChange}
        inputClasses='capitalize'
      />

      <TextInput
        label='Email'
        type='email'
        value={values.email}
        placeholder='Eg: xyz@gmail.com'
        name='email'
        autoComplete='off'
        error={errors.email}
        touched={touched.email}
        onBlur={(e) => {
          const target = e.currentTarget;
          handleOnEmailBlur(target.value);
          handleBlur(e);
          checkEmailValid(e);
          updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
        }}
        // disabled={disableEmailInput}
        // onInput={checkEmailValid}
        onChange={(e) => {
          // checkEmailValid(e);
          handleChange(e);
        }}
        // message={
        //   emailOTPVerified
        //     ? `OTP Verfied
        // <img src="${otpVerified}" alt='Otp Verified' role='presentation' />
        // `
        //     : null
        // }
      />
    </div>
  );
};

export default ReferenceForm;
