import React from 'react';
import Button from '../Button';

export default function PreviousNextButtons({
  disablePrevious,
  disableNext,
  linkPrevious,
  linkNext,
}) {
  return (
    <div
      className='flex w-[100vw] p-[18px] bg-white h-[142px] gap-[20px]'
      style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
    >
      {disablePrevious ? (
        <div className='w-full h-[45px] md:w-64 p-2 md:py-3 '></div>
      ) : (
        <Button inputClasses='w-full h-[46px]' link={linkPrevious}>
          Previous
        </Button>
      )}

      <Button primary={true} inputClasses='w-full h-[46px]' disabled={disableNext} link={linkNext}>
        Next
      </Button>
    </div>
  );
}
