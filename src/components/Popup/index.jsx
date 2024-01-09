import React from 'react';
import loading from '../../assets/icons/loading.svg';

export default function Popup({
  onClick,
  handleClose,
  open,
  setOpen,
  title,
  description,
  bottom,
  state,
}) {
  if (state === 'success') {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }
  let popupStateClasses =
    state === 'error'
      ? 'bg-lighter-red border border-primary-red'
      : state === 'success'
      ? 'bg-light-green border border-secondary-green'
      : 'bg-[#000000F2]';
  let popupTextColor =
    state === 'error' || state === 'success' ? 'text-primary-black' : 'text-neutral-white';
  let crossSvgColor = state === 'error' || state === 'success' ? '#373435' : '#FEFEFE';
  return open ? (
    <div
      style={{ bottom: `${bottom || 145}px` }}
      className='absolute w-full flex items-center p-[20px] z-[900]'
    >
      <div
        className={`flex-1 w-[100%] p-[12px] flex flex-col gap-3 rounded ${popupStateClasses} shadow-[0px_8px_32px_0px_rgba(0_0_0_0.20)]`}
      >
        <div className='flex gap-2 items-center'>
          {state === 'loading' && (
            <div className='ml-auto'>
              <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
            </div>
          )}
          <div className='flex-1 flex flex-col gap-[2px]'>
            {title && (
              <h4 className={`text-[14px] not-italic font-normal ${popupTextColor}`}>{title}</h4>
            )}
            {description && (
              <p className='not-italic font-normal text-[11px] leading-4 text-light-grey'>
                {description}
              </p>
            )}
          </div>
          {state !== 'success' && (
            <button onClick={handleClose} className='p-[6px] self-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='12'
                height='12'
                fill='none'
                viewBox='0 0 12 12'
              >
                <g
                  stroke={`${crossSvgColor}`}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                >
                  <path d='M11 1L1 11'></path>
                  <path d='M1 1l10 10'></path>
                </g>
              </svg>
            </button>
          )}
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
