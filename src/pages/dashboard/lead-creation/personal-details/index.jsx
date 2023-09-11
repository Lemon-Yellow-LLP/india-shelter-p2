import { personalDetailsModeOption } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import ManualMode from './ManualMode';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { editFieldsById } from '../../../../global';

const PersonalDetails = () => {
  const { values, setValues, updateProgress, errors, touched, handleSubmit, setFieldValue } =
    useContext(AuthContext);

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

  const updateFields = async (name, value) => {
    let newData = values.personal_details;
    newData[name] = value;
    await editFieldsById(1, 'personal', newData);
  };

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      const name = e.name.split('.')[1];
      updateFields(name, e.value);
      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  useEffect(() => {
    updateProgress(1, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const handleNextClick = () => {
    updateFields();
  };

  return (
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
                  name='personal_details.how_would_you_like_to_proceed'
                  value={option.value}
                  current={values.personal_details?.how_would_you_like_to_proceed}
                  onChange={handleRadioChange}
                  containerClasses='flex-1'
                >
                  {option.icon}
                </CardRadio>
              );
            })}
          </div>
          {errors.personal_details?.how_would_you_like_to_proceed &&
          touched.personal_details?.how_would_you_like_to_proceed ? (
            <span
              className='text-xs text-primary-red'
              dangerouslySetInnerHTML={{
                __html: errors.personal_details?.how_would_you_like_to_proceed,
              }}
            />
          ) : (
            ''
          )}
        </div>
        {values.personal_details?.how_would_you_like_to_proceed === 'Manual' && (
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
  );
};

export default PersonalDetails;
