import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { DropDown, TextInput } from '../../../../components';

const referenceDropdownOneOptions = [
  {
    label: 'Relative/Friend',
    value: 'relative-friend',
  },
  {
    label: 'Current Employer/Contractor',
    value: 'current-employer-contractor',
  },
  {
    label: 'Colleague',
    value: 'colleague',
  },
  {
    label: 'Business Neighbour',
    value: 'business-neighbour',
  },
  {
    label: 'Customer/Client',
    value: 'customer-client',
  },
  {
    label: 'Supplier',
    value: 'supplier',
  },
  {
    label: 'Business Place Landlord',
    value: 'business-place-landlord',
  },
  {
    label: 'Supervisor',
    value: 'supervisor',
  },
];

const referenceDropdownTwoOptions = [
  {
    label: 'Relative/Friend',
    value: 'relative-friend',
  },
  {
    label: 'Current Employer/Contractor',
    value: 'current-employer-contractor',
  },
  {
    label: 'Colleague',
    value: 'colleague',
  },
  {
    label: 'Business Neighbour',
    value: 'business-neighbour',
  },
  {
    label: 'Customer/Client',
    value: 'customer-client',
  },
  {
    label: 'Supplier',
    value: 'supplier',
  },
  {
    label: 'Business Place Landlord',
    value: 'business-place-landlord',
  },
  {
    label: 'Supervisor',
    value: 'supervisor',
  },
];

// const fieldsRequiredForLeadGeneration = ['first_name', 'phone_number', 'pincode'];
const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];
// const disableNextFields = ['loan_request_amount', 'first_name', 'pincode', 'phone_number'];

