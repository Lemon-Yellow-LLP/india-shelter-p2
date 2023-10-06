import { useContext } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { addApi, editFieldsById } from '../../../../global';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { bankingMode } from './bankingDropdownOptions';
import { CardRadio } from '../../../../components';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { useNavigate } from 'react-router-dom';
import BankingManual from './BankingManual';
import AccountAggregator from './AccountAggregator';
import Accounts from './Accounts';

const BankingDetails = () => {
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

  const navigate = useNavigate();

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({});

  const [activeState, setActiveState] = useState('');

  const updateFields = async (name, value) => {
    let newData = {};
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

  const handleRadioChange = (e) => {
    if (e.value === 'Manual') {
      setActiveState('manual');
      navigate('/lead/banking-details/manual');
    } else {
      setActiveState('aa');
      navigate('/lead/banking-details/account-aggregator');
    }
  };

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh]'>
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
              Add a bank account <span className='text-primary-red text-xs'>*</span>
            </label>
            <div className={`flex gap-4 w-full`}>
              {bankingMode.map((option) => {
                return (
                  <CardRadio
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    onChange={handleRadioChange}
                    containerClasses='flex-1'
                  >
                    <img src={option.icon} />
                  </CardRadio>
                );
              })}
            </div>
          </div>
          {values?.applicants?.[activeIndex]?.banking_details?.length && (
            <>
              <div className='flex flex-col mt-4'>
                <div>
                  <span className='text-[#727376] font-normal text-[16px]'>Added Accounts</span>
                  <span className='text-[#727376] font-normal text-[16px] ml-1'>
                    ({values?.applicants?.[activeIndex]?.banking_details?.length || 0})
                  </span>
                </div>
              </div>
              <Accounts />
            </>
          )}
          <>
            <div className='flex flex-col mt-4'>
              <div>
                <span className='text-[#727376] font-normal text-[16px]'>Added Accounts</span>
                <span className='text-[#727376] font-normal text-[16px] ml-1'>
                  ({values?.applicants?.[activeIndex]?.banking_details?.length || 0})
                </span>
              </div>
            </div>
            <Accounts />
          </>
        </div>

        <div className='bottom-0 fixed'>
          <PreviousNextButtons
            linkPrevious='/lead/applicant-details'
            linkNext='/lead/address-details'
            onNextClick={() => navigate('/lead/reference-details')}
            onPreviousClick={() => navigate('/lead/property-details')}
          />
        </div>
      </div>
    </>
  );
};

export default BankingDetails;
