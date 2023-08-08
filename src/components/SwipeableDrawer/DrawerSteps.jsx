import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';
import { color } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';

export default function DrawerSteps({ details, steps, toggleDrawer }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (steps) {
      navigate(details.url);
      toggleDrawer();
    }
  };

  return (
    <div
      className='flex flex-col w-[100%] max-h-[77px] min-h-[62px] rounded-lg border p-2 justify-between'
      onClick={handleClick}
    >
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <span className='text-[14px] font-normal'>{details.title}</span>
          {steps ? (
            <span className='text-[11px] font-normal text-[#727376]'>{details.description}</span>
          ) : null}
        </div>
        {steps ? (
          <>
            {details.progress === 100 ? (
              <span className='text-[#147257] text-[10px] font-medium border border-[#147257] bg-[#D9F2CB] rounded-[12px] h-[23px] w-[81px] flex items-center justify-center'>
                Done
              </span>
            ) : (
              <span className='text-[#065381] text-[10px] font-medium border border-[#065381] bg-[#E5F5FF] rounded-[12px] h-[23px] w-[81px] flex items-center justify-center'>
                In Progress
              </span>
            )}
          </>
        ) : (
          <>
            {details.applicant ? (
              <span className='text-[#147257] text-[10px] font-medium border border-[#147257] bg-[#D9F2CB] rounded-[12px] h-[23px] w-[81px] flex items-center justify-center'>
                Applicant
              </span>
            ) : null}
          </>
        )}
      </div>
      <ProgressBar progress={details.progress} />
    </div>
  );
}
