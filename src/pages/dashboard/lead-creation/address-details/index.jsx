import { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import IconRent from '../../../../assets/icons/rent';
import { CardRadio, TextInput } from '../../../../components';
import IconSelfOwned from '../../../../assets/icons/self-owned';
import { checkIsValidStatePincode, editAddressById } from '../../../../global';
import Checkbox from '../../../../components/Checkbox';

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
const TEST_ADDRESS_ID = 1;

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
    updateProgress,
  } = useContext(AuthContext);
  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    type_of_residence: false,
    current_flat_no_building_name: false,
    current_street_area_locality: false,
    current_town: false,
    current_landmark: false,
    current_pincode: false,
    current_no_of_year_residing: false,
    current_no_of_year_residing: false,
    permanent_flat_no_building_name: false,
    permanent_street_area_locality: false,
    permanent_town: false,
    permanent_landmark: false,
    permanent_pincode: false,
    permanent_no_of_year_residing: false,
  });

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue('addressSchema.' + e.name, e.value);

      editAddressById(TEST_ADDRESS_ID, {
        // 'type_of_residence' is named as 'current_type_of_residence' in db
        [e.name === 'type_of_residence' ? 'current_type_of_residence' : e.name]: e.value,
      });

      if (
        values.addressSchema.extra_params.permanent_address_same_as_current &&
        e.name === 'current_no_of_year_residing'
      ) {
        setFieldValue('addressSchema.permanent_no_of_year_residing', e.value);
        editAddressById(TEST_ADDRESS_ID, {
          permanent_no_of_year_residing: values.addressSchema.current_no_of_year_residing,
        });
      }

      const name = e.name.split('.')[0];

      if (!requiredFieldsStatus[name]) {
        updateProgress(2, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus, setFieldValue],
  );

  const handleCurrentPincodeChange = useCallback(async () => {
    if (
      !values.addressSchema.current_pincode ||
      values.addressSchema.current_pincode.toString().length < 5
    )
      return;

    const res = await checkIsValidStatePincode(values.addressSchema.current_pincode);
    if (!res) {
      setFieldError('addressSchema.current_pincode', 'Invalid Pincode');
      return;
    }

    editAddressById(TEST_ADDRESS_ID, {
      current_city: res.city,
      current_state: res.state,
    });

    setFieldValue('addressSchema.current_city', res.city);
    setFieldValue('addressSchema.current_state', res.state);

    if (values.addressSchema.extra_params.permanent_address_same_as_current) {
      editAddressById(TEST_ADDRESS_ID, {
        permanent_city: res.city,
        permanent_state: res.state,
      });

      setFieldValue('addressSchema.permanent_city', res.city);
      setFieldValue('addressSchema.permanent_state', res.state);
    }

    if (!requiredFieldsStatus['current_pincode']) {
      updateProgress(2, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['current_pincode']: true }));
    }
  }, [
    errors.addressSchema?.current_pincode,
    values.addressSchema?.current_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  useEffect(() => {
    if (values.addressSchema.extra_params?.permanent_address_same_as_current) {
      setFieldValue(
        'addressSchema.permanent_flat_no_building_name',
        values.addressSchema.current_flat_no_building_name,
      );
      setFieldValue(
        'addressSchema.permanent_street_area_locality',
        values.addressSchema.current_street_area_locality,
      );
      setFieldValue('addressSchema.permanent_town', values.addressSchema.current_town);
      setFieldValue('addressSchema.permanent_landmark', values.addressSchema.current_landmark);
      setFieldValue('addressSchema.permanent_pincode', values.addressSchema.current_pincode);
      setFieldValue('addressSchema.permanent_city', values.addressSchema.current_city);
      setFieldValue('addressSchema.permanent_state', values.addressSchema.current_state);
      setFieldValue(
        'addressSchema.permanent_no_of_year_residing',
        values.addressSchema.current_no_of_year_residing,
      );
    } else {
      setFieldValue('addressSchema.permanent_flat_no_building_name', '');
      setFieldValue('addressSchema.permanent_street_area_locality', '');
      setFieldValue('addressSchema.permanent_town', '');
      setFieldValue('addressSchema.permanent_landmark', '');
      setFieldValue('addressSchema.permanent_pincode', '');
      setFieldValue('addressSchema.permanent_city', '');
      setFieldValue('addressSchema.permanent_state', '');
      setFieldValue('addressSchema.permanent_no_of_year_residing', null);
    }
    if (values.addressSchema.type_of_residence) {
      editAddressById(TEST_ADDRESS_ID, {
        permanent_flat_no_building_name: values.addressSchema.current_flat_no_building_name,
        permanent_street_area_locality: values.addressSchema.current_street_area_locality,
        permanent_town: values.addressSchema.current_town,
        permanent_landmark: values.addressSchema.current_landmark,
        permanent_pincode: values.addressSchema.current_pincode,
        permanent_city: values.addressSchema.current_city,
        permanent_state: values.addressSchema.current_state,
        permanent_no_of_year_residing: values.addressSchema.current_no_of_year_residing,
      });
    }
  }, [values.addressSchema.extra_params.permanent_address_same_as_current]);

  useEffect(() => {
    if (values.addressSchema.type_of_residence === 'Rented') {
      setFieldValue('addressSchema.extra_params.permanent_address_same_as_current', false);
    }
  }, [values.addressSchema.type_of_residence]);

  const handlePermanentPincodeChange = useCallback(async () => {
    if (
      !values.addressSchema.permanent_pincode ||
      values.addressSchema.permanent_pincode.toString().length < 5
    )
      return;

    const res = await checkIsValidStatePincode(values.addressSchema.permanent_pincode);
    if (!res) {
      setFieldError('addressSchema.permanent_pincode', 'Invalid Pincode');
      return;
    }

    editAddressById(TEST_ADDRESS_ID, {
      permanent_city: res.city,
      permanent_state: res.state,
    });

    setFieldValue('addressSchema.permanent_city', res.city);
    setFieldValue('addressSchema.permanent_state', res.state);

    if (!requiredFieldsStatus['permanent_pincode']) {
      updateProgress(2, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['permanent_pincode']: true }));
    }
  }, [
    errors.addressSchema?.permanent_pincode,
    values.addressSchema?.permanent_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  return (
    <div className='flex flex-col bg-medium-grey gap-2 h-[95vh] overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[62px]'>
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
              name='type_of_residence'
              value={residence.value}
              current={values.addressSchema.type_of_residence}
              onChange={handleRadioChange}
            >
              {residence.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {values.addressSchema.type_of_residence ? (
        <>
          {/* Current Address */}
          <label
            htmlFor='loan-purpose'
            className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
          >
            Current Address
          </label>

          <TextInput
            label='Flat no/Building name'
            placeholder='Eg: C-101'
            required
            name='addressSchema.current_flat_no_building_name'
            value={values.addressSchema.current_flat_no_building_name}
            error={errors.addressSchema?.current_flat_no_building_name}
            touched={touched.addressSchema?.current_flat_no_building_name}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.current_flat_no_building_name &&
                values.addressSchema.current_flat_no_building_name
              ) {
                if (values.addressSchema.extra_params.permanent_address_same_as_current) {
                  setFieldValue(
                    'addressSchema.permanent_flat_no_building_name',
                    values.addressSchema.current_flat_no_building_name,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_flat_no_building_name:
                      values.addressSchema.current_flat_no_building_name,
                    permanent_flat_no_building_name:
                      values.addressSchema.current_flat_no_building_name,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_flat_no_building_name:
                      values.addressSchema.current_flat_no_building_name,
                  });
                }
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
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Street/Area/Locality'
            placeholder='Eg: Senapati road'
            required
            name='addressSchema.current_street_area_locality'
            value={values.addressSchema.current_street_area_locality}
            error={errors.addressSchema?.current_street_area_locality}
            touched={touched.addressSchema?.current_street_area_locality}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.current_street_area_locality &&
                values.addressSchema.current_street_area_locality
              ) {
                if (values.addressSchema.extra_params.permanent_address_same_as_current) {
                  setFieldValue(
                    'addressSchema.permanent_street_area_locality',
                    values.addressSchema.current_street_area_locality,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_street_area_locality: values.addressSchema.current_street_area_locality,
                    permanent_street_area_locality:
                      values.addressSchema.current_street_area_locality,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_street_area_locality: values.addressSchema.current_street_area_locality,
                  });
                }
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
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Town'
            placeholder='Eg: Igatpuri'
            required
            name='addressSchema.current_town'
            value={values.addressSchema.current_town}
            error={errors.addressSchema?.current_town}
            touched={touched.addressSchema?.current_town}
            onBlur={(e) => {
              handleBlur(e);
              if (!errors.addressSchema?.current_town && values.addressSchema.current_town) {
                if (values.addressSchema.extra_params.permanent_address_same_as_current) {
                  setFieldValue('addressSchema.permanent_town', values.addressSchema.current_town);
                  editAddressById(TEST_ADDRESS_ID, {
                    current_town: values.addressSchema.current_town,
                    permanent_town: values.addressSchema.current_town,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_town: values.addressSchema.current_town,
                  });
                }
              }
            }}
            disabled={inputDisabled}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const pattern = /^[A-Za-z\s]+$/;
              if (pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Landmark'
            placeholder='Eg: Near apollo hospital'
            required
            name='addressSchema.current_landmark'
            value={values.addressSchema.current_landmark}
            error={errors.addressSchema?.current_landmark}
            touched={touched.addressSchema?.current_landmark}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.current_landmark &&
                values.addressSchema.current_landmark
              ) {
                if (values.addressSchema.extra_params.permanent_address_same_as_current) {
                  setFieldValue(
                    'addressSchema.permanent_landmark',
                    values.addressSchema.current_landmark,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_landmark: values.addressSchema.current_landmark,
                    permanent_landmark: values.addressSchema.current_landmark,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_landmark: values.addressSchema.current_landmark,
                  });
                }
              }
            }}
            disabled={inputDisabled}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const pattern = /^[A-Za-z\s]+$/;
              if (pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Pincode'
            placeholder='Eg: 123456'
            required
            name='addressSchema.current_pincode'
            type='tel'
            hint='City and State fields will get filled based on Pincode'
            value={values.addressSchema.current_pincode}
            error={errors.addressSchema?.current_pincode}
            touched={touched.addressSchema?.current_pincode}
            disabled={inputDisabled}
            onBlur={(e) => {
              handleBlur(e);
              handleCurrentPincodeChange();
              if (!errors.addressSchema?.current_pincode && values.addressSchema.current_pincode) {
                if (values.addressSchema.extra_params.permanent_address_same_as_current) {
                  setFieldValue(
                    'addressSchema.permanent_pincode',
                    values.addressSchema.current_pincode,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_pincode: values.addressSchema.current_pincode,
                    permanent_pincode: values.addressSchema.current_pincode,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_pincode: values.addressSchema.current_pincode,
                  });
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
            name='addressSchema.current_city'
            value={values.addressSchema.current_city}
            error={errors.addressSchema?.current_city}
            touched={touched.addressSchema?.current_city}
            onBlur={handleBlur}
            disabled={true}
            onChange={() => {}}
            inputClasses='capitalize'
          />

          <TextInput
            label='State'
            placeholder='Eg: Maharashtra'
            name='addressSchema.current_state'
            value={values.addressSchema.current_state}
            error={errors.addressSchema?.current_state}
            touched={touched.addressSchema?.current_state}
            onBlur={handleBlur}
            disabled={true}
            onChange={() => {}}
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
                  name='current_no_of_year_residing'
                  value={data.value}
                  current={values.addressSchema.current_no_of_year_residing}
                  onChange={handleRadioChange}
                >
                  <span
                    className={`${
                      index == values.addressSchema.current_no_of_year_residing
                        ? 'text-secondary-green font-semibold'
                        : 'text-primary-black font-normal'
                    }`}
                  >
                    {data.label}
                  </span>
                </CardRadio>
              ))}
            </div>
          </div>
          {values.addressSchema.type_of_residence === 'Self owned' ? (
            <div className='flex items-center gap-2 mt-6'>
              <Checkbox
                checked={values.addressSchema.extra_params.permanent_address_same_as_current}
                name='permanent_address_same_as_current'
                onChange={(e) => {
                  let isChecked = !!e.target.checked;
                  setFieldValue(
                    'addressSchema.extra_params.permanent_address_same_as_current',
                    isChecked,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    extra_params: {
                      [e.target.name]: isChecked,
                    },
                  });
                }}
                disabled={values.addressSchema.type_of_residence !== 'Self owned'}
              />

              <span className='text-[#373435] text-xs font-normal'>
                Permanent address is same as Current address
              </span>
            </div>
          ) : null}

          {/* Permanent Address */}
          <label
            htmlFor='loan-purpose'
            className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
          >
            Permanent Address
          </label>

          <TextInput
            label='Flat no/Building name'
            placeholder='Eg: C-101'
            required
            name='addressSchema.permanent_flat_no_building_name'
            value={values.addressSchema.permanent_flat_no_building_name}
            error={errors.addressSchema?.permanent_flat_no_building_name}
            touched={touched.addressSchema?.permanent_flat_no_building_name}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.permanent_flat_no_building_name &&
                values.addressSchema.permanent_flat_no_building_name
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_flat_no_building_name:
                    values.addressSchema.permanent_flat_no_building_name,
                });
              }
            }}
            disabled={
              inputDisabled || values.addressSchema.extra_params.permanent_address_same_as_current
            }
            onChange={(e) => {
              const value = e.currentTarget.value;
              const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
              if (address_pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Street/Area/Locality'
            placeholder='Eg: Senapati road'
            required
            name='addressSchema.permanent_street_area_locality'
            value={values.addressSchema.permanent_street_area_locality}
            error={errors.addressSchema?.permanent_street_area_locality}
            touched={touched.addressSchema?.permanent_street_area_locality}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.permanent_street_area_locality &&
                values.addressSchema.permanent_street_area_locality
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_street_area_locality:
                    values.addressSchema.permanent_street_area_locality,
                });
              }
            }}
            disabled={
              inputDisabled || values.addressSchema.extra_params.permanent_address_same_as_current
            }
            onChange={(e) => {
              const value = e.currentTarget.value;
              const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
              if (address_pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Town'
            placeholder='Eg: Igatpuri'
            required
            name='addressSchema.permanent_town'
            value={values.addressSchema.permanent_town}
            error={errors.addressSchema?.permanent_town}
            touched={touched.addressSchema?.permanent_town}
            onBlur={(e) => {
              handleBlur(e);
              if (!errors.addressSchema?.permanent_town && values.addressSchema.permanent_town) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_town: values.addressSchema.permanent_town,
                });
              }
            }}
            disabled={
              inputDisabled || values.addressSchema.extra_params.permanent_address_same_as_current
            }
            onChange={(e) => {
              const value = e.currentTarget.value;
              const pattern = /^[A-Za-z\s]+$/;
              if (pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Landmark'
            placeholder='Eg: Near apollo hospital'
            required
            name='addressSchema.permanent_landmark'
            value={values.addressSchema.permanent_landmark}
            error={errors.addressSchema?.permanent_landmark}
            touched={touched.addressSchema?.permanent_landmark}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors.addressSchema?.permanent_landmark &&
                values.addressSchema.permanent_landmark
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_landmark: values.addressSchema.permanent_landmark,
                });
              }
            }}
            disabled={
              inputDisabled || values.addressSchema.extra_params.permanent_address_same_as_current
            }
            onChange={(e) => {
              const value = e.currentTarget.value;
              const pattern = /^[A-Za-z\s]+$/;
              if (pattern.exec(value[value.length - 1])) {
                setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
              }

              const name = e.target.name.split('.')[1];
              if (!requiredFieldsStatus[name]) {
                updateProgress(2, requiredFieldsStatus);
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            }}
            inputClasses='capitalize'
          />

          <TextInput
            label='Pincode'
            placeholder='Eg: 123456'
            required
            name='addressSchema.permanent_pincode'
            type='tel'
            hint='City and State fields will get filled based on Pincode'
            value={values.addressSchema.permanent_pincode}
            error={errors.addressSchema?.permanent_pincode}
            touched={touched.addressSchema?.permanent_pincode}
            disabled={
              inputDisabled || values.addressSchema.extra_params.permanent_address_same_as_current
            }
            onBlur={(e) => {
              handleBlur(e);
              handlePermanentPincodeChange();

              if (
                !errors.addressSchema?.permanent_pincode &&
                values.addressSchema.permanent_pincode
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_pincode: values.addressSchema.permanent_pincode,
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
            name='addressSchema.permanent_city'
            value={values.addressSchema.permanent_city}
            error={errors.addressSchema?.permanent_city}
            touched={touched.addressSchema?.permanent_city}
            onBlur={handleBlur}
            disabled={true}
            onChange={() => {}}
            inputClasses='capitalize'
          />

          <TextInput
            label='State'
            placeholder='Eg: Maharashtra'
            name='addressSchema.permanent_state'
            value={values.addressSchema.permanent_state}
            error={errors.addressSchema?.permanent_state}
            touched={touched.addressSchema?.permanent_state}
            onBlur={handleBlur}
            disabled={true}
            onChange={() => {}}
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
                  name='permanent_no_of_year_residing'
                  value={data.value}
                  current={values.addressSchema.permanent_no_of_year_residing}
                  onChange={handleRadioChange}
                  disabled={values.addressSchema.extra_params.permanent_address_same_as_current}
                >
                  <span
                    className={`${
                      index == values.addressSchema.permanent_no_of_year_residing
                        ? values.addressSchema.extra_params.permanent_address_same_as_current
                          ? 'text-[#373435] font-semibold'
                          : 'text-secondary-green font-semibold'
                        : ''
                    }`}
                  >
                    {data.label}
                  </span>
                </CardRadio>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AddressDetails;
