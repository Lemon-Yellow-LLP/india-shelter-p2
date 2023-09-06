import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { DropDown, TextInput } from '../../../../components';
import { checkIsValidStatePincode, editReferenceById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';

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
const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

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
    updateProgress,
  } = useContext(AuthContext);
  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    reference_1_type: false,
    reference_1_full_name: false,
    reference_1_phone_number: false,
    reference_1_address: false,
    reference_1_pincode: false,

    reference_2_type: false,
    reference_2_full_name: false,
    reference_2_phone_number: false,
    reference_2_address: false,
    reference_2_pincode: false,
  });

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

      if (!requiredFieldsStatus['reference_1_type']) {
        updateProgress(6, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_1_type']: true }));
      }

      editReferenceById(2, {
        reference_1_type: value,
      });
    },
    [selectedReferenceTypeOne, requiredFieldsStatus],
  );

  const handleReferenceTypeChangeTwo = useCallback(
    (value) => {
      setSelectedReferenceTypeTwo(value);
      disableOneOption(value);
      setFieldValue('referenceSchema.reference_2_type', value);

      if (!requiredFieldsStatus['reference_2_type']) {
        updateProgress(6, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_type']: true }));
      }

      editReferenceById(2, {
        reference_2_type: value,
      });
    },
    [selectedReferenceTypeOne, requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /^[A-Za-z\s]+$/;
      if (pattern.exec(value[value.length - 1])) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      const name = e.target.name.split('.')[1];
      if (!requiredFieldsStatus[name]) {
        updateProgress(6, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleOnPincodeChangeOne = useCallback(async () => {
    if (
      !values.referenceSchema.reference_1_pincode ||
      values.referenceSchema.reference_1_pincode.toString().length < 5 ||
      errors.referenceSchema?.reference_1_pincode
    ) {
      setFieldValue('referenceSchema.reference_1_city', '');
      setFieldValue('referenceSchema.reference_1_state', '');
      return;
    }

    const res = await checkIsValidStatePincode(values.referenceSchema.reference_1_pincode);
    if (!res) {
      setFieldError('referenceSchema.reference_1_pincode', 'Invalid Pincode');
      return;
    }

    editReferenceById(2, {
      reference_1_city: res.city,
      reference_1_state: res.state,
    });

    setFieldValue('referenceSchema.reference_1_city', res.city);
    setFieldValue('referenceSchema.reference_1_state', res.state);

    if (!requiredFieldsStatus['reference_1_pincode']) {
      updateProgress(6, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_1_pincode']: true }));
    }
  }, [
    errors.referenceSchema?.reference_1_pincode,
    values.referenceSchema?.reference_1_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  const handleOnPincodeChangeTwo = useCallback(async () => {
    if (
      !values.referenceSchema.reference_2_pincode ||
      values.referenceSchema.reference_2_pincode.toString().length < 5 ||
      errors.referenceSchema?.reference_2_pincode
    ) {
      setFieldValue('referenceSchema.reference_2_city', '');
      setFieldValue('referenceSchema.reference_2_state', '');
      return;
    }

    const res = await checkIsValidStatePincode(values.referenceSchema.reference_2_pincode);
    if (!res) {
      setFieldError('referenceSchema.reference_2_pincode', 'Invalid Pincode');
      return;
    }

    editReferenceById(2, {
      reference_2_city: res.city,
      reference_2_state: res.state,
    });

    setFieldValue('referenceSchema.reference_2_city', res.city);
    setFieldValue('referenceSchema.reference_2_state', res.state);

    if (!requiredFieldsStatus['reference_2_pincode']) {
      updateProgress(6, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_pincode']: true }));
    }
  }, [
    errors.referenceSchema?.reference_2_pincode,
    values.referenceSchema?.reference_2_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <h2 className='text-xs text-dark-grey'>
          It is mandatory to fill in two reference details.
        </h2>
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='loan-purpose'
            className='flex gap-0.5 font-semibold text-primary-black text-xl mt-3'
          >
            Reference detail 1 <span className='text-primary-red text-xs pt-1'>*</span>
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
            onBlur={(e) => {
              handleBlur(e);
            }}
          />

          <TextInput
            label='Full Name'
            placeholder='Eg: Pratik Akash Singh'
            required
            name='referenceSchema.reference_1_full_name'
            value={values.referenceSchema.reference_1_full_name}
            error={errors.referenceSchema?.reference_1_full_name}
            touched={touched.referenceSchema?.reference_1_full_name}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_1_full_name &&
                values.referenceSchema.reference_1_full_name
              ) {
                editReferenceById(2, {
                  reference_1_full_name: values.referenceSchema.reference_1_full_name,
                });
              }
            }}
            disabled={inputDisabled}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Mobile number'
            placeholder='Eg: 123456789'
            required
            name='referenceSchema.reference_1_phone_number'
            type='tel'
            value={values.referenceSchema.reference_1_phone_number}
            error={errors.referenceSchema?.reference_1_phone_number}
            touched={touched.referenceSchema?.reference_1_phone_number}
            onBlur={(e) => {
              if (
                values.referenceSchema.reference_2_phone_number === e.target.value &&
                values.referenceSchema.reference_1_phone_number
              ) {
                setFieldError(
                  'referenceSchema.reference_1_phone_number',
                  'Reference phone number must be unique',
                );
                return;
              } else {
                handleBlur(e);
              }

              if (
                !errors.referenceSchema?.reference_1_phone_number &&
                values.referenceSchema.reference_1_phone_number
              ) {
                editReferenceById(2, {
                  reference_1_phone_number: values.referenceSchema.reference_1_phone_number,
                });
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
            onInput={(e) => {
              if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
            }}
            onChange={(e) => {
              if (values.referenceSchema.reference_2_phone_number === e.currentTarget.value) {
                setFieldError('referenceSchema.reference_1_phone_number', '');
              }
              const phoneNumber = e.currentTarget.value;
              if (phoneNumber < 0) {
                e.preventDefault();
                return;
              }
              if (phoneNumber.length > 10) {
                return;
              }
              if (DISALLOW_NUM.includes(phoneNumber)) {
                e.preventDefault();
                return;
              }
              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
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
                  'referenceSchema.reference_1_phone_number',
                  values.referenceSchema.reference_1_phone_number.slice(
                    0,
                    values.referenceSchema.reference_1_phone_number.length - 1,
                  ),
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
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_1_address &&
                values.referenceSchema.reference_1_address
              ) {
                editReferenceById(2, {
                  reference_1_address: values.referenceSchema.reference_1_address,
                });
              }
            }}
            disabled={inputDisabled}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
              if (address_pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
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
              if (
                !errors.referenceSchema?.reference_1_pincode &&
                values.referenceSchema.reference_1_pincode
              ) {
                editReferenceById(2, {
                  reference_1_pincode: values.referenceSchema.reference_1_pincode,
                });
              }
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

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
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
            required
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
            required
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
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_1_email &&
                values.referenceSchema.reference_1_email
              ) {
                editReferenceById(2, {
                  reference_1_email: values.referenceSchema.reference_1_email,
                });
              }
            }}
            onChange={(e) => {
              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label
            htmlFor='loan-purpose'
            className='flex gap-0.5 font-semibold text-primary-black text-xl mt-3'
          >
            Reference detail 2 <span className='text-primary-red text-xs pt-1'>*</span>
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
            onBlur={(e) => {
              handleBlur(e);
            }}
          />

          <TextInput
            label='Full Name'
            placeholder='Eg: Pratik Akash Singh'
            required
            name='referenceSchema.reference_2_full_name'
            value={values.referenceSchema.reference_2_full_name}
            error={errors.referenceSchema?.reference_2_full_name}
            touched={touched.referenceSchema?.reference_2_full_name}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_2_full_name &&
                values.referenceSchema.reference_2_full_name
              ) {
                editReferenceById(2, {
                  reference_2_full_name: values.referenceSchema.reference_2_full_name,
                });
              }
            }}
            disabled={inputDisabled}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Mobile number'
            placeholder='Eg: 123456789'
            required
            name='referenceSchema.reference_2_phone_number'
            type='tel'
            value={values.referenceSchema.reference_2_phone_number}
            error={errors.referenceSchema?.reference_2_phone_number}
            touched={touched.referenceSchema?.reference_2_phone_number}
            onBlur={(e) => {
              if (
                values.referenceSchema.reference_1_phone_number === e.target.value &&
                values.referenceSchema.reference_2_phone_number
              ) {
                setFieldError(
                  'referenceSchema.reference_2_phone_number',
                  'Reference phone number must be unique',
                );
                return;
              } else {
                handleBlur(e);
              }

              if (
                !errors.referenceSchema?.reference_2_phone_number &&
                values.referenceSchema.reference_2_phone_number
              ) {
                editReferenceById(2, {
                  reference_2_phone_number: values.referenceSchema.reference_2_phone_number,
                });
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
            onInput={(e) => {
              if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
            }}
            onChange={(e) => {
              if (values.referenceSchema.reference_1_phone_number === e.currentTarget.value) {
                setFieldError('referenceSchema.reference_2_phone_number', '');
              }
              const phoneNumber = e.currentTarget.value;
              if (phoneNumber < 0) {
                e.preventDefault();
                return;
              }
              if (phoneNumber.length > 10) {
                return;
              }
              if (DISALLOW_NUM.includes(phoneNumber)) {
                e.preventDefault();
                return;
              }
              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
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
                  'referenceSchema.reference_2_phone_number',
                  values.referenceSchema.reference_2_phone_number.slice(
                    0,
                    values.referenceSchema.reference_2_phone_number.length - 1,
                  ),
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
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_2_address &&
                values.referenceSchema.reference_2_address
              ) {
                editReferenceById(2, {
                  reference_2_address: values.referenceSchema.reference_2_address,
                });
              }
            }}
            disabled={inputDisabled}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
              if (address_pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
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
              if (
                !errors.referenceSchema?.reference_2_pincode &&
                values.referenceSchema.reference_2_pincode
              ) {
                editReferenceById(2, {
                  reference_2_pincode: values.referenceSchema.reference_2_pincode,
                });
              }
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

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
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
            required
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
            required
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
              handleBlur(e);
              if (
                !errors.referenceSchema?.reference_2_email &&
                values.referenceSchema.reference_2_email
              ) {
                editReferenceById(2, {
                  reference_2_email: values.referenceSchema.reference_2_email,
                });
              }
            }}
            onChange={(e) => {
              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(6, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
          />
        </div>
      </div>

      {/* <PreviousNextButtons linkPrevious='/lead/banking-details' linkNext='/lead/upload-documents' /> */}
    </div>
  );
};

export default ReferenceDetails;
