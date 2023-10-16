import { useLocation, useNavigate } from 'react-router-dom';
import { IconClose } from '../../assets/icons';

export const pages = [
  '/lead/applicant-details',
  '/lead/personal-details',
  '/lead/address-details',
  '/lead/work-income-details',
  '/lead/qualifier',
  '/lead/property-details',
  '/lead/reference-details',
  '/lead/upload-documents',
  '/lead/preview',
  '/lead/eligibility',
];

export default function Topbar({
  title,
  id,
  progress,
  showBack = false,
  showClose = true,
  coApplicant,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <>
      <div
        id='titlebar'
        className='sticky inset-0 bg-white h-fit flex items-start px-4 py-3 border border-[#ECECEC] z-[200]'
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
            {coApplicant ? 'CO-APPLICANT:' : 'APP ID:'}
            <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey pl-1'>
              {id}
            </span>
          </p>
        </div>
        {showClose ? (
          <button onClick={() => navigate('/')} className=''>
            <IconClose />
          </button>
        ) : null}
        {/* Progressbar */}
        <div
          style={{
            width: `${((pages.indexOf(location.pathname) + 1) / pages.length) * 100}%`,
          }}
          className='absolute left-0 bottom-0 h-[2px] bg-red-500'
        ></div>
      </div>
    </>
  );
}
