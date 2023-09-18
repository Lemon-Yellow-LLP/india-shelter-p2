import InfoIcon from '../../../../assets/icons/info.svg';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components';

const BRE_ONE = () => {
  return (
    <div className='p-4 relative h-screen'>
      <div className='flex items-start gap-2'>
        <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
        <p className='text-xs not-italic font-normal text-dark-grey'>
          The qualifier provides information regarding the status of all the verification and lead
          eligibility.
        </p>
      </div>

      <div className='mt-4'>
        <p className='text-xs text-primary-black font-normal'>Applicant name: Santosh Yadav</p>
        <div className='flex justify-between text-primary-black font-medium'>
          <h3>Verification in progress</h3>
          <h3>4/6</h3>
        </div>

        <div className='flex justify-center mt-3'>
          <svg
            width='152'
            height='78'
            viewBox='0 0 152 78'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M152 75.9875C152 55.8343 143.993 36.5066 129.74 22.2562C115.487 8.0058 96.1565 1.53945e-06 76 1.79328e-08C55.8436 -1.50359e-06 36.5127 8.0058 22.2599 22.2562C8.00713 36.5066 3.14666e-06 55.8343 1.03116e-07 75.9875H19C19 60.8726 25.0053 46.3768 35.6949 35.689C46.3845 25.0012 60.8827 18.9969 76 18.9969C91.1174 18.9969 105.616 25.0012 116.305 35.689C126.995 46.3768 133 60.8726 133 75.9875H152Z'
              fill='#3DB267'
            />
            <path
              d='M39.1918 9.50665C27.2832 16.0979 17.3636 25.7658 10.4694 37.5004C3.57531 49.2349 -0.0403256 62.6053 0.000339267 76.2145L19.0003 76.1577C18.9698 65.9508 21.6815 55.923 26.8521 47.1221C32.0227 38.3212 39.4624 31.0703 48.3939 26.1269L39.1918 9.50665Z'
              fill='#E15555'
            />
            <path
              d='M114 10.1804C102.475 3.52772 89.4056 0.0172316 76.0981 6.3276e-05C62.7905 -0.017105 49.7118 3.45965 38.17 10.0826L47.6275 26.5588C56.2838 21.5916 66.0929 18.984 76.0735 18.9969C86.0542 19.0098 95.8565 21.6427 104.5 26.6322L114 10.1804Z'
              fill='#FF9D4A'
            />
            <path
              d='M21.0002 41.536L77.589 69.9524L73.9079 76.3271L21.0002 41.536Z'
              fill='#272525'
            />
            <path
              d='M76.5428 68.9797C78.5408 70.133 79.265 72.6189 78.1603 74.532C77.0556 76.4451 74.5403 77.0609 72.5423 75.9076C70.5443 74.7542 69.8201 72.2684 70.9248 70.3553C72.0295 68.4422 74.5448 67.8263 76.5428 68.9797Z'
              fill='#272525'
            />
          </svg>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                stroke='#EC7739'
                strokeWidth='1.5'
              />
            </svg>
            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10Z'
                fill='url(#paint0_angular_2724_6266)'
              />
              <defs>
                <radialGradient
                  id='paint0_angular_2724_6266'
                  cx='0'
                  cy='0'
                  r='1'
                  gradientUnits='userSpaceOnUse'
                  gradientTransform='translate(10 10) rotate(90) scale(10)'
                >
                  <stop stopColor='#E33439' />
                  <stop offset='1' stopColor='#FFF7F7' />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <p className='text-xs not-italic font-normal text-dark-grey mt-3 text-center'>
        Do not close the app or go back. Please wait for ID <br /> verification as it may take some
        time. We are validating these checks as per your consent
      </p>

      <div className='flex flex-col gap-[18px] absolute bottom-4 w-full p-4 left-2/4 -translate-x-2/4'>
        <div className='flex items-start gap-2'>
          <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
          <p className='text-sm not-italic font-normal text-dark-grey'>
            Eligibility can be increased by adding Co-applicant{' '}
            <Link className='text-primary-red underline'>Add now</Link>
          </p>
        </div>
        <Button inputClasses='w-full h-14' primary={true}>
          Next
        </Button>
      </div>
    </div>
  );
};
export default BRE_ONE;
