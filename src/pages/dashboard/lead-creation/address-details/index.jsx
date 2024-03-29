import { useContext, useState, useCallback, useEffect } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { Button, CardRadio, TextInput } from '../../../../components';
import {
  addApi,
  checkIsValidStatePincode,
  editAddressById,
  editFieldsById,
} from '../../../../global';
import { AuthContext } from '../../../../context/AuthContextProvider';
import Checkbox from '../../../../components/Checkbox';
import { residenceData, typeOfAddressData, yearsResidingData } from './AddressDropdownData';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { newCoApplicantValues } from '../../../../context/NewCoApplicant';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

export default function AddressDetails() {
  const {
    inputDisabled,
    values,
    errors,
    touched,
    handleBlur,
    setFieldError,
    setFieldValue,
    updateProgressApplicantSteps,
    activeIndex,
    setCurrentStepIndex,
    pincodeErr,
    setPincodeErr,
    setFieldTouched,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const [openExistingPopup, setOpenExistingPopup] = useState(
    values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence &&
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
      !values?.applicants?.[activeIndex]?.address_detail?.extra_params?.is_existing_done
      ? true
      : false,
  );

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicants?.[activeIndex]?.address_detail?.extra_params?.required_fields_status,
  });

  useEffect(() => {
    setRequiredFieldsStatus(
      values?.applicants?.[activeIndex]?.address_detail?.extra_params?.required_fields_status,
    );
  }, [activeIndex]);

  useEffect(() => {
    updateProgressApplicantSteps('address_detail', requiredFieldsStatus, 'address');
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    async (e) => {
      if (
        e.value === 'Rented' &&
        values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current
      ) {
        handleAdditionalSameAsCurrentAddress(false, e.value);
      }

      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[2];
      if (values?.applicants?.[activeIndex]?.address_detail?.id) {
        await editAddressById(
          values?.applicants?.[activeIndex]?.address_detail?.id,
          {
            [name]: e.value,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      } else {
        let clonedCoApplicantValues = structuredClone(newCoApplicantValues);
        let addData = { ...clonedCoApplicantValues.address_detail, [name]: e.value };
        await addApi(
          'address',
          {
            ...addData,
            applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        )
          .then(async (res) => {
            setFieldValue(`applicants[${activeIndex}].address_detail`, {
              ...addData,
              applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
              id: res.id,
            });
            setRequiredFieldsStatus(() => ({
              ...addData.extra_params.required_fields_status,
              [name]: true,
            }));
            await editFieldsById(
              values?.applicants[activeIndex]?.applicant_details?.id,
              'applicant',
              { address_detail: res.id },
              {
                headers: {
                  Authorization: token,
                },
              },
            ).then(() => {
              return res;
            });
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }

      if (
        values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current &&
        name === 'current_no_of_year_residing'
      ) {
        setFieldValue(
          `applicants[${activeIndex}].address_detail.additional_no_of_year_residing`,
          e.value,
        );
        editAddressById(
          values?.applicants?.[activeIndex]?.address_detail?.id,
          {
            additional_no_of_year_residing:
              values?.applicants?.[activeIndex]?.address_detail?.current_no_of_year_residing,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }

      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [setFieldValue, values],
  );

  const handleCurrentPincodeChange = async (value) => {
    if (!value || value.toString().length < 5) {
      setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, '');
      setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['current_pincode']: false }));

      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          current_pincode: '',
          current_city: '',
          current_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (
        values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current
      ) {
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, '');
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');

        editAddressById(
          values?.applicants?.[activeIndex]?.address_detail?.id,
          {
            additional_pincode: '',
            additional_city: '',
            additional_state: '',
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }

      return;
    }

    const res = await checkIsValidStatePincode(value, {
      headers: {
        Authorization: token,
      },
    });
    if (!res) {
      setFieldError(`applicants[${activeIndex}].address_detail.current_pincode`, 'Invalid Pincode');
      setFieldTouched(`applicants[${activeIndex}].address_detail.current_pincode`);
      setPincodeErr((prev) => ({ ...prev, [`address_current_${activeIndex}`]: 'Invalid Pincode' }));

      setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, '');
      setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['current_pincode']: false }));

      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          current_pincode: '',
          current_city: '',
          current_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (
        values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current
      ) {
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, '');
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
        setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');
      }

      return;
    }

    editAddressById(
      values?.applicants?.[activeIndex]?.address_detail?.id,
      {
        current_pincode: value,
        current_city: res.city,
        current_state: res.state,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, res.city);
    setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, res.state);
    setPincodeErr((prev) => ({ ...prev, [`address_current_${activeIndex}`]: '' }));

    if (
      values?.applicants?.[activeIndex]?.address_detail?.extra_params
        ?.additional_address_same_as_current
    ) {
      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          additional_pincode: value,
          additional_city: res.city,
          additional_state: res.state,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, value);
      setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, res.city);
      setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, res.state);

      setPincodeErr((prev) => ({ ...prev, [`address_additional_${activeIndex}`]: '' }));
    }

    if (!requiredFieldsStatus['current_pincode']) {
      setRequiredFieldsStatus((prev) => ({ ...prev, ['current_pincode']: true }));
    }
  };

  const handleAdditionalPincodeChange = async (value) => {
    if (!value || value.toString().length < 5) {
      setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
      setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['additional_pincode']: false }));

      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          additional_pincode: '',
          additional_city: '',
          additional_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return;
    }
    const res = await checkIsValidStatePincode(value, {
      headers: {
        Authorization: token,
      },
    });

    if (!res) {
      setFieldError(
        `applicants[${activeIndex}].address_detail.additional_pincode`,
        'Invalid Pincode',
      );

      setFieldTouched(`applicants[${activeIndex}].address_detail.additional_pincode`);
      setPincodeErr((prev) => ({
        ...prev,
        [`address_additional_${activeIndex}`]: 'Invalid Pincode',
      }));

      setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
      setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['additional_pincode']: false }));

      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          additional_pincode: '',
          additional_city: '',
          additional_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return;
    }

    editAddressById(
      values?.applicants?.[activeIndex]?.address_detail?.id,
      {
        additional_pincode: value,
        additional_city: res.city,
        additional_state: res.state,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, res.city);
    setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, res.state);
    setPincodeErr((prev) => ({ ...prev, [`address_additional_${activeIndex}`]: '' }));

    if (!requiredFieldsStatus['additional_pincode']) {
      setRequiredFieldsStatus((prev) => ({ ...prev, ['additional_pincode']: true }));
    }
  };

  const handleAdditionalSameAsCurrentAddress = (isChecked, current_type_of_residence) => {
    if (isChecked) {
      let newData = structuredClone(values);

      newData.applicants[activeIndex].address_detail = {
        ...newData.applicants[activeIndex].address_detail,
        additional_flat_no_building_name:
          values?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name,
        additional_street_area_locality:
          values?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality,
        additional_town: values?.applicants?.[activeIndex]?.address_detail?.current_town,
        additional_landmark: values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
        additional_pincode: values?.applicants?.[activeIndex]?.address_detail?.current_pincode,
        additional_city: values?.applicants?.[activeIndex]?.address_detail?.current_city,
        additional_state: values?.applicants?.[activeIndex]?.address_detail?.current_state,
        additional_no_of_year_residing:
          values?.applicants?.[activeIndex]?.address_detail?.current_no_of_year_residing,
        current_type_of_residence: current_type_of_residence,
        extra_params: {
          ...newData.applicants[activeIndex].address_detail?.extra_params,
          additional_address_same_as_current: isChecked,
        },
      };

      setFieldValue(
        `applicants[${activeIndex}].address_detail`,
        newData.applicants[activeIndex].address_detail,
      );

      setRequiredFieldsStatus((prev) => ({
        ...prev,
        additional_flat_no_building_name: true,
        additional_street_area_locality: true,
        additional_town: true,
        additional_landmark: true,
        additional_pincode: true,
        additional_no_of_year_residing: true,
      }));

      setFieldTouched(`applicants[${activeIndex}].address_detail.additional_pincode`, false);
    } else {
      let newData = structuredClone(values);

      newData.applicants[activeIndex].address_detail = {
        ...newData.applicants[activeIndex].address_detail,
        additional_flat_no_building_name: '',
        additional_street_area_locality: '',
        additional_town: '',
        additional_landmark: '',
        additional_pincode: '',
        additional_city: '',
        additional_state: '',
        additional_no_of_year_residing: null,
        extra_params: {
          ...newData.applicants[activeIndex].address_detail?.extra_params,
          additional_address_same_as_current: isChecked,
        },
      };

      setFieldValue(
        `applicants[${activeIndex}].address_detail`,
        newData.applicants[activeIndex].address_detail,
      );

      setRequiredFieldsStatus((prev) => ({
        ...prev,
        additional_flat_no_building_name: false,
        additional_street_area_locality: false,
        additional_town: false,
        additional_landmark: false,
        additional_pincode: false,
        additional_no_of_year_residing: false,
      }));
    }

    if (values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence) {
      editAddressById(
        values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          additional_flat_no_building_name:
            values?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name,
          additional_street_area_locality:
            values?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality,
          additional_town: values?.applicants?.[activeIndex]?.address_detail?.current_town,
          additional_landmark: values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
          additional_pincode: values?.applicants?.[activeIndex]?.address_detail?.current_pincode,
          additional_city: values?.applicants?.[activeIndex]?.address_detail?.current_city,
          additional_state: values?.applicants?.[activeIndex]?.address_detail?.current_state,
          additional_no_of_year_residing:
            values?.applicants?.[activeIndex]?.address_detail?.current_no_of_year_residing,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }
  };

  const handleNextClick = () => {
    setCurrentStepIndex(3);
    // updateFields();
  };

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence &&
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
      !values?.applicants?.[activeIndex]?.address_detail?.extra_params?.is_existing_done
    ) {
      setOpenExistingPopup(true);
    } else {
      setOpenExistingPopup(false);
    }
  }, [
    values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence,
    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing,
    values?.applicants?.[activeIndex]?.address_detail?.extra_params?.is_existing_done,
  ]);

  const handleAutofill = async () => {
    const fillData = { ...values.applicants?.[activeIndex]?.applicant_details };

    const {
      existing_customer_current_flat_no_building_name,
      existing_customer_current_street_area_locality,
      existing_customer_current_town,
      existing_customer_current_landmark,
      existing_customer_current_pincode,
      existing_customer_current_city,
      existing_customer_current_state,
      existing_customer_current_no_of_year_residing,

      existing_customer_additional_flat_no_building_name,
      existing_customer_additional_street_area_locality,
      existing_customer_additional_town,
      existing_customer_additional_landmark,
      existing_customer_additional_pincode,
      existing_customer_additional_city,
      existing_customer_additional_state,
      existing_customer_additional_no_of_year_residing,
    } = fillData;

    const mappedData = {
      current_flat_no_building_name: existing_customer_current_flat_no_building_name,
      current_street_area_locality: existing_customer_current_street_area_locality,
      current_town: existing_customer_current_town,
      current_landmark: existing_customer_current_landmark,
      current_pincode: existing_customer_current_pincode,
      // current_city: existing_customer_current_city,
      // current_state: existing_customer_current_state,
      current_no_of_year_residing: existing_customer_current_no_of_year_residing,

      additional_flat_no_building_name: existing_customer_additional_flat_no_building_name,
      additional_street_area_locality: existing_customer_additional_street_area_locality,
      additional_town: existing_customer_additional_town,
      additional_landmark: existing_customer_additional_landmark,
      additional_pincode: existing_customer_additional_pincode,
      // additional_city: existing_customer_additional_city,
      // additional_state: existing_customer_additional_state,
      additional_no_of_year_residing: existing_customer_additional_no_of_year_residing,
    };

    let finalData = structuredClone(values);

    finalData.applicants[activeIndex].address_detail = {
      ...finalData.applicants[activeIndex].address_detail,
      ...mappedData,
    };

    const filteredMappedData = Object.entries(mappedData)
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const updatedRequiredFieldsStatus = Object.fromEntries(
      Object.entries(requiredFieldsStatus).map(([key, value]) => [
        key,
        key in filteredMappedData ? true : value,
      ]),
    );

    setFieldValue(`applicants[${activeIndex}].address_detail`, {
      ...finalData.applicants[activeIndex].address_detail,
      extra_params: {
        ...finalData.applicants[activeIndex].address_detail.extra_params,
        is_existing_done: true,
      },
    });

    if (values?.applicants[activeIndex]?.address_detail?.id) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.address_detail?.id,
        'address',
        {
          ...finalData.applicants[activeIndex].address_detail,
          extra_params: {
            ...finalData.applicants[activeIndex].address_detail.extra_params,
            is_existing_done: true,
          },
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }

    setRequiredFieldsStatus(updatedRequiredFieldsStatus);

    setOpenExistingPopup(false);

    handleCurrentPincodeChange(existing_customer_current_pincode);

    handleAdditionalPincodeChange(existing_customer_additional_pincode);
  };

  return (
    <>
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
                  name={`applicants[${activeIndex}].address_detail.current_type_of_residence`}
                  value={residence.value}
                  current={
                    values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence
                  }
                  onChange={handleRadioChange}
                  disabled={
                    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                  }
                >
                  {residence.icon}
                </CardRadio>
              ))}
            </div>
          </div>

          {values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence ? (
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
                name={`applicants[${activeIndex}].address_detail.current_flat_no_building_name`}
                value={
                  values?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name
                }
                error={
                  errors?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name
                }
                touched={
                  touched?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name
                }
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail
                      ?.current_flat_no_building_name &&
                    values?.applicants?.[activeIndex]?.address_detail?.current_flat_no_building_name
                  ) {
                    if (
                      values?.applicants?.[activeIndex]?.address_detail?.extra_params
                        ?.additional_address_same_as_current
                    ) {
                      setFieldValue(
                        `applicants[${activeIndex}].address_detail.additional_flat_no_building_name`,
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.current_flat_no_building_name,
                      );
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_flat_no_building_name:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_flat_no_building_name,
                          additional_flat_no_building_name:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_flat_no_building_name,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_flat_no_building_name: true,
                        additional_flat_no_building_name: true,
                      }));
                    } else {
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_flat_no_building_name:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_flat_no_building_name,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_flat_no_building_name: true,
                      }));
                    }
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      current_flat_no_building_name: false,
                    }));

                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        current_flat_no_building_name: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                  } else if (value == '') {
                    setFieldValue(e.currentTarget.name, value);
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Street/Area/Locality'
                placeholder='Eg: Senapati road'
                required
                name={`applicants[${activeIndex}].address_detail.current_street_area_locality`}
                value={
                  values?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality
                }
                error={
                  errors?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality
                }
                touched={
                  touched?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality
                }
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail
                      ?.current_street_area_locality &&
                    values?.applicants?.[activeIndex]?.address_detail?.current_street_area_locality
                  ) {
                    if (
                      values?.applicants?.[activeIndex]?.address_detail?.extra_params
                        ?.additional_address_same_as_current
                    ) {
                      setFieldValue(
                        `applicants[${activeIndex}].address_detail.additional_street_area_locality`,
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.current_street_area_locality,
                      );
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_street_area_locality:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_street_area_locality,
                          additional_street_area_locality:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_street_area_locality,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );
                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_street_area_locality: true,
                        additional_street_area_locality: true,
                      }));
                    } else {
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_street_area_locality:
                            values?.applicants?.[activeIndex]?.address_detail
                              ?.current_street_area_locality,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_street_area_locality: true,
                      }));
                    }
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      current_street_area_locality: false,
                    }));

                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        current_street_area_locality: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                  } else if (value == '') {
                    setFieldValue(e.currentTarget.name, value);
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Town'
                placeholder='Eg: Igatpuri'
                required
                name={`applicants[${activeIndex}].address_detail.current_town`}
                value={values?.applicants?.[activeIndex]?.address_detail?.current_town}
                error={errors?.applicants?.[activeIndex]?.address_detail?.current_town}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.current_town}
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail?.current_town &&
                    values?.applicants?.[activeIndex]?.address_detail?.current_town
                  ) {
                    if (
                      values?.applicants?.[activeIndex]?.address_detail?.extra_params
                        ?.additional_address_same_as_current
                    ) {
                      setFieldValue(
                        `applicants[${activeIndex}].address_detail.additional_town`,
                        values?.applicants?.[activeIndex]?.address_detail?.current_town,
                      );
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_town:
                            values?.applicants?.[activeIndex]?.address_detail?.current_town,
                          additional_town:
                            values?.applicants?.[activeIndex]?.address_detail?.current_town,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_town: true,
                        additional_town: true,
                      }));
                    } else {
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_town:
                            values?.applicants?.[activeIndex]?.address_detail?.current_town,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_town: true,
                      }));
                    }
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      current_town: false,
                    }));

                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        current_town: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Landmark'
                placeholder='Eg: Near apollo hospital'
                required
                name={`applicants[${activeIndex}].address_detail.current_landmark`}
                value={values?.applicants?.[activeIndex]?.address_detail?.current_landmark}
                error={errors?.applicants?.[activeIndex]?.address_detail?.current_landmark}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.current_landmark}
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail?.current_landmark &&
                    values?.applicants?.[activeIndex]?.address_detail?.current_landmark
                  ) {
                    if (
                      values?.applicants?.[activeIndex]?.address_detail?.extra_params
                        ?.additional_address_same_as_current
                    ) {
                      setFieldValue(
                        `applicants[${activeIndex}].address_detail.additional_landmark`,
                        values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
                      );
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_landmark:
                            values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
                          additional_landmark:
                            values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );

                      setRequiredFieldsStatus((prev) => ({
                        ...prev,
                        current_landmark: true,
                        additional_landmark: true,
                      }));
                    } else {
                      editAddressById(
                        values?.applicants?.[activeIndex]?.address_detail?.id,
                        {
                          current_landmark:
                            values?.applicants?.[activeIndex]?.address_detail?.current_landmark,
                        },
                        {
                          headers: {
                            Authorization: token,
                          },
                        },
                      );
                    }

                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      current_landmark: true,
                    }));
                  } else {
                    setRequiredFieldsStatus((prev) => ({
                      ...prev,
                      current_landmark: false,
                    }));

                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        current_landmark: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Pincode'
                placeholder='Eg: 123456'
                required
                name={`applicants[${activeIndex}].address_detail.current_pincode`}
                type='tel'
                // hint='City and State fields will get filled based on Pincode'
                value={values?.applicants?.[activeIndex]?.address_detail?.current_pincode}
                error={
                  errors?.applicants?.[activeIndex]?.address_detail?.current_pincode ||
                  pincodeErr?.[`address_current_${activeIndex}`]
                }
                touched={touched?.applicants?.[activeIndex]?.address_detail?.current_pincode}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onBlur={(e) => {
                  handleBlur(e);
                  handleCurrentPincodeChange(
                    values?.applicants?.[activeIndex]?.address_detail?.current_pincode,
                  );

                  if (
                    errors?.applicants?.[activeIndex]?.address_detail?.current_landmark ||
                    !values?.applicants?.[activeIndex]?.address_detail?.current_landmark
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        current_pincode: '',
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
                    `applicants[${activeIndex}].address_detail.current_pincode`,
                    e.currentTarget.value,
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
                    `applicants[${activeIndex}].address_detail.current_pincode`,
                    e.target.value,
                  );
                }}
                inputClasses='hidearrow'
              />

              <TextInput
                label='City'
                placeholder='Eg: Nashik'
                name={`applicants[${activeIndex}].address_detail.current_city`}
                value={values?.applicants?.[activeIndex]?.address_detail?.current_city}
                error={errors?.applicants?.[activeIndex]?.address_detail?.current_city}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.current_city}
                onBlur={handleBlur}
                disabled={true}
                labelDisabled={!values?.applicants?.[activeIndex]?.address_detail?.current_city}
                onChange={() => {}}
                inputClasses='capitalize'
              />

              <TextInput
                label='State'
                placeholder='Eg: Maharashtra'
                name={`applicants[${activeIndex}].address_detail.current_state`}
                value={values?.applicants?.[activeIndex]?.address_detail?.current_state}
                error={errors?.applicants?.[activeIndex]?.address_detail?.current_state}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.current_state}
                onBlur={handleBlur}
                disabled={true}
                labelDisabled={!values?.applicants?.[activeIndex]?.address_detail?.current_state}
                onChange={() => {}}
                inputClasses='capitalize'
              />

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='loan-purpose'
                  className='flex gap-0.5 font-medium text-primary-black'
                >
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
                      name={`applicants[${activeIndex}].address_detail.current_no_of_year_residing`}
                      value={data.value}
                      current={
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.current_no_of_year_residing
                      }
                      onChange={handleRadioChange}
                      disabled={
                        values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                          ?.qualifier
                      }
                    >
                      <span
                        className={`${
                          index ==
                          values?.applicants?.[activeIndex]?.address_detail
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
              {values?.applicants?.[activeIndex]?.address_detail?.current_type_of_residence ===
              'Self owned' ? (
                <div className='flex items-center gap-2 mt-6'>
                  <Checkbox
                    checked={
                      values?.applicants?.[activeIndex]?.address_detail?.extra_params
                        ?.additional_address_same_as_current
                    }
                    name={`applicants[${activeIndex}].address_detail.additional_address_same_as_current`}
                    onTouchEnd={() => {}}
                    onChange={(e) => {
                      let isChecked = !!e.target.checked;
                      handleAdditionalSameAsCurrentAddress(
                        isChecked,
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.current_type_of_residence,
                      );
                    }}
                    disabled={
                      values?.applicants?.[activeIndex]?.address_detail
                        ?.current_type_of_residence !== 'Self owned' ||
                      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                    }
                  />

                  <span className='text-[#373435] text-xs font-normal'>
                    Additional address is same as Current address
                  </span>
                </div>
              ) : null}

              {/* Additional Address */}
              <label
                htmlFor='loan-purpose'
                className='flex gap-0.5 font-medium text-primary-black text-xl mt-3'
              >
                Additional Address
              </label>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='loan-purpose'
                  className='flex gap-0.5 font-medium text-primary-black'
                >
                  Type of address <span className='text-primary-red text-xs'>*</span>
                </label>

                <div
                  className={`flex gap-4 w-full ${
                    inputDisabled ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto'
                  }`}
                >
                  {typeOfAddressData.map((type, index) => (
                    <CardRadio
                      key={index}
                      label={type.label}
                      name={`applicants[${activeIndex}].address_detail.additional_type_of_residence`}
                      value={type.value}
                      current={
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.additional_type_of_residence
                      }
                      onChange={handleRadioChange}
                      disabled={
                        values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                          ?.qualifier
                      }
                    >
                      {type.icon}
                    </CardRadio>
                  ))}
                </div>
              </div>

              <TextInput
                label='Flat no/Building name'
                placeholder='Eg: C-101'
                required
                name={`applicants[${activeIndex}].address_detail.additional_flat_no_building_name`}
                value={
                  values?.applicants?.[activeIndex]?.address_detail
                    ?.additional_flat_no_building_name
                }
                error={
                  errors?.applicants?.[activeIndex]?.address_detail
                    ?.additional_flat_no_building_name
                }
                touched={
                  touched?.applicants?.[activeIndex]?.address_detail
                    ?.additional_flat_no_building_name
                }
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail
                      ?.additional_flat_no_building_name &&
                    values?.applicants?.[activeIndex]?.address_detail
                      ?.additional_flat_no_building_name
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_flat_no_building_name:
                          values?.applicants?.[activeIndex]?.address_detail
                            ?.additional_flat_no_building_name,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                    }
                  } else {
                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                    }
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_flat_no_building_name: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.address_detail?.extra_params
                    ?.additional_address_same_as_current ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Street/Area/Locality'
                placeholder='Eg: Senapati road'
                required
                name={`applicants[${activeIndex}].address_detail.additional_street_area_locality`}
                value={
                  values?.applicants?.[activeIndex]?.address_detail?.additional_street_area_locality
                }
                error={
                  errors?.applicants?.[activeIndex]?.address_detail?.additional_street_area_locality
                }
                touched={
                  touched?.applicants?.[activeIndex]?.address_detail
                    ?.additional_street_area_locality
                }
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail
                      ?.additional_street_area_locality &&
                    values?.applicants?.[activeIndex]?.address_detail
                      ?.additional_street_area_locality
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_street_area_locality:
                          values?.applicants?.[activeIndex]?.address_detail
                            ?.additional_street_area_locality,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                    }
                  } else {
                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                    }
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_street_area_locality: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.address_detail?.extra_params
                    ?.additional_address_same_as_current ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
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
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Town'
                placeholder='Eg: Igatpuri'
                required
                name={`applicants[${activeIndex}].address_detail.additional_town`}
                value={values?.applicants?.[activeIndex]?.address_detail?.additional_town}
                error={errors?.applicants?.[activeIndex]?.address_detail?.additional_town}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.additional_town}
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail?.additional_town &&
                    values?.applicants?.[activeIndex]?.address_detail?.additional_town
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_town:
                          values?.applicants?.[activeIndex]?.address_detail?.additional_town,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                    }
                  } else {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_town: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                    }
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.address_detail?.extra_params
                    ?.additional_address_same_as_current ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Landmark'
                placeholder='Eg: Near apollo hospital'
                required
                name={`applicants[${activeIndex}].address_detail.additional_landmark`}
                value={values?.applicants?.[activeIndex]?.address_detail?.additional_landmark}
                error={errors?.applicants?.[activeIndex]?.address_detail?.additional_landmark}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.additional_landmark}
                onBlur={(e) => {
                  handleBlur(e);
                  if (
                    !errors?.applicants?.[activeIndex]?.address_detail?.additional_landmark &&
                    values?.applicants?.[activeIndex]?.address_detail?.additional_landmark
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_landmark:
                          values?.applicants?.[activeIndex]?.address_detail?.additional_landmark,
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );

                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                    }
                  } else {
                    const name = e.target.name.split('.')[2];
                    if (!requiredFieldsStatus[name]) {
                      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
                    }

                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_landmark: '',
                      },
                      {
                        headers: {
                          Authorization: token,
                        },
                      },
                    );
                  }
                }}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.address_detail?.extra_params
                    ?.additional_address_same_as_current ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  value = value?.trimStart()?.replace(/\s\s+/g, ' ');
                  const pattern = /^[a-zA-Z0-9\\/-\s,.]+$/;
                  if (!pattern.test(value) && value.length != 0) {
                    return;
                  }
                  if (pattern.exec(value[value.length - 1])) {
                    setFieldValue(
                      e.currentTarget.name,
                      value.charAt(0).toUpperCase() + value.slice(1),
                    );
                  }
                }}
                inputClasses='capitalize'
              />

              <TextInput
                label='Pincode'
                placeholder='Eg: 123456'
                required
                name={`applicants[${activeIndex}].address_detail.additional_pincode`}
                type='tel'
                hint='City and State fields will get filled based on Pincode'
                value={values?.applicants?.[activeIndex]?.address_detail?.additional_pincode}
                error={
                  errors?.applicants?.[activeIndex]?.address_detail?.additional_pincode ||
                  pincodeErr?.[`address_additional_${activeIndex}`]
                }
                touched={touched?.applicants?.[activeIndex]?.address_detail?.additional_pincode}
                disabled={
                  inputDisabled ||
                  values?.applicants?.[activeIndex]?.address_detail?.extra_params
                    ?.additional_address_same_as_current ||
                  values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
                }
                onBlur={(e) => {
                  handleBlur(e);
                  handleAdditionalPincodeChange(
                    values?.applicants?.[activeIndex]?.address_detail?.additional_pincode,
                  );

                  if (
                    errors?.applicants?.[activeIndex]?.address_detail?.additional_landmark ||
                    !values?.applicants?.[activeIndex]?.address_detail?.additional_landmark
                  ) {
                    editAddressById(
                      values?.applicants?.[activeIndex]?.address_detail?.id,
                      {
                        additional_pincode: '',
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
                    `applicants[${activeIndex}].address_detail.additional_pincode`,
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
                    `applicants[${activeIndex}].address_detail.additional_pincode`,
                    e.target.value,
                  );
                }}
                inputClasses='hidearrow'
              />

              <TextInput
                label='City'
                placeholder='Eg: Nashik'
                name={`applicants[${activeIndex}].address_detail.additional_city`}
                value={values?.applicants?.[activeIndex]?.address_detail?.additional_city}
                error={errors?.applicants?.[activeIndex]?.address_detail?.additional_city}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.additional_city}
                onBlur={handleBlur}
                disabled={true}
                labelDisabled={!values?.applicants?.[activeIndex]?.address_detail?.additional_city}
                onChange={() => {}}
                inputClasses='capitalize'
              />

              <TextInput
                label='State'
                placeholder='Eg: Maharashtra'
                name={`applicants[${activeIndex}].address_detail.additional_state`}
                value={values?.applicants?.[activeIndex]?.address_detail?.additional_state}
                error={errors?.applicants?.[activeIndex]?.address_detail?.additional_state}
                touched={touched?.applicants?.[activeIndex]?.address_detail?.additional_state}
                onBlur={handleBlur}
                disabled={true}
                labelDisabled={!values?.applicants?.[activeIndex]?.address_detail?.additional_state}
                onChange={() => {}}
                inputClasses='capitalize'
              />

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='loan-purpose'
                  className='flex gap-0.5 font-medium text-primary-black'
                >
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
                      name={`applicants[${activeIndex}].address_detail.additional_no_of_year_residing`}
                      value={data.value}
                      current={
                        values?.applicants?.[activeIndex]?.address_detail
                          ?.additional_no_of_year_residing
                      }
                      onChange={handleRadioChange}
                      disabled={
                        values?.applicants?.[activeIndex]?.address_detail?.extra_params
                          ?.additional_address_same_as_current ||
                        values?.applicants?.[activeIndex]?.applicant_details?.extra_params
                          ?.qualifier
                      }
                    >
                      <span
                        className={`${
                          index ==
                          values?.applicants?.[activeIndex]?.address_detail
                            ?.additional_no_of_year_residing
                            ? values?.applicants?.[activeIndex]?.address_detail?.extra_params
                                ?.additional_address_same_as_current
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

        <PreviousNextButtons
          linkPrevious='/lead/personal-details'
          linkNext='/lead/work-income-details'
          onNextClick={handleNextClick}
          onPreviousClick={() => setCurrentStepIndex(1)}
        />

        <SwipeableDrawerComponent />
      </div>

      {openExistingPopup ? (
        <DynamicDrawer open={openExistingPopup} setOpen={setOpenExistingPopup} height='80vh'>
          <div className='flex flex-col items-center h-full'>
            <span className='w-full font-semibold text-[14px] leading-[21px]'>
              This is an existing customer.
            </span>
            <div className='flex flex-col flex-1 w-full gap-[7px] overflow-auto mt-[10px] mb-[10px]'>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Type of residence</span>
                <span className='w-full text-[12px]'>
                  {values?.applicants?.[activeIndex]?.applicant_details
                    ?.current_type_of_residence || ''}
                </span>
              </div>
              <span className='w-full font-semibold text-[12px] leading-[18px]'>
                CURRENT ADDRESS
              </span>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Flat no/Building name</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_flat_no_building_name
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Street/Area/Locality</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_street_area_locality
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Town</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_town
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Landmark</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_landmark
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Pincode</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_pincode
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>City</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_city
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>State</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_state
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>No. of years residing</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_current_no_of_year_residing
                  }
                </span>
              </div>

              <span className='w-full font-semibold text-[12px] leading-[18px]'>
                PERMANENT ADDRESS
              </span>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_address_same_as_current || false
                  }
                  name='additional_address_same_as_current'
                  onTouchEnd
                  disabled={true}
                />
                <span className='text-[#373435] text-xs font-normal'>
                  Additional address is same as Current address
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Flat no/Building name</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_flat_no_building_name
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Street/Area/Locality</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_street_area_locality
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Town</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_town
                  }
                </span>
              </div>

              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Landmark</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_landmark
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>Pincode</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_pincode
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>City</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_city
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>State</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_state
                  }
                </span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='w-full text-[12px] text-[#727376]'>No. of years residing</span>
                <span className='w-full text-[12px]'>
                  {
                    values?.applicants?.[activeIndex]?.applicant_details
                      ?.existing_customer_additional_no_of_year_residing
                  }
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
              <Button
                primary={true}
                inputClasses=' w-full h-[46px]'
                onClick={() => handleAutofill()}
              >
                Yes
              </Button>
            </div>
          </div>
        </DynamicDrawer>
      ) : null}
    </>
  );
}
