import { useContext, useState, useCallback, useEffect } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { CardRadio, TextInput } from '../../../../components';
import { checkIsValidStatePincode, editAddressById } from '../../../../global';
import Checkbox from '../../../../components/Checkbox';
import { residenceData, yearsResidingData } from './AddressDropdownData';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const TEST_ADDRESS_ID = 1;

export default function AddressDetails() {
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
    activeIndex,
    setValues,
  } = useContext(LeadContext);

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
      setFieldValue('address_details.' + e.name, e.value);

      editAddressById(TEST_ADDRESS_ID, {
        [e.name === 'type_of_residence' ? 'current_type_of_residence' : e.name]: e.value,
      });

      if (
        values?.applicants?.[activeIndex]?.address_details?.extra_params
          .permanent_address_same_as_current &&
        e.name === 'current_no_of_year_residing'
      ) {
        setFieldValue('address_details.permanent_no_of_year_residing', e.value);
        editAddressById(TEST_ADDRESS_ID, {
          permanent_no_of_year_residing:
            values?.applicants?.[activeIndex]?.address_details?.current_no_of_year_residing,
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
      !values?.applicants?.[activeIndex]?.address_details?.current_pincode ||
      values?.applicants?.[activeIndex]?.address_details?.current_pincode.toString().length < 5
    )
      return;

    const res = await checkIsValidStatePincode(
      values?.applicants?.[activeIndex]?.address_details?.current_pincode,
    );
    if (!res) {
      setFieldError('address_details.current_pincode', 'Invalid Pincode');
      return;
    }

    editAddressById(TEST_ADDRESS_ID, {
      current_city: res.city,
      current_state: res.state,
    });

    setFieldValue('address_details.current_city', res.city);
    setFieldValue('address_details.current_state', res.state);

    if (
      values?.applicants?.[activeIndex]?.address_details?.extra_params
        .permanent_address_same_as_current
    ) {
      editAddressById(TEST_ADDRESS_ID, {
        permanent_city: res.city,
        permanent_state: res.state,
      });

      setFieldValue('address_details.permanent_city', res.city);
      setFieldValue('address_details.permanent_state', res.state);
    }

    if (!requiredFieldsStatus['current_pincode']) {
      updateProgress(2, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['current_pincode']: true }));
    }
  }, [
    errors?.applicants?.[activeIndex]?.address_details?.current_pincode,
    values?.applicants?.[activeIndex]?.address_details?.current_pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.address_details?.extra_params
        ?.permanent_address_same_as_current
    ) {
      let newData = JSON.parse(JSON.stringify(values));

      newData.applicants[activeIndex].address_details = {
        ...newData.applicants[activeIndex].address_details,
        permanent_flat_no_building_name:
          values?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name,
        permanent_street_area_locality:
          values?.applicants?.[activeIndex]?.address_details?.current_street_area_locality,
        permanent_town: values?.applicants?.[activeIndex]?.address_details?.current_town,
        permanent_landmark: values?.applicants?.[activeIndex]?.address_details?.current_landmark,
        permanent_pincode: values?.applicants?.[activeIndex]?.address_details?.current_pincode,
        permanent_city: values?.applicants?.[activeIndex]?.address_details?.current_city,
        permanent_state: values?.applicants?.[activeIndex]?.address_details?.current_state,
        permanent_no_of_year_residing:
          values?.applicants?.[activeIndex]?.address_details?.current_no_of_year_residing,
      };

      setValues(newData);
    } else {
      let newData = JSON.parse(JSON.stringify(values));

      newData.applicants[activeIndex].address_details = {
        ...newData.applicants[activeIndex].address_details,
        permanent_flat_no_building_name: '',
        permanent_street_area_locality: '',
        permanent_town: '',
        permanent_landmark: '',
        permanent_pincode: '',
        permanent_city: '',
        permanent_state: '',
        permanent_no_of_year_residing: null,
      };

      setValues(newData);
    }
    if (values?.applicants?.[activeIndex]?.address_details?.type_of_residence) {
      editAddressById(TEST_ADDRESS_ID, {
        permanent_flat_no_building_name:
          values?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name,
        permanent_street_area_locality:
          values?.applicants?.[activeIndex]?.address_details?.current_street_area_locality,
        permanent_town: values?.applicants?.[activeIndex]?.address_details?.current_town,
        permanent_landmark: values?.applicants?.[activeIndex]?.address_details?.current_landmark,
        permanent_pincode: values?.applicants?.[activeIndex]?.address_details?.current_pincode,
        permanent_city: values?.applicants?.[activeIndex]?.address_details?.current_city,
        permanent_state: values?.applicants?.[activeIndex]?.address_details?.current_state,
        permanent_no_of_year_residing:
          values?.applicants?.[activeIndex]?.address_details?.current_no_of_year_residing,
      });
    }
  }, [
    values?.applicants?.[activeIndex]?.address_details?.extra_params
      .permanent_address_same_as_current,
  ]);

  useEffect(() => {
    if (values?.applicants?.[activeIndex]?.address_details?.type_of_residence === 'Rented') {
      setFieldValue('address_details.extra_params.permanent_address_same_as_current', false);
    }
  }, [values?.applicants?.[activeIndex]?.address_details?.type_of_residence]);

  const handlePermanentPincodeChange = useCallback(async () => {
    if (
      !values?.applicants?.[activeIndex]?.address_details?.permanent_pincode ||
      values?.applicants?.[activeIndex]?.address_details?.permanent_pincode.toString().length < 5
    )
      return;

    const res = await checkIsValidStatePincode(
      values?.applicants?.[activeIndex]?.address_details?.permanent_pincode,
    );
    if (!res) {
      setFieldError('address_details.permanent_pincode', 'Invalid Pincode');
      return;
    }

    editAddressById(TEST_ADDRESS_ID, {
      permanent_city: res.city,
      permanent_state: res.state,
    });

    setFieldValue('address_details.permanent_city', res.city);
    setFieldValue('address_details.permanent_state', res.state);

    if (!requiredFieldsStatus['permanent_pincode']) {
      updateProgress(2, requiredFieldsStatus);
      setRequiredFieldsStatus((prev) => ({ ...prev, ['permanent_pincode']: true }));
    }
  }, [
    errors?.applicants?.[activeIndex]?.address_details?.permanent_pincode,
    values?.applicants?.[activeIndex]?.address_details?.permanent_pincode,
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
              current={values?.applicants?.[activeIndex]?.address_details?.type_of_residence}
              onChange={handleRadioChange}
            >
              {residence.icon}
            </CardRadio>
          ))}
        </div>
      </div>

      {values?.applicants?.[activeIndex]?.address_details?.type_of_residence ? (
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
            name='address_details.current_flat_no_building_name'
            value={
              values?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name
            }
            error={
              errors?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name
            }
            touched={
              touched?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name
            }
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details
                  ?.current_flat_no_building_name &&
                values?.applicants?.[activeIndex]?.address_details?.current_flat_no_building_name
              ) {
                if (
                  values?.applicants?.[activeIndex]?.address_details?.extra_params
                    .permanent_address_same_as_current
                ) {
                  setFieldValue(
                    'address_details.permanent_flat_no_building_name',
                    values?.applicants?.[activeIndex]?.address_details
                      ?.current_flat_no_building_name,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_flat_no_building_name:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_flat_no_building_name,
                    permanent_flat_no_building_name:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_flat_no_building_name,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_flat_no_building_name:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_flat_no_building_name,
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
            name='address_details.current_street_area_locality'
            value={values?.applicants?.[activeIndex]?.address_details?.current_street_area_locality}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_street_area_locality}
            touched={
              touched?.applicants?.[activeIndex]?.address_details?.current_street_area_locality
            }
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details?.current_street_area_locality &&
                values?.applicants?.[activeIndex]?.address_details?.current_street_area_locality
              ) {
                if (
                  values?.applicants?.[activeIndex]?.address_details?.extra_params
                    .permanent_address_same_as_current
                ) {
                  setFieldValue(
                    'address_details.permanent_street_area_locality',
                    values?.applicants?.[activeIndex]?.address_details
                      ?.current_street_area_locality,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_street_area_locality:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_street_area_locality,
                    permanent_street_area_locality:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_street_area_locality,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_street_area_locality:
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_street_area_locality,
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
            name='address_details.current_town'
            value={values?.applicants?.[activeIndex]?.address_details?.current_town}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_town}
            touched={touched?.applicants?.[activeIndex]?.address_details?.current_town}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details?.current_town &&
                values?.applicants?.[activeIndex]?.address_details?.current_town
              ) {
                if (
                  values?.applicants?.[activeIndex]?.address_details?.extra_params
                    .permanent_address_same_as_current
                ) {
                  setFieldValue(
                    'address_details.permanent_town',
                    values?.applicants?.[activeIndex]?.address_details?.current_town,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_town: values?.applicants?.[activeIndex]?.address_details?.current_town,
                    permanent_town:
                      values?.applicants?.[activeIndex]?.address_details?.current_town,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_town: values?.applicants?.[activeIndex]?.address_details?.current_town,
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
            name='address_details.current_landmark'
            value={values?.applicants?.[activeIndex]?.address_details?.current_landmark}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_landmark}
            touched={touched?.applicants?.[activeIndex]?.address_details?.current_landmark}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details?.current_landmark &&
                values?.applicants?.[activeIndex]?.address_details?.current_landmark
              ) {
                if (
                  values?.applicants?.[activeIndex]?.address_details?.extra_params
                    .permanent_address_same_as_current
                ) {
                  setFieldValue(
                    'address_details.permanent_landmark',
                    values?.applicants?.[activeIndex]?.address_details?.current_landmark,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    current_landmark:
                      values?.applicants?.[activeIndex]?.address_details?.current_landmark,
                    permanent_landmark:
                      values?.applicants?.[activeIndex]?.address_details?.current_landmark,
                  });
                } else {
                  editAddressById(TEST_ADDRESS_ID, {
                    current_landmark:
                      values?.applicants?.[activeIndex]?.address_details?.current_landmark,
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
            name='address_details.current_pincode'
            type='tel'
            // hint='City and State fields will get filled based on Pincode'
            value={values?.applicants?.[activeIndex]?.address_details?.current_pincode}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_pincode}
            touched={touched?.applicants?.[activeIndex]?.address_details?.current_pincode}
            disabled={inputDisabled}
            onBlur={(e) => {
              handleBlur(e);
              handleCurrentPincodeChange();
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
            name='address_details.current_city'
            value={values?.applicants?.[activeIndex]?.address_details?.current_city}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_city}
            touched={touched?.applicants?.[activeIndex]?.address_details?.current_city}
            onBlur={handleBlur}
            disabled={true}
            labelDisabled={!values?.applicants?.[activeIndex]?.address_details?.current_city}
            onChange={() => {}}
            inputClasses='capitalize'
          />

          <TextInput
            label='State'
            placeholder='Eg: Maharashtra'
            name='address_details.current_state'
            value={values?.applicants?.[activeIndex]?.address_details?.current_state}
            error={errors?.applicants?.[activeIndex]?.address_details?.current_state}
            touched={touched?.applicants?.[activeIndex]?.address_details?.current_state}
            onBlur={handleBlur}
            disabled={true}
            labelDisabled={!values?.applicants?.[activeIndex]?.address_details?.current_state}
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
                  current={
                    values?.applicants?.[activeIndex]?.address_details?.current_no_of_year_residing
                  }
                  onChange={handleRadioChange}
                >
                  <span
                    className={`${
                      index ==
                      values?.applicants?.[activeIndex]?.address_details
                        ?.current_no_of_year_residing
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
          {values?.applicants?.[activeIndex]?.address_details?.type_of_residence ===
          'Self owned' ? (
            <div className='flex items-center gap-2 mt-6'>
              <Checkbox
                checked={
                  values?.applicants?.[activeIndex]?.address_details?.extra_params
                    .permanent_address_same_as_current
                }
                name='permanent_address_same_as_current'
                onChange={(e) => {
                  let isChecked = !!e.target.checked;
                  setFieldValue(
                    'address_details.extra_params.permanent_address_same_as_current',
                    isChecked,
                  );
                  editAddressById(TEST_ADDRESS_ID, {
                    extra_params: {
                      [e.target.name]: isChecked,
                    },
                  });
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.address_details?.type_of_residence !==
                  'Self owned'
                }
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
            name='address_details.permanent_flat_no_building_name'
            value={
              values?.applicants?.[activeIndex]?.address_details?.permanent_flat_no_building_name
            }
            error={
              errors?.applicants?.[activeIndex]?.address_details?.permanent_flat_no_building_name
            }
            touched={
              touched?.applicants?.[activeIndex]?.address_details?.permanent_flat_no_building_name
            }
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details
                  ?.permanent_flat_no_building_name &&
                values?.applicants?.[activeIndex]?.address_details?.permanent_flat_no_building_name
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_flat_no_building_name:
                    values?.applicants?.[activeIndex]?.address_details
                      ?.permanent_flat_no_building_name,
                });
              }
            }}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.address_details?.extra_params
                .permanent_address_same_as_current
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
            name='address_details.permanent_street_area_locality'
            value={
              values?.applicants?.[activeIndex]?.address_details?.permanent_street_area_locality
            }
            error={
              errors?.applicants?.[activeIndex]?.address_details?.permanent_street_area_locality
            }
            touched={
              touched?.applicants?.[activeIndex]?.address_details?.permanent_street_area_locality
            }
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details
                  ?.permanent_street_area_locality &&
                values?.applicants?.[activeIndex]?.address_details?.permanent_street_area_locality
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_street_area_locality:
                    values?.applicants?.[activeIndex]?.address_details
                      ?.permanent_street_area_locality,
                });
              }
            }}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.address_details?.extra_params
                .permanent_address_same_as_current
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
            name='address_details.permanent_town'
            value={values?.applicants?.[activeIndex]?.address_details?.permanent_town}
            error={errors?.applicants?.[activeIndex]?.address_details?.permanent_town}
            touched={touched?.applicants?.[activeIndex]?.address_details?.permanent_town}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details?.permanent_town &&
                values?.applicants?.[activeIndex]?.address_details?.permanent_town
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_town:
                    values?.applicants?.[activeIndex]?.address_details?.permanent_town,
                });
              }
            }}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.address_details?.extra_params
                .permanent_address_same_as_current
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
            name='address_details.permanent_landmark'
            value={values?.applicants?.[activeIndex]?.address_details?.permanent_landmark}
            error={errors?.applicants?.[activeIndex]?.address_details?.permanent_landmark}
            touched={touched?.applicants?.[activeIndex]?.address_details?.permanent_landmark}
            onBlur={(e) => {
              handleBlur(e);
              if (
                !errors?.applicants?.[activeIndex]?.address_details?.permanent_landmark &&
                values?.applicants?.[activeIndex]?.address_details?.permanent_landmark
              ) {
                editAddressById(TEST_ADDRESS_ID, {
                  permanent_landmark:
                    values?.applicants?.[activeIndex]?.address_details?.permanent_landmark,
                });
              }
            }}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.address_details?.extra_params
                .permanent_address_same_as_current
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
            name='address_details.permanent_pincode'
            type='tel'
            hint='City and State fields will get filled based on Pincode'
            value={values?.applicants?.[activeIndex]?.address_details?.permanent_pincode}
            error={errors?.applicants?.[activeIndex]?.address_details?.permanent_pincode}
            touched={touched?.applicants?.[activeIndex]?.address_details?.permanent_pincode}
            disabled={
              inputDisabled ||
              values?.applicants?.[activeIndex]?.address_details?.extra_params
                .permanent_address_same_as_current
            }
            onBlur={(e) => {
              handleBlur(e);
              handlePermanentPincodeChange();
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
            name='address_details.permanent_city'
            value={values?.applicants?.[activeIndex]?.address_details?.permanent_city}
            error={errors?.applicants?.[activeIndex]?.address_details?.permanent_city}
            touched={touched?.applicants?.[activeIndex]?.address_details?.permanent_city}
            onBlur={handleBlur}
            disabled={true}
            labelDisabled={!values?.applicants?.[activeIndex]?.address_details?.permanent_city}
            onChange={() => {}}
            inputClasses='capitalize'
          />

          <TextInput
            label='State'
            placeholder='Eg: Maharashtra'
            name='address_details.permanent_state'
            value={values?.applicants?.[activeIndex]?.address_details?.permanent_state}
            error={errors?.applicants?.[activeIndex]?.address_details?.permanent_state}
            touched={touched?.applicants?.[activeIndex]?.address_details?.permanent_state}
            onBlur={handleBlur}
            disabled={true}
            labelDisabled={!values?.applicants?.[activeIndex]?.address_details?.permanent_state}
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
                  current={
                    values?.applicants?.[activeIndex]?.address_details
                      ?.permanent_no_of_year_residing
                  }
                  onChange={handleRadioChange}
                  disabled={
                    values?.applicants?.[activeIndex]?.address_details?.extra_params
                      .permanent_address_same_as_current
                  }
                >
                  <span
                    className={`${
                      index ==
                      values?.applicants?.[activeIndex]?.address_details
                        ?.permanent_no_of_year_residing
                        ? values?.applicants?.[activeIndex]?.address_details?.extra_params
                            .permanent_address_same_as_current
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
}
