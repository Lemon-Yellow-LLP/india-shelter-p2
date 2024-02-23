import { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const EkycOtpInput = ({
  label,
  required,
  onSendOTPClick,
  disableSendOTP,
  defaultResendTime,
  hasSentOTPOnce,
  setIsVerifyOtp,
  otp,
  setOtp,
}) => {
  const [inputDisabled, setInputDisabled] = useState(true);
  const [timer, setTimer] = useState(true);
  const [resendTime, setResendTime] = useState(defaultResendTime || 10);
  const inputRef = useRef(null);

  // sorted
  const handleOnChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (value.length <= 6) {
        setOtp(value);
        setIsVerifyOtp(false);
      }
      if (value.length === 6) {
        setIsVerifyOtp(true);
      }
    },
    [otp],
  );

  const handleOnOTPSend = useCallback(() => {
    console.log('onotpsend disabling the otp field');
    setIsVerifyOtp(false);
    setInputDisabled(false);
    onSendOTPClick();
    setTimer(true);
  }, [onSendOTPClick]);

  useEffect(() => {
    if (!hasSentOTPOnce) return;
    // console.log('useeffect disabling the otp field');
    setInputDisabled(false);
    setTimer(true);
  }, [hasSentOTPOnce]);

  // sorted
  useEffect(() => {
    let interval = null;
    if (timer) {
      let time = defaultResendTime || 10;
      interval = setInterval(() => {
        time -= 1;
        setResendTime(time);

        if (time <= 0) {
          clearInterval(interval);
          setTimer(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, defaultResendTime]);

  // sorted
  const inputClasses = useMemo(() => {
    if (otp.length === 0 || otp.length === 6) return 'border-stroke bg-white';
    return 'border-secondary-blue shadow-secondary-blue shadow-primary';
  }, [otp]);

  return (
    <div className='otp-container'>
      {/* sorted */}
      <h3 className='flex gap-0.5 text-primary-black'>
        {label}
        {required && <span className='text-primary-red text-sm'>*</span>}
      </h3>
      <div className='flex gap-2 mt-1'>
        <input
          type='number'
          autoComplete='one-time-code'
          disabled={inputDisabled}
          ref={inputRef}
          className={`
              w-full h-12 border bg-transparent outline-none px-4 text-base font-normal text-primary-black transition spin-button-none rounded-lg hidearrow
              ${inputClasses}
            `}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (DISALLOW_CHAR.includes(e.key)) {
              e.preventDefault();
              return;
            }
          }}
          value={otp}
          pattern='\d*'
          min='0'
          onInput={(e) => {
            if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            // check copied value is digits or not
            if (/^\d+$/.test(text)) {
              if (text.length >= 6) {
                setOtp(text.substring(0, 6));
                setIsVerifyOtp(true);
                return;
              }
              setOtp(text);
            }
          }}
        />
      </div>
      {/* sorted */}
      <div className='mt-3 flex justify-between items-center'>
        <div className='flex gap-0.5'>
          {timer && (
            <span className='text-primary-red text-xs leading-[18px]'>0:{resendTime}s</span>
          )}
        </div>
      </div>
      {/* sorted */}
      <div className='w-full flex justify-end'>
        {!timer ? (
          <button
            type='button'
            className='text-primary-red cursor-pointer font-semibold'
            onClick={() => {
              setOtp('');
              inputRef.current?.focus({ preventScroll: true });
              handleOnOTPSend();
            }}
          >
            <span>Resend OTP</span>
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

EkycOtpInput.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onSendOTPClick: PropTypes.func,
  disableSendOTP: PropTypes.bool,
  defaultResendTime: PropTypes.number,
  hasSentOTPOnce: PropTypes.bool,
  setIsVerifyOtp: PropTypes.func,
};

export default EkycOtpInput;

// inputRef.current?.focus({ preventScroll: true });
