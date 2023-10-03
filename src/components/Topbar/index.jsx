import { useNavigate } from 'react-router-dom';
import BackIcon2 from '../../assets/icons/back-2';
import { IconBack, IconClose } from '../../assets/icons';
import { Button } from '@mui/material';

export default function Topbar({ title, id, progress, showBack = true, showClose = true }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        id='titlebar'
        className='sticky inset-0 bg-neutral-white h-fit flex items-start px-4 py-3 border border-[#ECECEC]'
      >
        {showBack ? (
          <button onClick={() => navigate(-1)} className='mt-2 mr-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='14'
              height='10'
              fill='none'
              viewBox='0 0 14 10'
            >
              <g>
                <g stroke='#373435' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                  <path d='M13 4.875H1.03'></path>
                  <path d='M1 4.875L4.918.75'></path>
                  <path d='M1 4.875L4.918 9'></path>
                </g>
              </g>
            </svg>
          </button>
        ) : null}

        <div className='flex-1'>
          <h3 className='truncate'>{title}</h3>
          <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
            APP ID:
            <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
              {id}
            </span>
          </p>
        </div>
        {showClose ? (
          <button onClick={() => {}} className=''>
            <IconClose />
          </button>
        ) : null}
        {/* Progressbar */}
        <div
          style={{
            width: `${progress}%`,
          }}
          className='absolute left-0 bottom-0 h-[2px] bg-red-500'
        ></div>
      </div>
    </>
  );
}
