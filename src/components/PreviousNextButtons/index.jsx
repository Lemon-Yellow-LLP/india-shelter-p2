import React from 'react';
import Button from '../Button';

export default function PreviousNextButtons({
  disablePrevious,
  disableNext,
  linkPrevious,
  linkNext,
  onPreviousClick,
  onNextClick,
}) {
  return (
    <div
      className='flex w-[100vw] p-[18px] bg-white mb-[62.6px] gap-[20px] justify-center'
      style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
    >
      {disablePrevious ? (
        <div className='w-full h-[45px] md:w-64 p-2 md:py-3 '></div>
      ) : (
        <Button inputClasses='w-full h-[46px]' link={linkPrevious} onClick={onPreviousClick}>
          Previous
        </Button>
      )}

      <Button
        primary={true}
        inputClasses='w-full h-[46px]'
        disabled={disableNext}
        link={linkNext}
        onClick={onNextClick}
      >
        Next
      </Button>
    </div>
  );
}
