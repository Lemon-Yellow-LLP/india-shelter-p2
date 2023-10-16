import { useCallback, useEffect } from 'react';
import { IconClose } from '../../assets/icons';
import { AnimatePresence, motion } from 'framer-motion';
import propTypes from 'prop-types';

const DEFAULT_TIMEOUT = 3000;

const ToastMessage = ({ message, setMessage, timeout = DEFAULT_TIMEOUT }) => {
  const handleOnCloseClick = useCallback(
    (e) => {
      e.stopPropagation();
      setMessage(null);
    },
    [setMessage],
  );

  useEffect(() => {
    if (!message) return;
    setTimeout(() => {
      setMessage(false);
    }, timeout);
  }, [message, timeout, setMessage]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          style={{
            backgroundColor: '#4E8D7C',
            zIndex: 10000,
          }}
          className={`flex gap-4 items-center 
            absolute left-0 lg:left-0 top-0 lg:top-[52px] 
            w-full max-w-[532px] 
            p-4 z-50 toast-message
            text-sm lg:rounded-lg
          `}
          initial={{ opacity: 0, translateY: -100 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -100 }}
          transition={{ ease: 'easeOut', duration: 0.52 }}
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect width='24' height='24' rx='12' fill='#FEFEFE' />
            <path
              d='M17.3337 8L10.0003 15.3333L6.66699 12'
              stroke='#4E8D7C'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <span className='flex-1 leading-5 text-sm font-medium text-neutral-white'>{message}</span>

          <button type='button' onClick={handleOnCloseClick}>
            <IconClose color='#FEFEFE' />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;

ToastMessage.propTypes = {
  message: propTypes.any,
  setMessage: propTypes.func,
  timeout: propTypes.number,
};
