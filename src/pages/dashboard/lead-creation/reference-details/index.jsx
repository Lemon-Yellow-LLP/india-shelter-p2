import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { DropDown, TextInput } from '../../../../components';
import { checkIsValidStatePincode } from '../../../../global';

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

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

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
      setFieldValue('referenceSchema.reference_1_type', value);
    },
    [selectedReferenceTypeOne],
  );

  const handleReferenceTypeChangeTwo = useCallback(
    (value) => {
      setSelectedReferenceTypeTwo(value);
      disableOneOption(value);
      setFieldValue('referenceSchema.reference_2_type', value);
    },
    [selectedReferenceTypeOne],
  );

  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z\/-\s]+$/;
    if (pattern.exec(value[value.length - 1])) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, []);

  const handleOnPincodeChangeOne = useCallback(async () => {
    if (
      !values.referenceSchema.reference_1_pincode ||
      values.referenceSchema.reference_1_pincode.toString().length < 5
      // errors.referenceSchema.reference_1_pincode
    )
      return;

    const res = await checkIsValidStatePincode(values.referenceSchema.reference_1_pincode);
    if (!res) {
      setFieldError('referenceSchema.reference_1_pincode', 'Invalid Pincode');
      return;
    }

    setFieldValue('referenceSchema.reference_1_city', res.city);
    setFieldValue('referenceSchema.reference_1_state', res.state);
  }, [
    errors.referenceSchema?.reference_1_pincode,
    values.referenceSchema?.reference_1_pincode,
    setFieldError,
    setFieldValue,
  ]);

  const handleOnPincodeChangeTwo = useCallback(async () => {
    if (
      !values.referenceSchema.reference_2_pincode ||
      values.referenceSchema.reference_2_pincode.toString().length < 5
      // errors.referenceSchema.reference_2_pincode
    )
      return;

    const res = await checkIsValidStatePincode(values.referenceSchema.reference_2_pincode);
    if (!res) {
      setFieldError('referenceSchema.reference_2_pincode', 'Invalid Pincode');
      return;
    }

    setFieldValue('referenceSchema.reference_2_city', res.city);
    setFieldValue('referenceSchema.reference_2_state', res.state);
  }, [
    errors.referenceSchema?.reference_2_pincode,
    values.referenceSchema?.reference_2_pincode,
    setFieldError,
    setFieldValue,
  ]);

  console.log('values', values);
  console.log(errors);
  console.log(touched);

  return (
    <div className='flex flex-col bg-medium-grey gap-2 h-[95vh] overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[62px]'>
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
          name='referenceSchema.reference_1_type'
          error={errors.referenceSchema?.reference_1_type}
          touched={touched.referenceSchema?.reference_1_type}
          onBlur={handleBlur}
        />

        <TextInput
          label='Full Name'
          placeholder='Eg: Pratik Akash Singh'
          required
          name='referenceSchema.reference_1_full_name'
          value={values.referenceSchema.reference_1_full_name}
          error={errors.referenceSchema?.reference_1_full_name}
          touched={touched.referenceSchema?.reference_1_full_name}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Mobile number'
          placeholder='Please enter 10 digit mobile no'
          required
          name='referenceSchema.reference_1_phone_number'
          type='tel'
          value={values.referenceSchema.reference_1_phone_number}
          error={errors.referenceSchema?.reference_1_phone_number}
          touched={touched.referenceSchema?.reference_1_phone_number}
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
          name='referenceSchema.reference_1_address'
          value={values.referenceSchema.reference_1_address}
          error={errors.referenceSchema?.reference_1_address}
          touched={touched.referenceSchema?.reference_1_address}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
            if (address_pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }
          }}
          inputClasses='capitalize'
          maxLength={90}
        />

        <TextInput
          label='Pincode'
          placeholder='Eg: 123456'
          required
          name='referenceSchema.reference_1_pincode'
          type='tel'
          hint='City and State fields will get filled based on Pincode'
          value={values.referenceSchema.reference_1_pincode}
          error={errors.referenceSchema?.reference_1_pincode}
          touched={touched.referenceSchema?.reference_1_pincode}
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
          name='referenceSchema.reference_1_city'
          value={values.referenceSchema.reference_1_city}
          error={errors.referenceSchema?.reference_1_city}
          touched={touched.referenceSchema?.reference_1_city}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='State'
          placeholder='Eg: Maharashtra'
          name='referenceSchema.reference_1_state'
          value={values.referenceSchema.reference_1_state}
          error={errors.referenceSchema?.reference_1_state}
          touched={touched.referenceSchema?.reference_1_state}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Email'
          type='email'
          placeholder='Eg: xyz@gmail.com'
          name='referenceSchema.reference_1_email'
          autoComplete='off'
          value={values.referenceSchema.reference_1_email}
          error={errors.referenceSchema?.reference_1_email}
          touched={touched.referenceSchema?.reference_1_email}
          onBlur={(e) => {
            const target = e.currentTarget;
            // handleOnEmailBlur(target.value);
            handleBlur(e);
            // editReferenceById(currentLeadId, {reference_1_email: target.value});
            // updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
          }}
          // disabled={disableEmailInput}
          onChange={(e) => {
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
          name='referenceSchema.reference_2_type'
          error={errors.referenceSchema?.reference_2_type}
          touched={touched.referenceSchema?.reference_2_type}
          onBlur={handleBlur}
        />

        <TextInput
          label='Full Name'
          placeholder='Eg: Pratik Akash Singh'
          required
          name='referenceSchema.reference_2_full_name'
          value={values.referenceSchema.reference_2_full_name}
          error={errors.referenceSchema?.reference_2_full_name}
          touched={touched.referenceSchema?.reference_2_full_name}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Mobile number'
          placeholder='Please enter 10 digit mobile no'
          required
          name='referenceSchema.reference_2_phone_number'
          type='tel'
          value={values.referenceSchema.reference_2_phone_number}
          error={errors.referenceSchema?.reference_2_phone_number}
          touched={touched.referenceSchema?.reference_2_phone_number}
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
          name='referenceSchema.reference_2_address'
          value={values.referenceSchema.reference_2_address}
          error={errors.referenceSchema?.reference_2_address}
          touched={touched.referenceSchema?.reference_2_address}
          onBlur={handleBlur}
          disabled={inputDisabled}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
            if (address_pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }
          }}
          inputClasses='capitalize'
          maxLength={90}
        />

        <TextInput
          label='Pincode'
          placeholder='Eg: 123456'
          required
          name='referenceSchema.reference_2_pincode'
          type='tel'
          hint='City and State fields will get filled based on Pincode'
          value={values.referenceSchema.reference_2_pincode}
          error={errors.referenceSchema?.reference_2_pincode}
          touched={touched.referenceSchema?.reference_2_pincode}
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
          name='referenceSchema.reference_2_city'
          value={values.referenceSchema.reference_2_city}
          error={errors.referenceSchema?.reference_2_city}
          touched={touched.referenceSchema?.reference_2_city}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='State'
          placeholder='Eg: Maharashtra'
          name='referenceSchema.reference_2_state'
          value={values.referenceSchema.reference_2_state}
          error={errors.referenceSchema?.reference_2_state}
          touched={touched.referenceSchema?.reference_2_state}
          onBlur={handleBlur}
          disabled={true}
          onChange={handleTextInputChange}
          inputClasses='capitalize'
        />

        <TextInput
          label='Email'
          type='email'
          placeholder='Eg: xyz@gmail.com'
          name='referenceSchema.reference_2_email'
          autoComplete='off'
          value={values.referenceSchema.reference_2_email}
          error={errors.referenceSchema?.reference_2_email}
          touched={touched.referenceSchema?.reference_2_email}
          onBlur={(e) => {
            const target = e.currentTarget;
            // handleOnEmailBlur(target.value);
            handleBlur(e);
            // updateLeadDataOnBlur(currentLeadId, target.getAttribute('name'), target.value);
          }}
          // disabled={disableEmailInput}
          onChange={handleChange}
        />

        <span className='mt-1'></span>
      </div>
    </div>
  );
};

export default ReferenceDetails;
