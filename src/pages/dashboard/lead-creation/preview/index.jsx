import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { useContext, useEffect, useState } from 'react';
import ArrowRightIcon2 from '../../../../assets/icons/arrow-right-2';
import { fieldLabels, pages } from '../../../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components';
import StepCompletedIllustration from '../../../../assets/step-completed';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const steps = ['', '', '', '', ''];

export default function Preview() {
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
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const navigate = useNavigate();

  useEffect(() => console.log('errors', errors), [errors]);

  const [activeStep, setActiveStep] = useState(0);
  const [primaryApplicant, setPrimaryApplicant] = useState(null);
  const [coApplicants, setCoApplicants] = useState([2, 2]);

  const previousStep = () => {
    if (activeStep == 0) {
      return;
    }
    setActiveStep((prev) => prev - 1);
  };

  const nextStep = () => {
    if (activeStep === coApplicants.length) return;
    setActiveStep((prev) => prev + 1);
  };

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh] bg-[#F9F9F9]'>
        <div className='py-4'>
          <div className='px-6 mb-3 flex justify-between'>
            <span className='text-xs not-italic font-medium text-dark-grey'>APPLICANTS</span>
            <span className='text-right text-xs not-italic font-normal text-primary-black'>{`Suresh (${
              activeStep == 0 ? 'Primary' : 'Co-app'
            }) `}</span>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, i) => (
              <Step
                sx={{
                  '& .MuiStepLabel-root': {
                    margin: '0',
                    padding: '0',
                    fontFamily: 'Poppins',
                  },
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#E33439', // circle color (COMPLETED)
                  },
                  '& .MuiStepLabel-root .Mui-disabled': {
                    borderWidth: i > coApplicants.length ? 0 : '1px',
                    borderRadius: '100%',
                    borderColor: i > coApplicants.length ? '#F3F3F3' : '#727376',
                  },
                  '& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-root': {
                    color: i > coApplicants.length ? '#F3F3F3' : '#fff',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'white', // circle color (ACTIVE)
                    borderWidth: '1px',
                    borderRadius: '100%',
                    borderColor: '#E33439',
                  },

                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                    color: 'common.white', // Just text label (ACTIVE)
                  },
                  '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel': {
                    color: 'common.white',
                  },
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: '#E33439', // circle's number (ACTIVE)
                    fontSize: '14px',
                    fontWeight: '600',
                  },

                  '& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-text': {
                    fill: '#727376',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: i > coApplicants.length ? '0.6' : '1',
                  },
                }}
                key={i}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className='flex-1 flex flex-col gap-4 p-4 pb-[200px] overflow-auto bg-[##F9F9F9]'>
          <div className='flex gap-2'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='none'
                viewBox='0 0 16 16'
              >
                <g
                  stroke='#96989A'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  clipPath='url(#clip0_3125_37927)'
                >
                  <path d='M7.999 14.667a6.667 6.667 0 100-13.334 6.667 6.667 0 000 13.334z'></path>
                  <path d='M8 10.667V8'></path>
                  <path d='M8 5.333h.007'></path>
                </g>
                <defs>
                  <clipPath id='clip0_3125_37927'>
                    <path fill='#fff' d='M0 0H16V16H0z'></path>
                  </clipPath>
                </defs>
              </svg>
            </span>
            <p className='text-xs not-italic font-normal text-dark-grey'>
              To get the applicant’s eligible amount, complete the mandatory fields
            </p>
          </div>

          {pages &&
            pages.map((p, i) =>
              values[p.name]?.extra_params?.progress != '100' ? (
                <PreviewCard
                  key={i}
                  title={p.title}
                  link={p.url + '?preview=' + p.url}
                  count={errors && errors[p.name] ? Object.keys(errors[p.name]).length : 'ALL'}
                >
                  {errors &&
                    errors[p.name] &&
                    Object.keys(errors[p.name]).map((val, i) => (
                      <p
                        className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                        key={i}
                      >
                        {val}
                        <span className='text-primary-red text-xs'>*</span>
                      </p>
                    ))}
                </PreviewCard>
              ) : null,
            )}
        </div>

        <div className='bottom-0 fixed'>
          <div
            className='flex w-[100vw] p-[18px] bg-white gap-[20px] justify-end mb-[62.6px]'
            style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
          >
            <Button inputClasses='w-1/2 h-[46px]' onClick={previousStep}>
              Previous
            </Button>
            <Button
              primary={true}
              inputClasses='w-1/2 h-[46px]'
              // disabled={true}
              onClick={nextStep}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function PreviewCard({ title, count, link, children }) {
  return (
    <Link
      to={link}
      className='rounded-lg border border-[#EBEBEB] bg-white p-3 flex flex-col gap-2 active:opacity-90'
    >
      <div className='flex justify-between'>
        <h4 className='overflow-hidden text-sm not-italic font-medium text-primary-black'>
          {title || '-'}
        </h4>
        <ArrowRightIcon2 />
      </div>

      <Separator />
      <div className='flex justify-start gap-[6px]'>
        <p className='not-italic font-medium text-[10px] text-light-grey'>INCOMPLETE FIELDS: </p>
        <span className='not-italic font-medium text-[10px] text-dark-grey'>{count}</span>
      </div>
      {children}
    </Link>
  );
}

function StepCompleted() {
  return (
    <div className='h-full w-full flex justify-center pt-32 bg-[#EEF0DD]'>
      <StepCompletedIllustration />
    </div>
  );
}

const Separator = () => {
  return <div className='border-t-2 border-b-0 w-full'></div>;
};