const ReferenceDetails = () => {
  const [selectedReferenceTypeOne, setSelectedReferenceTypeOne] = useState(null);
  const [selectedReferenceTypeTwo, setSelectedReferenceTypeTwo] = useState(null);
  const [referenceOneOptions, setReferenceOneOptions] = useState(referenceDropdownOneOptions);
  const [referenceTwoOptions, setReferenceTwoOptions] = useState(referenceDropdownTwoOptions);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    inputDisabled,
    setFieldValue,
    setFieldError,
  } = useContext(AuthContext);

  function disableOneOption(value) {
    setReferenceOneOptions((prev) => {
      return prev.map((option) => {
        if (option.value === value) option['disabled'] = true;
        else option['disabled'] = false;
        return option;
      });
    });
  }

  function disableTwoOption(value) {
    setReferenceTwoOptions((prev) => {
      return prev.map((option) => {
        if (option.value === value) option['disabled'] = true;
        else option['disabled'] = false;
        return option;
      });
    });
  }

  const handleReferenceTypeChangeOne = useCallback(
    (value) => {
      setSelectedReferenceTypeOne(value);
      disableTwoOption(value);
      setFieldValue('reference_one_type', value);
    },
    [selectedReferenceTypeOne],
  );

  const handleReferenceTypeChangeTwo = useCallback(
    (value) => {
      setSelectedReferenceTypeTwo(value);
      disableOneOption(value);
      setFieldValue('reference_two_type', value);
    },
    [selectedReferenceTypeOne],
  );

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleOnPincodeChangeOne = useCallback(async () => {
    if (
      !values.reference_one_pincode ||
      values.reference_one_pincode.toString().length < 5 ||
      errors.reference_one_pincode
    )
      return;

    // const validStatePin = await checkIsValidStatePincode(values.reference_one_pincode);
    // if (!validStatePin) {
    //   setFieldError('reference_one_pincode', 'Invalid Pincode');
    //   return;
    // }
  }, [errors.reference_one_pincode, values.reference_one_pincode, setFieldError, setFieldValue]);

  const handleOnPincodeChangeTwo = useCallback(async () => {
    if (
      !values.reference_two_pincode ||
      values.reference_two_pincode.toString().length < 5 ||
      errors.reference_two_pincode
    )
      return;

    // const validStatePin = await checkIsValidStatePincode(values.reference_two_pincode);
    // if (!validStatePin) {
    //   setFieldError('reference_two_pincode', 'Invalid Pincode');
    //   return;
    // }
  }, [errors.reference_two_pincode, values.reference_two_pincode, setFieldError, setFieldValue]);

  // const handleOnEmailBlur = useCallback(
  //   async (email) => {
  //     await editLeadById(currentLeadId, { email });
  //   },
  //   [currentLeadId],
  // );

  console.log(values);

  return (
    <div className='bg-medium-grey p-4'>
      <h2 className='text-xs text-dark-grey'>It is mandatory to fill in two reference details.</h2>
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='loan-purpose'
          className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
        >
          Reference detail 1 <span className='text-primary-red text-xs'>*</span>
        </label>

        <DropDown
          label='Reference type'
          required
          options={referenceOneOptions}
          placeholder='Choose reference type'
          onChange={handleReferenceTypeChangeOne}
          defaultSelected={selectedReferenceTypeOne}
          inputClasses='mt-2'
        />

        <TextInput
          label='Full Name'
          placeholder='Eg: Pratik Akash Singh'
          required
          name='reference_one_full_name'
          value={values.reference_one_full_name}
          error={errors.reference_one_full_name}
          touched={touched.reference_one_full_name}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={handleChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Mobile number'
          placeholder='Please enter 10 digit mobile no'
          required
          name='reference_one_phone_number'
          type='tel'
          value={values.reference_one_phone_number}
          error={errors.reference_one_phone_number}
          touched={touched.reference_one_phone_number}
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
          onChange={(e) => {
            const phoneNumber = e.currentTarget.value;
            if (phoneNumber < 0) {
              e.preventDefault();
              return;
            }
            if (phoneNumber.length > 10) {
              return;
            }
            if (phoneNumber.charAt(0) === '0') {
              e.preventDefault();
              return;
            }
            handleChange(e);
          }}
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
          name='reference_one_address'
          value={values.reference_one_address}
          error={errors.reference_one_address}
          touched={touched.reference_one_address}
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
          name='reference_one_pincode'
          type='tel'
          hint='City and State fields will get filled based on Pincode'
          value={values.reference_one_pincode}
          error={errors.reference_one_pincode}
          touched={touched.reference_one_pincode}
          disabled={inputDisabled}
          onBlur={(e) => {
            handleBlur(e);
            handleOnPincodeChangeOne();
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
          name='reference_one_city'
          value={values.reference_one_city}
          error={errors.reference_one_city}
          touched={touched.reference_one_city}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='State'
          placeholder='Eg: Maharashtra'
          name='reference_one_state'
          value={values.reference_one_state}
          error={errors.reference_one_state}
          touched={touched.reference_one_state}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Email'
          type='email'
          placeholder='Eg: xyz@gmail.com'
          name='reference_one_email'
          autoComplete='off'
          value={values.reference_one_email}
          error={errors.reference_one_email}
          touched={touched.reference_one_email}
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
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='loan-purpose'
          className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
        >
          Reference detail 2 <span className='text-primary-red text-xs'>*</span>
        </label>

        <DropDown
          label='Reference type'
          required
          options={referenceTwoOptions}
          placeholder='Choose reference type'
          onChange={handleReferenceTypeChangeTwo}
          defaultSelected={selectedReferenceTypeTwo}
          inputClasses='mt-2'
        />

        <TextInput
          label='Full Name'
          placeholder='Eg: Pratik Akash Singh'
          required
          name='reference_two_full_name'
          value={values.reference_two_full_name}
          error={errors.reference_two_full_name}
          touched={touched.reference_two_full_name}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={handleChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Mobile number'
          placeholder='Please enter 10 digit mobile no'
          required
          name='reference_two_phone_number'
          type='tel'
          value={values.reference_two_phone_number}
          error={errors.reference_two_phone_number}
          touched={touched.reference_two_phone_number}
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
          onChange={(e) => {
            const phoneNumber = e.currentTarget.value;
            if (phoneNumber < 0) {
              e.preventDefault();
              return;
            }
            if (phoneNumber.length > 10) {
              return;
            }
            if (phoneNumber.charAt(0) === '0') {
              e.preventDefault();
              return;
            }
            handleChange(e);
            // setFieldValue('reference_two_phone_number', phoneNumber);
          }}
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
          name='reference_two_address'
          value={values.reference_two_address}
          error={errors.reference_two_address}
          touched={touched.reference_two_address}
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
          name='reference_two_pincode'
          type='tel'
          hint='City and State fields will get filled based on Pincode'
          value={values.reference_two_pincode}
          error={errors.reference_two_pincode}
          touched={touched.reference_two_pincode}
          disabled={inputDisabled}
          onBlur={(e) => {
            handleBlur(e);
            handleOnPincodeChangeTwo();
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
          name='reference_two_city'
          value={values.reference_two_city}
          error={errors.reference_two_city}
          touched={touched.reference_two_city}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='State'
          placeholder='Eg: Maharashtra'
          name='reference_two_state'
          value={values.reference_two_state}
          error={errors.reference_two_state}
          touched={touched.reference_two_state}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Email'
          type='email'
          placeholder='Eg: xyz@gmail.com'
          name='reference_two_email'
          autoComplete='off'
          value={values.reference_two_email}
          error={errors.reference_two_email}
          touched={touched.reference_two_email}
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
        />
      </div>
    </div>
  );
};

export default ReferenceDetails;
