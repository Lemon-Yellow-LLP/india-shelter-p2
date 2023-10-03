import { createPortal } from 'react-dom';
import { IconClose } from '../../assets/icons';
import PropTypes from 'prop-types';
import Button from '../Button';

const UploadDocsModal = ({ showpopup, setShowPopUp, img, callback }) => {
  if (showpopup)
    return createPortal(
      <div
        role='presentation'
        onClick={() => setShowPopUp(false)}
        onKeyDown={() => setShowPopUp(false)}
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
          <div className='h-[437px] bg-white mt-3 rounded-t-lg'>
            <img
              src={URL.createObjectURL(img)}
              alt={img}
              className='h-full w-full object-cover object-center rounded-t-lg'
            />
          </div>
          <div className='p-4 flex gap-4 bg-white rounded-b-lg'>
            <Button inputClasses='w-full' onClick={() => callback(img)}>
              Delete
            </Button>
            {/* <Button inputClasses='w-full' primary>
              Retake
            </Button> */}
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
  img: PropTypes.object,
};
