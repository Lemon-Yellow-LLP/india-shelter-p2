import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { DropDown, TextInput } from '../../../../components';
import {
  addApi,
  checkIsValidStatePincode,
  editFieldsById,
  editReferenceById,
} from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { referenceDropdownOneOptions, referenceDropdownTwoOptions } from './ReferenceDropdowns';
import { defaultValuesLead } from '../../../../context/defaultValuesLead';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];
const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

const ReferenceDetails = () => {
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
    updateProgressApplicantSteps,
  } = useContext(LeadContext);
  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.reference_details?.extra_params?.required_fields_status,
  });

  useEffect(() => {
    updateProgressApplicantSteps('reference_details', requiredFieldsStatus, 'reference');
  }, [requiredFieldsStatus]);

  const updateFields = async (name, value) => {
    let newData = {};
    newData[name] = value;

    if (values?.reference_details?.id) {
      await editFieldsById(values?.reference_details?.id, 'reference', newData);
    } else {
      let addData = { ...defaultValuesLead.reference_details, [name]: value };
      await addApi('reference', {
        ...addData,
        lead_id: values?.lead?.id,
      })
        .then(async (res) => {
          setFieldValue(`reference_details.id`, res.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
      disableTwoOption(value);
      setFieldValue('reference_details.reference_1_type', value);

      if (!requiredFieldsStatus['reference_1_type']) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_1_type']: true }));
      }

      updateFields('reference_1_type', value);
    },
    [requiredFieldsStatus],
  );

  const handleReferenceTypeChangeTwo = useCallback(
    (value) => {
      disableOneOption(value);
      setFieldValue('reference_details.reference_2_type', value);

      if (!requiredFieldsStatus['reference_2_type']) {
        setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_type']: true }));
      }

      updateFields('reference_2_type', value);
    },
    [requiredFieldsStatus],
  );

  const handleTextInputChange = useCallback(
    (e) => {
      let value = e.currentTarget.value;
      const pattern = /^[a-zA-Z ]+$/;
      if (pattern.test(value) || value.length == 0) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      const name = e.target.name.split('.')[1];
      if (
        requiredFieldsStatus[name] !== undefined &&
        !requiredFieldsStatus[name] &&
        value.length > 1
      ) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleOnPincodeChangeOne = useCallback(async () => {
    if (
      !values?.reference_details?.reference_1_pincode ||
      values?.reference_details?.reference_1_pincode.toString().length < 5 ||
      errors?.reference_details?.reference_1_pincode
    ) {
      setFieldValue('reference_details.reference_1_city', '');
      setFieldValue('reference_details.reference_1_state', '');
      return;
    }

    const res = await checkIsValidStatePincode(values?.reference_details?.reference_1_pincode);
    if (!res) {
      setFieldError('reference_details.reference_1_pincode', 'Invalid Pincode');
      return;
    }

    editReferenceById(values?.reference_details?.id, {
      reference_1_city: res.city,
      reference_1_state: res.state,
    });

    setFieldValue('reference_details.reference_1_city', res.city);
    setFieldValue('reference_details.reference_1_state', res.state);

    if (!requiredFieldsStatus['reference_1_pincode']) {
      setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_1_pincode']: true }));
    }
  }, [
    errors?.reference_details?.reference_1_pincode,
    values?.reference_details?.reference_1_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  const handleOnPincodeChangeTwo = useCallback(async () => {
    if (
      !values?.reference_details?.reference_2_pincode ||
      values?.reference_details?.reference_2_pincode.toString().length < 5 ||
      errors?.reference_details?.reference_2_pincode
    ) {
      setFieldValue('reference_details.reference_2_city', '');
      setFieldValue('reference_details.reference_2_state', '');
      return;
    }

    const res = await checkIsValidStatePincode(values?.reference_details?.reference_2_pincode);
    if (!res) {
      setFieldError('reference_details.reference_2_pincode', 'Invalid Pincode');
      return;
    }

    editReferenceById(values?.reference_details?.id, {
      reference_2_city: res.city,
      reference_2_state: res.state,
    });

    setFieldValue('reference_details.reference_2_city', res.city);
    setFieldValue('reference_details.reference_2_state', res.state);

    if (!requiredFieldsStatus['reference_2_pincode']) {
      setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_pincode']: true }));
    }
  }, [
    errors.reference_details?.reference_2_pincode,
    values.reference_details?.reference_2_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  useEffect(() => {
    if (
      values?.reference_details?.reference_1_phone_number ===
        values?.reference_details?.reference_2_phone_number &&
      values?.reference_details?.reference_2_phone_number
    ) {
      setFieldError(
        'reference_details.reference_1_phone_number',
        'Reference phone number must be unique',
      );
    }
  }, [
    values?.reference_details?.reference_1_phone_number,
    setFieldError,
    errors?.reference_details?.reference_1_phone_number,
  ]);

  useEffect(() => {
    if (
      values?.reference_details?.reference_2_phone_number ===
        values?.reference_details?.reference_1_phone_number &&
      values?.reference_details?.reference_1_phone_number
    ) {
      setFieldError(
        'reference_details.reference_2_phone_number',
        'Reference phone number must be unique',
      );
    }
  }, [
    values?.reference_details?.reference_2_phone_number,
    setFieldError,
    errors?.reference_details?.reference_2_phone_number,
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
            defaultSelected={values?.reference_details?.reference_1_type}
            inputClasses='mt-2'
            name='reference_details.reference_1_type'
            error={errors?.reference_details?.reference_1_type}
            touched={touched?.reference_details?.reference_1_type}
            onBlur={(e) => {
              handleBlur(e);
            }}
          />

          <TextInput
            label='Full Name'
            placeholder='Eg: Pratik Akash Singh'
            required
            name='reference_details.reference_1_full_name'
            value={values?.reference_details?.reference_1_full_name}
            error={errors?.reference_details?.reference_1_full_name}
            touched={touched?.reference_details?.reference_1_full_name}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];

              if (
                !errors?.reference_details?.reference_1_full_name &&
                values?.reference_details?.reference_1_full_name
              ) {
                updateFields(
                  'reference_1_full_name',
                  values?.reference_details?.reference_1_full_name,
                );

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
            name='reference_details.reference_1_phone_number'
            type='tel'
            value={values?.reference_details?.reference_1_phone_number}
            error={errors?.reference_details?.reference_1_phone_number}
            touched={touched?.reference_details?.reference_1_phone_number}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];

              if (
                !errors?.reference_details?.reference_1_phone_number &&
                values?.reference_details?.reference_1_phone_number
              ) {
                updateFields(
                  'reference_1_phone_number',
                  values?.reference_details?.reference_1_phone_number,
                );

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
              e.target.value = text;
              handleChange(e);
            }}
            // disabled={inputDisabled || disablePhoneNumber}
            inputClasses='hidearrow'
          />

          <TextInput
            label='Address'
            placeholder='Eg: Near Sanjay hospital'
            required
            name='reference_details.reference_1_address'
            value={values?.reference_details?.reference_1_address}
            error={errors?.reference_details?.reference_1_address}
            touched={touched?.reference_details?.reference_1_address}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];
              if (
                !errors.reference_details?.reference_1_address &&
                values?.reference_details?.reference_1_address
              ) {
                updateFields('reference_1_address', values?.reference_details?.reference_1_address);

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
              }
            }}
            disabled={inputDisabled}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Pincode'
            placeholder='Eg: 123456'
            required
            name='reference_details.reference_1_pincode'
            type='tel'
            hint='City and State fields will get filled based on Pincode'
            value={values?.reference_details?.reference_1_pincode}
            error={errors?.reference_details?.reference_1_pincode}
            touched={touched?.reference_details?.reference_1_pincode}
            disabled={inputDisabled}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];
              handleOnPincodeChangeOne();
              if (
                !errors?.reference_details?.reference_1_pincode &&
                values?.reference_details?.reference_1_pincode
              ) {
                updateFields('reference_1_pincode', values?.reference_details?.reference_1_pincode);

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
            name='reference_details.reference_1_city'
            value={values?.reference_details?.reference_1_city}
            error={errors?.reference_details?.reference_1_city}
            touched={touched?.reference_details?.reference_1_city}
            onBlur={handleBlur}
            disabled={true}
            onChange={handleTextInputChange}
            labelDisabled={!values?.reference_details?.reference_1_city}
            inputClasses='capitalize'
          />

          <TextInput
            label='State'
            required
            placeholder='Eg: Maharashtra'
            name='reference_details.reference_1_state'
            value={values?.reference_details?.reference_1_state}
            error={errors?.reference_details?.reference_1_state}
            touched={touched?.reference_details?.reference_1_state}
            onBlur={handleBlur}
            disabled={true}
            onChange={handleTextInputChange}
            labelDisabled={!values?.reference_details?.reference_1_state}
            inputClasses='capitalize'
          />

          <TextInput
            label='Email'
            type='email'
            placeholder='Eg: xyz@gmail.com'
            name='reference_details.reference_1_email'
            autoComplete='off'
            value={values?.reference_details?.reference_1_email}
            error={errors?.reference_details?.reference_1_email}
            touched={touched.reference_details?.reference_1_email}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.reference_details?.reference_1_email &&
                values?.reference_details?.reference_1_email
              ) {
                updateFields('reference_1_email', values?.reference_details?.reference_1_email);
              }
            }}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const email_pattern = /^[a-zA-Z0-9\s,@\.\/]+$/;

              if (!email_pattern.test(value)) {
                return;
              }

              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
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
            defaultSelected={values?.reference_details?.reference_2_type}
            inputClasses='mt-2'
            name='reference_details.reference_2_type'
            error={errors?.reference_details?.reference_2_type}
            touched={touched?.reference_details?.reference_2_type}
            onBlur={(e) => {
              handleBlur(e);
            }}
          />

          <TextInput
            label='Full Name'
            placeholder='Eg: Pratik Akash Singh'
            required
            name='reference_details.reference_2_full_name'
            value={values?.reference_details?.reference_2_full_name}
            error={errors?.reference_details?.reference_2_full_name}
            touched={touched?.reference_details?.reference_2_full_name}
            onBlur={(e) => {
              const name = e.currentTarget.name.split('.')[1];
              handleBlur(e);
              if (
                !errors?.reference_details?.reference_2_full_name &&
                values?.reference_details?.reference_2_full_name
              ) {
                updateFields(
                  'reference_2_full_name',
                  values?.reference_details?.reference_2_full_name,
                );

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
            name='reference_details.reference_2_phone_number'
            type='tel'
            value={values?.reference_details?.reference_2_phone_number}
            error={errors?.reference_details?.reference_2_phone_number}
            touched={touched?.reference_details?.reference_2_phone_number}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];

              if (
                !errors.reference_details?.reference_2_phone_number &&
                values?.reference_details?.reference_2_phone_number
              ) {
                updateFields(
                  'reference_2_phone_number',
                  values?.reference_details?.reference_2_phone_number,
                );

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
              e.target.value = text;
              handleChange(e);
            }}
            // disabled={inputDisabled || disablePhoneNumber}
            inputClasses='hidearrow'
          />

          <TextInput
            label='Address'
            placeholder='Eg: Near Sanjay hospital'
            required
            name='reference_details.reference_2_address'
            value={values?.reference_details?.reference_2_address}
            error={errors?.reference_details?.reference_2_address}
            touched={touched?.reference_details?.reference_2_address}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];

              if (
                !errors.reference_details?.reference_2_address &&
                values?.reference_details?.reference_2_address
              ) {
                updateFields('reference_2_address', values?.reference_details?.reference_2_address);

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
              }
            }}
            disabled={inputDisabled}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
          />

          <TextInput
            label='Pincode'
            placeholder='Eg: 123456'
            required
            name='reference_details.reference_2_pincode'
            type='tel'
            hint='City and State fields will get filled based on Pincode'
            value={values?.reference_details?.reference_2_pincode}
            error={errors.reference_details?.reference_2_pincode}
            touched={touched.reference_details?.reference_2_pincode}
            disabled={inputDisabled}
            onBlur={(e) => {
              handleBlur(e);
              const name = e.currentTarget.name.split('.')[1];
              handleOnPincodeChangeTwo();
              if (
                !errors.reference_details?.reference_2_pincode &&
                values?.reference_details?.reference_2_pincode
              ) {
                updateFields('reference_2_pincode', values?.reference_details?.reference_2_pincode);

                if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                }
              } else {
                if (requiredFieldsStatus[name] !== undefined) {
                  setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                }
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
            name='reference_details.reference_2_city'
            value={values?.reference_details?.reference_2_city}
            error={errors?.reference_details?.reference_2_city}
            touched={touched?.reference_details?.reference_2_city}
            onBlur={handleBlur}
            disabled={true}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
            labelDisabled={!values?.reference_details?.reference_2_city}
          />

          <TextInput
            label='State'
            required
            placeholder='Eg: Maharashtra'
            name='reference_details.reference_2_state'
            value={values?.reference_details?.reference_2_state}
            error={errors?.reference_details?.reference_2_state}
            touched={touched?.reference_details?.reference_2_state}
            onBlur={handleBlur}
            disabled={true}
            onChange={handleTextInputChange}
            inputClasses='capitalize'
            labelDisabled={!values?.reference_details?.reference_2_state}
          />

          <TextInput
            label='Email'
            type='email'
            placeholder='Eg: xyz@gmail.com'
            name='reference_details.reference_2_email'
            autoComplete='off'
            value={values?.reference_details?.reference_2_email}
            error={errors?.reference_details?.reference_2_email}
            touched={touched?.reference_details?.reference_2_email}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.reference_details?.reference_2_email &&
                values?.reference_details?.reference_2_email
              ) {
                updateFields('reference_2_email', values?.reference_details?.reference_2_email);
              }
            }}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const email_pattern = /^[a-zA-Z0-9\s,@\.\/]+$/;

              if (!email_pattern.test(value)) {
                return;
              }

              handleChange(e);

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
          />
        </div>
      </div>

      <div className='bottom-0 fixed'>
        <PreviousNextButtons
          linkPrevious='/lead/banking-details'
          linkNext='/lead/upload-documents'
        />
      </div>
    </div>
  );
};

export default ReferenceDetails;
