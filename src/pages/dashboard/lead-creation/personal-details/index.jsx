import { personalDetailsModeOption } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import ManualMode from './ManualMode';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { addApi, editFieldsById } from '../../../../global';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import { Button } from '../../../../components';

const PersonalDetails = memo(() => {
  const { values, updateProgress, errors, touched, setFieldValue, activeIndex, setActiveIndex } =
    useContext(LeadContext);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    how_would_you_like_to_proceed: false,
    id_type: false,
    id_number: false,
    selected_address_proof: false,
    address_proof_number: false,
    first_name: false,
    gender: false,
    date_of_birth: false,
    mobile_number: false,
    father_husband_name: false,
    mother_name: false,
    marital_status: false,
    religion: false,
    preferred_language: false,
    qualification: false,
  });

  const [openExistingPopup, setOpenExistingPopup] = useState(true);

  const updateFields = async (name, value) => {
    let newData = {};
    newData[name] = value;

    if (values?.applicants[activeIndex]?.personal_details?.id) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.personal_details?.id,
        'personal',
        newData,
      );
    } else {
      const res = await addApi('personal', newData);
      setFieldValue(`applicants[${activeIndex}].personal_details.id`, res.id);
    }

    if (!name) {
      const res = await editFieldsById(
        values?.applicants[activeIndex]?.personal_details?.id,
        'personal',
        values?.applicants[activeIndex]?.personal_details,
      );
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
    updateProgress(1, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const handleNextClick = () => {
    updateFields();
  };

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh]'>
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
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
                      values?.applicants[activeIndex]?.personal_details
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
            {errors?.applicants[activeIndex]?.personal_details?.how_would_you_like_to_proceed &&
            touched?.applicants &&
            touched?.applicants[activeIndex]?.personal_details?.how_would_you_like_to_proceed ? (
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
          {values?.applicants[activeIndex]?.personal_details?.how_would_you_like_to_proceed ===
            'Manual' && (
            <ManualMode
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
              updateFields={updateFields}
            />
          )}
        </div>

        <div className='bottom-0 fixed'>
          <PreviousNextButtons
            linkPrevious='/lead/applicant-details'
            linkNext='/lead/address-details'
            onNextClick={handleNextClick}
          />
        </div>
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
                {values?.applicants[activeIndex]?.personal_details?.id_type}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>ID Number**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.id_number}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Address proof**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.selected_address_proof}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Address proof number**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.address_proof_number}
              </span>
            </div>

            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>First name**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.first_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Middle name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.middle_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Last name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.last_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Gender</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.gender}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Date of birth</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.date_of_birth}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Mobile number</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.mobile_number}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Father/Husband's name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.father_husband_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Mother's name</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.mother_name}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Marital status**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.marital_status}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Religion**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.religion}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Preferred Language**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.preferred_language}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Qualification**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.qualification}
              </span>
            </div>
            <div className='flex justify-between w-full'>
              <span className='w-full text-[12px] text-[#727376]'>Email**</span>
              <span className='w-full text-[12px]'>
                {values?.applicants[activeIndex]?.personal_details?.email}
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
            <Button inputClasses='w-full h-[46px]'>No</Button>
            <Button primary={true} inputClasses=' w-full h-[46px]'>
              Yes
            </Button>
          </div>
        </div>
      </DynamicDrawer>
    </>
  );
});

export default PersonalDetails;
