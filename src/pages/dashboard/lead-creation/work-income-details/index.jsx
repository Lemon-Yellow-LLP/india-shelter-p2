import { professionOptions, noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import Salaried from './Salaried';
import SelfEmployed from './SelfEmployed';
import TextInput from '../../../../components/TextInput';
import UnEmployed from './UnEmployed';
import Retired from './Retired';
import CurrencyInput from '../../../../components/CurrencyInput';
import { addApi, checkIsValidStatePincode, editFieldsById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { Button } from '../../../../components';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';

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
    activeIndex,
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const [openExistingPopup, setOpenExistingPopup] = useState(
    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing || false,
  );

  const handleRadioChange = useCallback(
    async (e) => {
      setFieldValue(e.name, e.value);
      const name = e.currentTarget.name.split('.')[2];
      if (values?.applicants?.[activeIndex]?.work_income_detail?.id) {
        editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
          [name]: e.value,
        });
      } else {
        await addApi('work-income', {
          [name]: e.value,
          applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
        })
          .then(async (res) => {
            setFieldValue(`applicants[${activeIndex}].work_income_detail.id`, res.id);
            await editFieldsById(
              values?.applicants?.[activeIndex]?.applicant_details?.id,
              'applicant',
              { work_income_detail: res.id },
            );
            return res;
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    },
    [values],
  );

  const handleOnPincodeChange = async () => {
    if (
      !values?.applicants?.[activeIndex]?.work_income_detail?.pincode ||
      values?.applicants?.[activeIndex]?.work_income_detail?.pincode.toString().length < 5 ||
      errors?.applicants?.[activeIndex]?.work_income_detail?.pincode
    ) {
      setFieldValue(`applicants[${activeIndex}].work_income_detail.city`, '');
      setFieldValue(`applicants[${activeIndex}].work_income_detail.state`, '');
      return;
    }

    const res = await checkIsValidStatePincode(
      values?.applicants?.[activeIndex]?.work_income_detail?.pincode,
    );

    if (!res) {
      setFieldError(`applicants[${activeIndex}].work_income_detail.pincode`, 'Invalid Pincode');
      return;
    }

    editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
      city: res.city,
      state: res.state,
    });

    setFieldValue(`applicants[${activeIndex}].work_income_detail.city`, res.city);
    setFieldValue(`applicants[${activeIndex}].work_income_detail.state`, res.state);
  };

  const handleNextClick = () => {
    setCurrentStepIndex(4);
    // updateFields();
  };

  const handleAutofill = () => {
    console.log('autofill work-income');
  };

  return (
    <>
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
                    name={`applicants[${activeIndex}].work_income_detail.profession`}
                    value={option.value}
                    current={values?.applicants?.[activeIndex]?.work_income_detail?.profession}
                    onChange={handleRadioChange}
                    containerClasses='flex-1'
                  >
                    {option.icon}
                  </CardRadio>
                );
              })}
            </div>

            {errors?.applicants?.[activeIndex]?.work_income_detail?.profession &&
            !values?.applicants?.[activeIndex]?.work_income_detail?.profession ? (
              <span className='text-sm text-primary-red'>
                {errors?.applicants?.[activeIndex]?.work_income_detail?.profession}
              </span>
            ) : null}
          </div>
          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Salaried' && (
            <Salaried />
          )}
          {values?.applicants?.[activeIndex]?.work_income_detail?.profession ===
            'Self-employed' && <SelfEmployed />}
          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Unemployed' && (
            <UnEmployed />
          )}
          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Retired' && (
            <Retired />
          )}

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Salaried' ||
          values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Self-employed' ? (
            <>
              <TextInput
                label='Flat no/Building name'
                placeholder='Eg: C-101'
                required
                name={`applicants[${activeIndex}].work_income_detail.flat_no_building_name`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.flat_no_building_name}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.flat_no_building_name}
                touched={
                  touched?.applicants?.[activeIndex]?.work_income_detail?.flat_no_building_name
                }
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail?.flat_no_building_name &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.flat_no_building_name
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        flat_no_building_name:
                          values?.applicants?.[activeIndex]?.work_income_detail
                            ?.flat_no_building_name,
                      },
                    );
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
                name={`applicants[${activeIndex}].work_income_detail.street_area_locality`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.street_area_locality}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.street_area_locality}
                touched={
                  touched?.applicants?.[activeIndex]?.work_income_detail?.street_area_locality
                }
                onBlur={(e) => {
                  handleBlur(e);

                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail?.street_area_locality &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.street_area_locality
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        street_area_locality:
                          values?.applicants?.[activeIndex]?.work_income_detail
                            ?.street_area_locality,
                      },
                    );
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
                name={`applicants[${activeIndex}].work_income_detail.town`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.town}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.town}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.town}
                onBlur={(e) => {
                  handleBlur(e);

                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail?.town &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.town
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        town: values?.applicants?.[activeIndex]?.work_income_detail?.town,
                      },
                    );
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
                name={`applicants[${activeIndex}].work_income_detail.landmark`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.landmark}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.landmark}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.landmark}
                onBlur={(e) => {
                  handleBlur(e);

                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail?.landmark &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.landmark
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        landmark: values?.applicants?.[activeIndex]?.work_income_detail?.landmark,
                      },
                    );
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
                name={`applicants[${activeIndex}].work_income_detail.pincode`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.pincode}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.pincode}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.pincode}
                onBlur={(e) => {
                  handleBlur(e);

                  handleOnPincodeChange();

                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail?.pincode &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.pincode
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        pincode: values?.applicants?.[activeIndex]?.work_income_detail?.pincode,
                      },
                    );
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
                  setFieldValue(
                    `applicants[${activeIndex}].work_income_detail.pincode`,
                    e.target.value,
                  );
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
                  const text = (e.originalEvent || e).clipboardData
                    .getData('text/plain')
                    .replace('');
                  e.target.value = text;
                  setFieldValue(
                    `applicants[${activeIndex}].work_income_detail.pincode`,
                    e.target.value,
                  );
                }}
                inputClasses='hidearrow'
              />

              <TextInput
                label='City'
                placeholder='Eg: Nashik'
                disabled
                name={`applicants[${activeIndex}].work_income_detail.city`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.city}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.city}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.city}
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
                name={`applicants[${activeIndex}].work_income_detail.state`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.state}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.state}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.state}
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

          {professionOptions.length &&
          values?.applicants?.[activeIndex]?.work_income_detail?.profession ? (
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
                        name={`applicants[${activeIndex}].work_income_detail.total_family_number`}
                        value={option.value}
                        current={
                          values?.applicants?.[activeIndex]?.work_income_detail?.total_family_number
                        }
                        onChange={handleRadioChange}
                        containerClasses='flex-1'
                      ></CardRadioWithoutIcon>
                    );
                  })}
                </div>
              </div>

              <CurrencyInput
                label='Total household income'
                placeholder='Eg: 1,00,000'
                required
                name={`applicants[${activeIndex}].work_income_detail.total_household_income`}
                value={
                  values?.applicants?.[activeIndex]?.work_income_detail?.total_household_income
                }
                error={
                  errors?.applicants?.[activeIndex]?.work_income_detail?.total_household_income
                }
                touched={
                  touched?.applicants?.[activeIndex]?.work_income_detail?.total_household_income
                }
                onBlur={(e) => {
                  handleBlur(e);

                  if (
                    !errors?.applicants?.[activeIndex]?.work_income_detail
                      ?.total_household_income &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.total_household_income
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        total_household_income:
                          values?.applicants?.[activeIndex]?.work_income_detail
                            ?.total_household_income,
                      },
                    );
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
                        name={`applicants[${activeIndex}].work_income_detail.no_of_dependents`}
                        value={option.value}
                        current={
                          values?.applicants?.[activeIndex]?.work_income_detail?.no_of_dependents
                        }
                        onChange={handleRadioChange}
                        containerClasses='flex-1'
                      ></CardRadioWithoutIcon>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className='bottom-0 fixed'>
          <PreviousNextButtons
            linkPrevious='/lead/address-details'
            linkNext='/lead/qualifier'
            onNextClick={handleNextClick}
            onPreviousClick={() => setCurrentStepIndex(2)}
          />
        </div>
      </div>

      {/* For Phase 2----------------------- */}

      {/* <DynamicDrawer open={openExistingPopup} setOpen={setOpenExistingPopup} height='80vh'>
        <div className='flex flex-col items-center h-full'>
          <span className='w-full font-semibold text-[14px] leading-[21px]'>
            This is an existing customer.
          </span>
          <div className='flex flex-col flex-1 w-full gap-[7px] overflow-auto mt-[10px] mb-[10px]'>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Profession</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_id_type}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Company name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_id_number}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Total income</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_selected_address_proof
                }
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>PF UAN</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_address_proof_number
                }
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>No. of current loan(s)</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_first_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Ongoing EMI(s)</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_middle_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Working since</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_last_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Mode of salary</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_gender}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Flat no/Building name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.date_of_birth}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Street/Area/Locality</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.mobile_number}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Town</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_father_husband_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Landmark</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_mother_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Pincode</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.marital_status}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>City</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.religion}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>State</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.preferred_language}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Total family members</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.qualification}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Total household income</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.email}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>No. of dependents</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.email}
              </span>
            </div>
          </div>
          <span className='w-full text-[#96989A] font-normal text-[12px] text-left leading-[18px]'>
            ** Editable fields
          </span>
          <span className='w-full font-medium text-[14px] text-left mt-[6px] leading-[21px]'>
            Would the customer prefer to proceed with the same details?
          </span>
          <div className='w-full flex gap-4 mt-3'>
            <Button inputClasses='w-full h-[46px]' onClick={() => setOpenExistingPopup(false)}>
              No
            </Button>
            <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handleAutofill}>
              Yes
            </Button>
          </div>
        </div>
      </DynamicDrawer> */}
    </>
  );
};

export default WorkIncomeDetails;
