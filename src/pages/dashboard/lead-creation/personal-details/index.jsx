import { personalDetailsModeOption } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import ManualMode from './ManualMode';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { addApi, editFieldsById } from '../../../../global';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import { Button } from '../../../../components';
import { newCoApplicantValues } from '../../../../context/NewCoApplicant';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';

const PersonalDetails = () => {
  const {
    values,
    updateProgressApplicantSteps,
    errors,
    touched,
    setFieldValue,
    activeIndex,
    setActiveIndex,
    existingData,
    setValues,
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicants?.[activeIndex]?.personal_details?.extra_params?.required_fields_status,
  });

  const [openExistingPopup, setOpenExistingPopup] = useState(
    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
      !values?.applicants?.[activeIndex]?.personal_details?.extra_params?.is_existing_done
      ? true
      : false,
  );

  useEffect(() => {
    setRequiredFieldsStatus(
      values?.applicants?.[activeIndex]?.personal_details?.extra_params?.required_fields_status,
    );
  }, [activeIndex]);

  const updateFields = async (name, value) => {
    let newData = {
      date_of_birth: values?.applicants[activeIndex]?.personal_details?.date_of_birth,
      mobile_number: values?.applicants[activeIndex]?.personal_details?.mobile_number,
    };
    newData[name] = value;

    if (!name) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.personal_details?.id,
        'personal',
        values?.applicants[activeIndex]?.personal_details,
      );
    } else {
      if (values?.applicants[activeIndex]?.personal_details?.id) {
        const res = await editFieldsById(
          values?.applicants[activeIndex]?.personal_details?.id,
          'personal',
          newData,
        );
      } else {
        let addData = { ...newCoApplicantValues.personal_details, [name]: value };
        await addApi('personal', {
          ...addData,
          applicant_id: values?.applicants?.[activeIndex]?.applicant_details?.id,
        })
          .then(async (res) => {
            setFieldValue(`applicants[${activeIndex}].personal_details.id`, res.id);
            await editFieldsById(
              values?.applicants[activeIndex]?.applicant_details?.id,
              'applicant',
              { personal_detail: res.id },
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[2];
      updateFields(name, e.value);
      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus, values],
  );

  useEffect(() => {
    updateProgressApplicantSteps('personal_details', requiredFieldsStatus, 'personal');
  }, [requiredFieldsStatus]);

  const handleNextClick = () => {
    setCurrentStepIndex(2);
    // updateFields();
  };

  const handleAutofill = async () => {
    const fillData = { ...values.applicants?.[activeIndex]?.applicant_details };

    const {
      existing_customer_id_type,
      existing_customer_id_number,

      existing_customer_selected_address_proof,
      existing_customer_address_proof_number,

      existing_customer_first_name,
      existing_customer_middle_name,
      existing_customer_last_name,

      existing_customer_gender,
      existing_customer_father_husband_name,
      existing_customer_mother_name,
    } = fillData;

    const mappedData = {
      id_type: existing_customer_id_type,
      id_number: existing_customer_id_number,
      selected_address_proof: existing_customer_selected_address_proof,
      address_proof_number: existing_customer_address_proof_number,
      first_name: existing_customer_first_name,
      middle_name: existing_customer_middle_name,
      last_name: existing_customer_last_name,
      gender: existing_customer_gender,
      father_husband_name: existing_customer_father_husband_name,
      mother_name: existing_customer_mother_name,
      extra_params: {},
    };

    let finalData = { ...values };

    finalData.applicants[activeIndex].personal_details = {
      ...finalData.applicants[activeIndex].personal_details,
      ...mappedData,
    };

    setValues(finalData);

    setFieldValue(
      `applicants[${activeIndex}].personal_details.extra_params.is_existing_done`,
      true,
    );

    if (values?.applicants[activeIndex]?.personal_details?.id) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.personal_details?.id,
        'personal',
        mappedData,
      ).then((res) => {
        updateFields();
      });
    } else {
      const res = await addApi('personal', mappedData);
      setFieldValue(`applicants[${activeIndex}].personal_details.id`, res.id);
      await editFieldsById(values?.applicants?.[activeIndex]?.applicant_details?.id, 'applicant', {
        personal_detail: res.id,
      });
      updateFields();
    }

    setOpenExistingPopup(false);
  };

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
      values?.applicants?.[activeIndex]?.personal_details?.extra_params?.is_existing_done
    ) {
      setOpenExistingPopup(
        values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing &&
          values?.applicants?.[activeIndex]?.personal_details?.extra_params?.is_existing_done,
      );
    } else {
      setOpenExistingPopup(false);
    }
  }, [
    values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.is_existing,
    values?.applicants?.[activeIndex]?.personal_details?.extra_params?.is_existing_done,
  ]);

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
          />
        )}
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[150px] flex-1'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
              How would you like to proceed <span className='text-primary-red text-xs'>*</span>
            </label>
            <div className={`flex gap-4 w-full`}>
              {personalDetailsModeOption.map((option) => {
                return (
                  <CardRadio
                    key={option.value}
                    label={option.label}
                    name={`applicants[${activeIndex}].personal_details.how_would_you_like_to_proceed`}
                    value={option.value}
                    current={
                      values?.applicants?.[activeIndex]?.personal_details
                        ?.how_would_you_like_to_proceed
                    }
                    onChange={handleRadioChange}
                    containerClasses='flex-1'
                  >
                    {option.icon}
                  </CardRadio>
                );
              })}
            </div>
            {errors?.applicants?.[activeIndex]?.personal_details?.how_would_you_like_to_proceed &&
            touched?.applicants &&
            touched?.applicants?.[activeIndex]?.personal_details?.how_would_you_like_to_proceed ? (
              <span
                className='text-xs text-primary-red'
                dangerouslySetInnerHTML={{
                  __html:
                    errors?.applicants[activeIndex]?.personal_details
                      ?.how_would_you_like_to_proceed,
                }}
              />
            ) : (
              ''
            )}
          </div>
          {values?.applicants?.[activeIndex]?.personal_details?.how_would_you_like_to_proceed ===
            'Manual' && (
            <ManualMode
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
              updateFields={updateFields}
            />
          )}
        </div>

        <PreviousNextButtons
          linkPrevious='/lead/applicant-details'
          linkNext='/lead/address-details'
          onNextClick={handleNextClick}
          onPreviousClick={() => setCurrentStepIndex(0)}
        />

        <SwipeableDrawerComponent />
      </div>

      <DynamicDrawer open={openExistingPopup} setOpen={setOpenExistingPopup} height='80vh'>
        <div className='flex flex-col items-center h-full'>
          <span className='w-full font-semibold text-[14px] leading-[21px]'>
            This is an existing customer.
          </span>
          <div className='flex flex-col flex-1 w-full gap-[7px] overflow-auto mt-[10px] mb-[10px]'>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>ID Type**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_id_type}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>ID Number**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_id_number}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Address proof**</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_selected_address_proof
                }
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Address proof number**</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_address_proof_number
                }
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>First name**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_first_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Middle name</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_middle_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Last name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_last_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Gender</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.applicant_details?.existing_customer_gender}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Date of birth</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.date_of_birth}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Mobile number</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.mobile_number}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Father/Husband's name</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_father_husband_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Mother's name</span>
              <span className='w-full text-[12px]'>
                {
                  values?.applicants?.[activeIndex]?.applicant_details
                    ?.existing_customer_mother_name
                }
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Marital status**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.marital_status}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Religion**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.religion}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Preferred Language**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.preferred_language}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Qualification**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants?.[activeIndex]?.personal_details?.qualification}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Email**</span>
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
            <Button
              inputClasses='w-full h-[46px]'
              onClick={() => {
                setOpenExistingPopup(false);
                setFieldValue(
                  `applicants[${activeIndex}].personal_details.extra_params.is_existing_done`,
                  true,
                );
                updateFields();
              }}
            >
              No
            </Button>
            <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handleAutofill}>
              Yes
            </Button>
          </div>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default PersonalDetails;
