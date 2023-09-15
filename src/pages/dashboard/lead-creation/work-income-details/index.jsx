import { professionOptions, noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import { memo, useCallback, useContext, useEffect } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import Salaried from './Salaried';
import SelfEmployed from './SelfEmployed';
import TextInput from '../../../../components/TextInput';
import UnEmployed from './UnEmployed';
import Retired from './Retired';
import CurrencyInput from '../../../../components/CurrencyInput';
import { checkIsValidStatePincode, editFieldsById } from '../../../../global';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const WorkIncomeDetails = () => {
  const {
    setValues,
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldError,
    handleChange,
    handleSubmit,
  } = useContext(LeadContext);

  const handleRadioChange = useCallback((e) => {
    setFieldValue(`work_income_details.${e.name}`, e.value);

    editFieldsById(1, 'work-income', {
      [e.name]: e.value,
    });
  }, []);

  // useEffect(() => {
  //   if (values.work_income_details.profession === 'Salaried') {
  //     editFieldsById(1, 'work-income', {
  //       business_name: null,
  //       industries: null,
  //       gst_number: null,
  //       pention_amount: null,
  //     });
  //     // setValues({
  //     //   ...values,
  //     //   work_income_details: {
  //     //     ...values.work_income_details,
  //     //     business_name: '',
  //     //     industries: '',
  //     //     gst_number: '',
  //     //     pention_amount: '',
  //     //   },
  //     // });
  //   } else if (values.work_income_details.profession === 'Self-employed') {
  //     editFieldsById(1, 'work-income', {
  //       company_name: null,
  //       total_income: null,
  //       pf_uan: null,
  //       working_since: null,
  //       mode_of_salary: null,
  //       pention_amount: null,
  //     });
  //     setValues({
  //       ...values,
  //       work_income_details: {
  //         ...values.work_income_details,
  //         company_name: '',
  //         total_income: '',
  //         pf_uan: '',
  //         working_since: '',
  //         mode_of_salary: '',
  //         pention_amount: '',
  //       },
  //     });
  //   } else if (values.work_income_details.profession === 'Unemployed') {
  //     editFieldsById(1, 'work-income', {
  //       company_name: null,
  //       total_income: null,
  //       pf_uan: null,
  //       working_since: null,
  //       mode_of_salary: null,
  //       flat_no_building_name: null,
  //       street_area_locality: null,
  //       town: null,
  //       landmark: null,
  //       pincode: null,
  //       city: null,
  //       state: null,
  //       business_name: null,
  //       industries: null,
  //       gst_number: null,
  //       pention_amount: null,
  //     });
  //     setValues({
  //       ...values,
  //       work_income_details: {
  //         ...values.work_income_details,
  //         company_name: '',
  //         total_income: '',
  //         pf_uan: '',
  //         working_since: '',
  //         mode_of_salary: '',
  //         flat_no_building_name: '',
  //         street_area_locality: '',
  //         town: '',
  //         landmark: '',
  //         pincode: '',
  //         city: '',
  //         state: '',
  //         business_name: '',
  //         industries: '',
  //         gst_number: '',
  //         pention_amount: '',
  //       },
  //     });
  //   } else {
  //     editFieldsById(1, 'work-income', {
  //       company_name: null,
  //       total_income: null,
  //       pf_uan: null,
  //       working_since: null,
  //       mode_of_salary: null,
  //       flat_no_building_name: null,
  //       street_area_locality: null,
  //       town: null,
  //       landmark: null,
  //       pincode: null,
  //       city: null,
  //       state: null,
  //       business_name: null,
  //       industries: null,
  //       gst_number: null,
  //     });
  //     setValues({
  //       ...values,
  //       work_income_details: {
  //         ...values.work_income_details,
  //         company_name: '',
  //         total_income: '',
  //         pf_uan: '',
  //         working_since: '',
  //         mode_of_salary: '',
  //         flat_no_building_name: '',
  //         street_area_locality: '',
  //         town: '',
  //         landmark: '',
  //         pincode: '',
  //         city: '',
  //         state: '',
  //         business_name: '',
  //         industries: '',
  //         gst_number: '',
  //       },
  //     });
  //   }
  // }, [values.work_income_details.profession]);

  const handleOnPincodeChange = useCallback(async () => {
    if (
      !values.work_income_details.pincode ||
      values.work_income_details.pincode.toString().length < 5 ||
      errors.work_income_details?.pincode
    ) {
      setFieldValue('work_income_details.city', '');
      setFieldValue('work_income_details.state', '');
      return;
    }

    const res = await checkIsValidStatePincode(values.work_income_details.pincode);
    if (!res) {
      setFieldError('work_income_details.pincode', 'Invalid Pincode');
      return;
    }

    editFieldsById(1, 'work-income', {
      city: res.city,
      state: res.state,
    });

    setFieldValue('work_income_details.city', res.city);
    setFieldValue('work_income_details.state', res.state);

    // if (!requiredFieldsStatus['pincode']) {
    //   updateProgress(4, requiredFieldsStatus);
    //   setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: true }));
    // }
  }, [
    errors.work_income_details?.pincode,
    values.work_income_details.pincode,
    setFieldError,
    setFieldValue,
    // requiredFieldsStatus,
  ]);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
            Profession <span className='text-primary-red text-xs'>*</span>
          </label>
          <div className={`flex gap-4 w-full`}>
            {professionOptions.map((option) => {
              return (
                <CardRadio
                  key={option.value}
                  label={option.label}
                  name='profession'
                  value={option.value}
                  current={values.work_income_details.profession}
                  onChange={handleRadioChange}
                  containerClasses='flex-1'
                >
                  {option.icon}
                </CardRadio>
              );
            })}
          </div>

          {errors.work_income_details?.profession && !values.work_income_details.profession ? (
            <span className='text-sm text-primary-red'>
              {errors.work_income_details.profession}
            </span>
          ) : null}
        </div>
        {values.work_income_details.profession === 'Salaried' && <Salaried />}
        {values.work_income_details.profession === 'Self-employed' && <SelfEmployed />}
        {values.work_income_details.profession === 'Unemployed' && <UnEmployed />}
        {values.work_income_details.profession === 'Retired' && <Retired />}

        {values.work_income_details.profession === 'Salaried' ||
        values.work_income_details.profession === 'Self-employed' ? (
          <>
            <TextInput
              label='Flat no/Building name'
              placeholder='Eg: C-101'
              required
              name='work_income_details.flat_no_building_name'
              value={values.work_income_details.flat_no_building_name}
              error={errors.work_income_details?.flat_no_building_name}
              touched={touched.work_income_details?.flat_no_building_name}
              onBlur={(e) => {
                handleBlur(e);

                if (
                  !errors.work_income_details?.flat_no_building_name &&
                  values.work_income_details.flat_no_building_name
                ) {
                  editFieldsById(1, 'work-income', {
                    flat_no_building_name: values.work_income_details.flat_no_building_name,
                  });
                }
              }}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Street/Area/Locality'
              placeholder='Eg: Senapati road'
              required
              name='work_income_details.street_area_locality'
              value={values.work_income_details.street_area_locality}
              error={errors.work_income_details?.street_area_locality}
              touched={touched.work_income_details?.street_area_locality}
              onBlur={(e) => {
                handleBlur(e);

                if (
                  !errors.work_income_details?.street_area_locality &&
                  values.work_income_details.street_area_locality
                ) {
                  editFieldsById(1, 'work-income', {
                    street_area_locality: values.work_income_details.street_area_locality,
                  });
                }
              }}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Town'
              placeholder='Eg: Igatpuri'
              name='work_income_details.town'
              value={values.work_income_details.town}
              error={errors.work_income_details?.town}
              touched={touched.work_income_details?.town}
              onBlur={(e) => {
                handleBlur(e);

                if (!errors.work_income_details?.town && values.work_income_details.town) {
                  editFieldsById(1, 'work-income', {
                    town: values.work_income_details.town,
                  });
                }
              }}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z\s]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Landmark'
              placeholder='Eg: Near apollo hospital'
              required
              name='work_income_details.landmark'
              value={values.work_income_details.landmark}
              error={errors.work_income_details?.landmark}
              touched={touched.work_income_details?.landmark}
              onBlur={(e) => {
                handleBlur(e);

                if (!errors.work_income_details?.landmark && values.work_income_details.landmark) {
                  editFieldsById(1, 'work-income', {
                    landmark: values.work_income_details.landmark,
                  });
                }
              }}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z\s]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              required
              hint='City and State fields will get filled based on Pincode'
              placeholder='Eg: 123456'
              label='Pincode'
              name='work_income_details.pincode'
              value={values.work_income_details.pincode}
              error={errors.work_income_details?.pincode}
              touched={touched.work_income_details?.pincode}
              onBlur={(e) => {
                handleBlur(e);
                handleOnPincodeChange();

                if (!errors.work_income_details?.pincode && values.work_income_details.pincode) {
                  editFieldsById(1, 'work-income', {
                    pincode: values.work_income_details.pincode,
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
              disabled
              name='work_income_details.city'
              value={values.work_income_details.city}
              error={errors.work_income_details?.city}
              touched={touched.work_income_details?.city}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='State'
              placeholder='Eg: Maharashtra'
              disabled
              name='work_income_details.state'
              value={values.work_income_details.state}
              error={errors.work_income_details?.state}
              touched={touched.work_income_details?.state}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />
          </>
        ) : null}

        {professionOptions.length && values.work_income_details.profession ? (
          <>
            <div className='flex flex-col gap-2'>
              <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
                Total family members <span className='text-primary-red text-xs'>*</span>
              </label>
              <div className={`flex gap-4 w-full`}>
                {totalFamilyMembersOptions.map((option) => {
                  return (
                    <CardRadioWithoutIcon
                      key={option.value}
                      label={option.label}
                      name='total_family_number'
                      value={option.value}
                      current={values.work_income_details.total_family_number}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>

              {/* {errors.work_income_details?.total_family_number &&
              !touched.work_income_details?.total_family_number &&
              !values.work_income_details.total_family_number ? (
                <span className='text-sm text-primary-red'>
                  {errors.work_income_details.total_family_number}
                </span>
              ) : null} */}

              {/* {errors.work_income_details?.total_family_number && (
                <span className='text-sm text-primary-red'>
                  {errors.work_income_details.total_family_number}
                </span>
              )} */}
            </div>

            <CurrencyInput
              label='Total household income'
              placeholder='Eg: 1,00,000'
              required
              name='work_income_details.total_household_income'
              value={values.work_income_details.total_household_income}
              error={errors.work_income_details?.total_household_income}
              touched={touched.work_income_details?.total_household_income}
              onBlur={(e) => {
                handleBlur(e);

                if (
                  !errors.work_income_details?.total_household_income &&
                  values.work_income_details.total_household_income
                ) {
                  editFieldsById(1, 'work-income', {
                    total_household_income: values.work_income_details.total_household_income,
                  });
                }
              }}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }

                // const name = e.target.name.split('.')[1];
                // if (!requiredFieldsStatus[name]) {
                //   updateProgress(6, requiredFieldsStatus);
                //   setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                // }
              }}
            />

            <div className='flex flex-col gap-2'>
              <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
                No. of Dependents <span className='text-primary-red text-xs'>*</span>
              </label>
              <div className={`flex gap-4 w-full`}>
                {noOfDependentsOptions.map((option) => {
                  return (
                    <CardRadioWithoutIcon
                      key={option.value}
                      label={option.label}
                      name='no_of_dependents'
                      value={option.value}
                      current={values.work_income_details.no_of_dependents}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>

              {/* {errors.work_income_details?.no_of_dependents &&
              !touched.work_income_details?.no_of_dependents &&
              !values.work_income_details.no_of_dependents ? (
                <span className='text-sm text-primary-red'>
                  {errors.work_income_details.no_of_dependents}
                </span>
              ) : null} */}

              {/* {errors.work_income_details?.no_of_dependents && (
                <span className='text-sm text-primary-red'>
                  {errors.work_income_details.no_of_dependents}
                </span>
              )} */}
            </div>
          </>
        ) : null}

        {/* <button onClick={handleSubmit}>submit</button> */}
      </div>
    </div>
  );
};

export default WorkIncomeDetails;
