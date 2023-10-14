import { useCallback, useEffect } from 'react';
import { IconClose, TostErrorIcon } from '../../assets/icons';
import { AnimatePresence, motion } from 'framer-motion';
import propTypes from 'prop-types';

const DEFAULT_TIMEOUT = 3000;

const ErrorTost = ({ message, setMessage, timeout = DEFAULT_TIMEOUT }) => {
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
            backgroundColor: '#EF8D32',
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
          <TostErrorIcon />

          <span className='flex-1 leading-5 text-sm font-medium text-neutral-white'>{message}</span>

          <button type='button' onClick={handleOnCloseClick}>
            <IconClose color='#FEFEFE' />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorTost;

ErrorTost.propTypes = {
  message: propTypes.any,
  setMessage: propTypes.func,
  timeout: propTypes.number,
};
