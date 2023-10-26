import React from 'react';

export default function Popup({ onClick, handleClose, open, setOpen, title, description }) {
  return open ? (
    <div className='absolute bottom-[145px] w-full flex items-center p-[20px] z-[900]'>
      <div className=' flex-1 w-[100%] p-[12px] flex flex-col gap-3 rounded bg-[#000000F2] shadow-[0px_8px_32px_0px_rgba(0_0_0_0.20)]'>
        <div className='flex gap-2 items-start'>
          <div className='flex-1 flex flex-col gap-[2px]'>
            <h4 className='text-[14px] not-italic font-normal text-neutral-white'>{title}</h4>
            <p className='not-italic font-normal text-[11px] leading-4 text-light-grey'>
              {description}
            </p>
          </div>
          <button onClick={handleClose} className='p-[6px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              fill='none'
              viewBox='0 0 12 12'
            >
              <g stroke='#FEFEFE' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                <path d='M11 1L1 11'></path>
                <path d='M1 1l10 10'></path>
              </g>
            </svg>
          </button>
        </div>
        {/* 
        <button onClick={onClick} className='ml-auto'>
          <span className='text-right text-sm not-italic font-semibold text-primary-red'>
            Go To Preview
          </span>
        </button> */}
      </div>
    </div>
  ) : null;
}
