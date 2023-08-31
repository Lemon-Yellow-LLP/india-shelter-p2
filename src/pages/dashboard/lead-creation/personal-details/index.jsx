import { personalDetailsModeOption } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { memo, useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import ManualMode from './ManualMode';

const PersonalDetails = memo(() => {
  const { values, setValues, updateProgress, errors, touched, handleSubmit, setFieldValue } =
    useContext(AuthContext);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    selected_personal_details_mode: false,
    id_type: false,
    id_number: false,
    address_proof: false,
    address_proof_number: false,
    date_of_birth: false,
    mobile_number: false,
    father_or_husband_name: false,
    mother_name: false,
    religion: false,
    preferred_language: false,
    qualification: false,
    marital_status: false,
    gender: false,
    first_name: false,
    middle_name: false,
    last_name: false,
  });

  const handleRadioChange = useCallback(
    (e) => {
      setFieldValue(e.name, e.value);
      if (!requiredFieldsStatus[e.name]) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [e.name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  return (
    <div className='flex flex-col bg-medium-grey gap-2 h-[92vh] overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px]'>
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
        />
      )}
    </div>
  );
});

export default PersonalDetails;
