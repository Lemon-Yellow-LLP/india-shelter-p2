import { createPortal } from 'react-dom';
import { IconClose } from '../../assets/icons';
import PropTypes from 'prop-types';
import Button from '../Button';
import { useState } from 'react';

const UploadDocsModal = ({ showpopup, setShowPopUp, img, callback, lat, long, photos }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (showpopup)
    return createPortal(
      <div
        role='presentation'
        // onClick={() => setShowPopUp(false)}
        // onKeyDown={() => setShowPopUp(false)}
        style={{
          zIndex: 9999999,
        }}
        className='fixed inset-0 w-full bg-black bg-opacity-50'
      >
        <div className='w-[328px] flex absolute top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4 rounded-lg shadow-lg flex-col outline-none focus:outline-none'>
          <div className='flex items-start justify-between bg-transparent'>
            <button className='ml-auto' onClick={() => setShowPopUp(false)}>
              <IconClose />
            </button>
          </div>

          <div className='relative h-[437px] bg-white mt-3 rounded-t-lg'>
            {photos.map(
              (photo, index) =>
                index === activeStep && (
                  <div key={index}>
                    <img
                      src={photo.document_url}
                      alt={photo.document_url}
                      className='h-full w-full object-cover object-center rounded-t-lg'
                    />
                    <p className='absolute bottom-0 left-0 text-white p-3'>
                      Lat: {lat}, Long: {long}
                    </p>
                  </div>
                ),
            )}

            {/* {img && index !== activeStep && (
              <>
                <img
                  src={img}
                  alt={img}
                  className='h-full w-full object-cover object-center rounded-t-lg'
                />
                <p className='absolute bottom-0 left-0 text-white p-3'>
                  Lat: {lat}, Long: {long}
                </p>
              </>
            )} */}
          </div>

          <div className='p-4 flex gap-4 bg-white rounded-b-lg'>
            <Button inputClasses='w-full' onClick={() => callback(img)}>
              Delete
            </Button>
          </div>

          <div className='flex items-start justify-between bg-transparent mt-4'>
            {
              <div
                className={`bg-white border-[1px] border-[#E2EAF4] text-primary-black h-10 w-10 rounded-full flex justify-center items-center cursor-pointer ${
                  activeStep === 0 ? 'pointer-events-none opacity-80' : 'pointer-events-auto'
                }`}
                onClick={() => {
                  setActiveStep((prev) => prev - 1);
                  callback(activeStep - 1);
                }}
              >
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect width='32' height='32' rx='16' fill='#FEFEFE' />
                  <path
                    d='M19 10L13 16L19 22'
                    stroke='#373435'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            }

            {
              <div
                className={`bg-white border-[1px] border-[#E2EAF4] text-primary-black h-10 w-10 rounded-full flex justify-center items-center cursor-pointer ${
                  activeStep === photos.length - 1
                    ? 'pointer-events-none opacity-80'
                    : 'pointer-events-auto'
                }`}
                onClick={() => {
                  setActiveStep((prev) => prev + 1);
                  callback(activeStep + 1);
                }}
              >
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect width='32' height='32' rx='16' fill='white' />
                  <path
                    d='M13 22L19 16L13 10'
                    stroke='#373435'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            }
          </div>
        </div>
      </div>,
      document.body,
    );
  return null;
};

export default UploadDocsModal;

UploadDocsModal.propTypes = {
  showpopup: PropTypes.bool,
  setShowPopUp: PropTypes.func,
  img: PropTypes.string,
};
