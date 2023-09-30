import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { useContext, useEffect } from 'react';
import ArrowRightIcon2 from '../../../../assets/icons/arrow-right-2';
import { fieldLabels, pages } from '../../../../utils';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components';

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

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh]'>
        <div className='p-4 bg-white'>
          <Stepper sx={{}} activeStep={1} alternativeLabel>
            {steps.map((label, i) => (
              <Step key={i}>
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
                  link={p.url}
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
        {/* Label */}

        <div className='bottom-0 fixed'>
          <div
            className='flex w-[100vw] p-[18px] bg-white gap-[20px] justify-end mb-[62.6px]'
            style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
          >
            <Button
              primary={true}
              inputClasses='w-1/2 h-[46px]'
              disabled={true}
              link={'/'}
              onClick={() => {}}
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

const Separator = () => {
  return <div className='border-t-2 border-b-0 w-full'></div>;
};
