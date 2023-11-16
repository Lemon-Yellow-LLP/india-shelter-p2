import { professionOptions, noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import Salaried from './Salaried';
import SelfEmployed from './SelfEmployed';
import TextInput from '../../../../components/TextInput';
import UnEmployed from './UnEmployed';
import Retired from './Retired';
import CurrencyInput from '../../../../components/CurrencyInput';
import { addApi, checkIsValidStatePincode, editFieldsById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { newCoApplicantValues } from '../../../../context/NewCoApplicant';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';
import Popup from '../../../../components/Popup';
import { AuthContext } from '../../../../context/AuthContextProvider';

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
    activeIndex,
    setCurrentStepIndex,
    updateProgressApplicantSteps,
    pincodeErr,
    setPincodeErr,
    handleChange,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.required_fields_status,
  });

  const [openExistingPopup, setOpenExistingPopup] = useState(
    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing || false,
  );

  const [openQualifierNotActivePopup, setOpenQualifierNotActivePopup] = useState(false);

  const handleCloseQualifierNotActivePopup = () => {
    setOpenQualifierNotActivePopup(false);
  };

  useEffect(() => {
    setRequiredFieldsStatus(
      values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.required_fields_status,
    );
  }, [activeIndex]);

  useEffect(() => {
    updateProgressApplicantSteps('work_income_detail', requiredFieldsStatus, 'work-income');
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    async (e) => {
      const name = e.name.split('.')[2];

      if (name === 'profession') {
        let _requiredFieldStatus = {};

        if (e.value === 'Salaried') {
          if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
            _requiredFieldStatus = {
              profession: true,
              pan_number: false,
              company_name: false,
              salary_per_month: false,
              working_since: false,
              mode_of_salary: false,
              flat_no_building_name: false,
              street_area_locality: false,
              town: false,
              landmark: false,
              pincode: false,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: false,
              total_household_income: false,
              no_of_dependents: false,
            };
          } else {
            _requiredFieldStatus = {
              profession: true,
              pan_number: false,
              company_name: false,
              salary_per_month: false,
              working_since: false,
              mode_of_salary: false,
              flat_no_building_name: false,
              street_area_locality: false,
              town: false,
              landmark: false,
              pincode: false,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: true,
              total_household_income: true,
              no_of_dependents: true,
            };
          }
        } else if (e.value === 'Self-employed') {
          if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
            _requiredFieldStatus = {
              pan_number: false,
              no_of_employees: false,
              profession: true,
              business_name: false,
              industries: false,
              flat_no_building_name: false,
              street_area_locality: false,
              town: false,
              landmark: false,
              pincode: false,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: false,
              total_household_income: false,
              no_of_dependents: false,
            };
          } else {
            _requiredFieldStatus = {
              pan_number: false,
              no_of_employees: false,
              profession: true,
              business_name: false,
              industries: false,
              flat_no_building_name: false,
              street_area_locality: false,
              town: false,
              landmark: false,
              pincode: false,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: true,
              total_household_income: true,
              no_of_dependents: true,
            };
          }
        } else if (e.value === 'Unemployed') {
          if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
            _requiredFieldStatus = {
              income_proof: false,
              profession: true,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: false,
              total_household_income: false,
              no_of_dependents: false,
            };
          } else {
            _requiredFieldStatus = {
              income_proof: false,
              profession: true,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: true,
              total_household_income: true,
              no_of_dependents: true,
            };
          }
        } else if (e.value === 'Retired') {
          if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
            _requiredFieldStatus = {
              pan_number: false,
              profession: true,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: false,
              total_household_income: false,
              no_of_dependents: false,
              pention_amount: false,
            };
          } else {
            _requiredFieldStatus = {
              pan_number: false,
              profession: true,
              no_current_loan: false,
              ongoing_emi: false,
              total_family_number: true,
              total_household_income: true,
              no_of_dependents: true,
              pention_amount: false,
            };
          }
        }
        setRequiredFieldsStatus(_requiredFieldStatus);

        const newData = structuredClone(values);

        newData.applicants[activeIndex].work_income_detail = {
          ...newData.applicants[activeIndex].work_income_detail,
          applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
          profession: e.value,
          company_name: '',
          pan_number: '',
          no_of_employees: '',
          income_proof: '',
          udyam_number: '',
          salary_per_month: '',
          pf_uan: '',
          no_current_loan: null,
          ongoing_emi: '',
          working_since: '',
          mode_of_salary: '',
          flat_no_building_name: '',
          street_area_locality: '',
          town: '',
          landmark: '',
          pincode: '',
          city: '',
          state: '',
          total_family_number: '',
          total_household_income: '',
          no_of_dependents: '',
          business_name: '',
          industries: '',
          gst_number: '',
          pention_amount: '',
          extra_params: {
            extra_company_name: '',
            extra_industries: '',
            progress: 15,
            required_fields_status: _requiredFieldStatus,
          },
        };

        setValues(newData);

        if (values?.applicants?.[activeIndex]?.work_income_detail?.id) {
          editFieldsById(
            newData.applicants[activeIndex].work_income_detail.id,
            'work-income',
            newData.applicants[activeIndex].work_income_detail,
            {
              headers: {
                Authorization: token,
              },
            },
          );

          return;
        } else {
          await addApi('work-income', newData.applicants[activeIndex].work_income_detail, {
            headers: {
              Authorization: token,
            },
          })
            .then(async (res) => {
              setFieldValue(`applicants[${activeIndex}].work_income_detail`, {
                ...newData.applicants[activeIndex].work_income_detail,
                id: res.id,
              });

              setRequiredFieldsStatus(() => ({
                ...newData.applicants[activeIndex].work_income_detail.extra_params
                  .required_fields_status,
                [name]: true,
              }));

              await editFieldsById(
                values?.applicants?.[activeIndex]?.applicant_details?.id,
                'applicant',
                { work_income_detail: res.id },
                {
                  headers: {
                    Authorization: token,
                  },
                },
              );
              return res;
            })
            .catch((err) => {
              console.log(err);
              return err;
            });
        }
      }

      setFieldValue(e.name, e.value);

      if (values?.applicants?.[activeIndex]?.work_income_detail?.id) {
        editFieldsById(
          values?.applicants?.[activeIndex]?.work_income_detail?.id,
          'work-income',
          {
            [name]: e.value,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        if (!requiredFieldsStatus[name]) {
          setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
        }
      }
      // else {
      //   let clonedCoApplicantValues = structuredClone(newCoApplicantValues);
      //   let addData = { ...clonedCoApplicantValues.work_income_detail, [name]: e.value };
      //   if (requiredFieldsStatus && !requiredFieldsStatus[name]) {
      //     setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      //   }

      //   await addApi('work-income', {
      //     ...addData,
      //     applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
      //   })
      //     .then(async (res) => {
      //       setFieldValue(`applicants[${activeIndex}].work_income_detail.id`, res.id);
      //       await editFieldsById(
      //         values?.applicants?.[activeIndex]?.applicant_details?.id,
      //         'applicant',
      //         { work_income_detail: res.id },
      //       );
      //       return res;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       return err;
      //     });
      // }
    },
    [values, requiredFieldsStatus, setRequiredFieldsStatus],
  );

  const handleOnPincodeChange = async () => {
    if (
      !values?.applicants?.[activeIndex]?.work_income_detail?.pincode ||
      values?.applicants?.[activeIndex]?.work_income_detail?.pincode.toString().length < 5 ||
      errors?.applicants?.[activeIndex]?.work_income_detail?.pincode
    ) {
      setFieldValue(`applicants[${activeIndex}].work_income_detail.city`, '');
      setFieldValue(`applicants[${activeIndex}].work_income_detail.state`, '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: false }));

      editFieldsById(
        values?.applicants?.[activeIndex]?.work_income_detail?.id,
        'work-income',
        {
          city: '',
          state: '',
          pincode: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      return;
    }

    const res = await checkIsValidStatePincode(
      values?.applicants?.[activeIndex]?.work_income_detail?.pincode,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!res) {
      setFieldError(`applicants[${activeIndex}].work_income_detail.pincode`, 'Invalid Pincode');
      setPincodeErr((prev) => ({
        ...prev,
        [`work_income_detail_${activeIndex}`]: 'Invalid Pincode',
      }));
      setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: false }));

      setFieldValue(`applicants[${activeIndex}].work_income_detail.city`, '');
      setFieldValue(`applicants[${activeIndex}].work_income_detail.state`, '');

      editFieldsById(
        values?.applicants?.[activeIndex]?.work_income_detail?.id,
        'work-income',
        {
          city: '',
          state: '',
          pincode: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return;
    }

    editFieldsById(
      values?.applicants?.[activeIndex]?.work_income_detail?.id,
      'work-income',
      {
        city: res.city,
        state: res.state,
        pincode: values?.applicants?.[activeIndex]?.work_income_detail?.pincode,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setFieldValue(`applicants[${activeIndex}].work_income_detail.city`, res.city);
    setFieldValue(`applicants[${activeIndex}].work_income_detail.state`, res.state);
    setPincodeErr((prev) => ({ ...prev, [`work_income_detail_${activeIndex}`]: '' }));

    if (!requiredFieldsStatus['pincode']) {
      setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: true }));
    }
  };

  const handleNextClick = () => {
    setCurrentStepIndex(4);
    // updateFields();
  };

  const handleAutofill = () => {
    console.log('autofill work-income');
  };

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN' &&
      values?.applicants?.[activeIndex]?.personal_details?.id_number
    ) {
      editFieldsById(
        values?.applicants?.[activeIndex]?.work_income_detail.id,
        'work-income',
        {
          pan_number: values?.applicants?.[activeIndex]?.personal_details?.id_number,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }
  }, [values?.applicants?.[activeIndex]?.personal_details?.id_type]);

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN' &&
      values?.applicants?.[activeIndex]?.personal_details?.id_number
    ) {
      setFieldValue(
        `applicants[${activeIndex}].work_income_detail.pan_number`,
        values?.applicants?.[activeIndex]?.personal_details?.id_number,
      );
    }
  }, [values?.applicants?.[activeIndex]?.work_income_detail?.pan_number]);

  return (
    <>
      <Popup
        handleClose={handleCloseQualifierNotActivePopup}
        open={openQualifierNotActivePopup}
        setOpen={setOpenQualifierNotActivePopup}
        title='Qualifier is not activated'
        description='Complete Applicant, Personal, Address and Work & Income details to activate'
      />
      <div className='overflow-hidden flex flex-col h-[100vh] justify-between'>
        {values?.applicants[activeIndex]?.applicant_details?.is_primary ? (
          <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
        ) : (
          <Topbar
            title='Adding Co-applicant'
            id={values?.lead?.id}
            showClose={false}
            showBack={true}
            coApplicant={true}
            coApplicantName={values?.applicants[activeIndex]?.applicant_details?.first_name}
          />
        )}
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[150px] flex-1'>
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
                    disabled={
                      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                    }
                  >
                    {option.icon}
                  </CardRadio>
                );
              })}
            </div>

            {values?.applicants?.[activeIndex]?.work_income_detail?.profession !== 'Unemployed' &&
            !!values?.applicants?.[activeIndex]?.work_income_detail?.profession ? (
              <TextInput
                label='Enter PAN number'
                placeholder='EG ABCD1256D'
                required
                name={`applicants[${activeIndex}].work_income_detail.pan_number`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.pan_number}
                onChange={(e) => {
                  setFieldValue(e.target.name, e.target.value.toUpperCase());
                }}
                inputClasses='capitalize'
                error={errors.applicants?.[activeIndex]?.work_income_detail?.pan_number}
                touched={
                  touched?.applicants &&
                  touched?.applicants?.[activeIndex]?.work_income_detail?.pan_number
                }
                disabled={
                  (values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN' &&
                    values?.applicants?.[activeIndex]?.personal_details?.id_number) ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                // labelDisabled={!values?.applicants?.[activeIndex]?.personal_details?.id_type}
                onBlur={(e) => {
                  handleBlur(e);

                  if (
                    !errors.applicants?.[activeIndex]?.work_income_detail?.pan_number &&
                    values?.applicants?.[activeIndex]?.work_income_detail?.pan_number
                  ) {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail.id,
                      'work-income',
                      {
                        pan_number: e.target.value,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                    const name = e.target.name.split('.')[2];

                    setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                  } else {
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail.id,
                      'work-income',
                      {
                        pan_number: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                  }
                }}
                // onKeyDown={(e) => {
                //   if (
                //     e.key === 'ArrowUp' ||
                //     e.key === 'ArrowDown' ||
                //     e.key === 'ArrowLeft' ||
                //     e.key === 'ArrowRight' ||
                //     e.key === ' ' ||
                //     e.keyCode === 32 ||
                //     (e.keyCode >= 65 && e.keyCode <= 90)
                //   ) {
                //     e.preventDefault();
                //   }
                // }}
              />
            ) : null}

            {errors?.applicants?.[activeIndex]?.work_income_detail?.profession &&
            touched?.applicants?.[activeIndex]?.work_income_detail?.profession ? (
              <span
                className='text-xs text-primary-red'
                dangerouslySetInnerHTML={{
                  __html: errors?.applicants?.[activeIndex]?.work_income_detail?.profession,
                }}
              />
            ) : (
              ''
            )}
          </div>

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Salaried' && (
            <Salaried
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
            />
          )}

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession ===
            'Self-employed' && (
            <SelfEmployed
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
            />
          )}

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Unemployed' && (
            <UnEmployed
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
            />
          )}

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Retired' && (
            <Retired
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
            />
          )}

          {values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Salaried' ||
          values?.applicants?.[activeIndex]?.work_income_detail?.profession === 'Self-employed' ? (
            <>
              <TextInput
                label='Plot no/Building name'
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['flat_no_building_name']: false,
                    }));
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        flat_no_building_name: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!address_pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );

                    if (!requiredFieldsStatus['flat_no_building_name']) {
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        ['flat_no_building_name']: true,
                      }));
                    }
                  }
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['street_area_locality']: false,
                    }));

                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        street_area_locality: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!address_pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );

                    if (!requiredFieldsStatus['street_area_locality']) {
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        ['street_area_locality']: true,
                      }));
                    }
                  }
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
              />

              <TextInput
                label='Town'
                placeholder='Eg: Igatpuri'
                required
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['town']: false,
                    }));

                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        town: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!address_pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );

                    if (!requiredFieldsStatus['town']) {
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        ['town']: true,
                      }));
                    }
                  }
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['landmark']: false,
                    }));
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        landmark: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!address_pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );

                    if (!requiredFieldsStatus['landmark']) {
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        ['landmark']: true,
                      }));
                    }
                  }
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
              />

              <TextInput
                required
                type='tel'
                hint='City and State fields will get filled based on Pincode'
                placeholder='Eg: 123456'
                label='Pincode'
                name={`applicants[${activeIndex}].work_income_detail.pincode`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.pincode}
                error={
                  errors?.applicants?.[activeIndex]?.work_income_detail?.pincode ||
                  pincodeErr?.[`work_income_detail_${activeIndex}`]
                }
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['pincode']: false,
                    }));
                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        pincode: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
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
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
              />

              <TextInput
                label='City'
                placeholder='Eg: Nashik'
                disabled={true}
                name={`applicants[${activeIndex}].work_income_detail.city`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.city}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.city}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.city}
                onBlur={handleBlur}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                labelDisabled={!values?.applicants?.[activeIndex]?.work_income_detail?.city}
              />

              <TextInput
                label='State'
                placeholder='Eg: Maharashtra'
                disabled={true}
                name={`applicants[${activeIndex}].work_income_detail.state`}
                value={values?.applicants?.[activeIndex]?.work_income_detail?.state}
                error={errors?.applicants?.[activeIndex]?.work_income_detail?.state}
                touched={touched?.applicants?.[activeIndex]?.work_income_detail?.state}
                onBlur={handleBlur}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                labelDisabled={!values?.applicants?.[activeIndex]?.work_income_detail?.state}
              />
            </>
          ) : null}

          {professionOptions.length &&
          values?.applicants?.[activeIndex]?.applicant_details.is_primary &&
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
                        disabled={
                          values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                            ?.qualifier
                        }
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
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      ['total_household_income']: false,
                    }));

                    editFieldsById(
                      values?.applicants?.[activeIndex]?.work_income_detail?.id,
                      'work-income',
                      {
                        total_household_income: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  const address_pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (address_pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );

                    if (!requiredFieldsStatus['total_household_income']) {
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        ['total_household_income']: true,
                      }));
                    }
                  }
                }}
                disabled={
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                        disabled={
                          values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                            ?.qualifier
                        }
                      ></CardRadioWithoutIcon>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <PreviousNextButtons
          linkPrevious='/lead/address-details'
          linkNext={
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.personal_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.address_detail?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.progress !== 100
              ? null
              : '/lead/qualifier'
          }
          onNextClick={() =>
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.personal_details?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.address_detail?.extra_params?.progress !== 100 ||
            values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.progress !== 100
              ? setOpenQualifierNotActivePopup(true)
              : handleNextClick()
          }
          onPreviousClick={() => setCurrentStepIndex(2)}
        />

        <SwipeableDrawerComponent />
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
