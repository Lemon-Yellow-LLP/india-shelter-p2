import React, { useCallback, useContext, useState } from 'react';
import TextInputWithSendOtp from '../../components/TextInput/TextInputWithSendOtp';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import { OtpInput, ToastMessage, Button } from '../../components';
import { getLoginOtp, logout, verifyLoginOtp } from '../../global';
import otpVerified from '../../assets/icons/otp-verified.svg';
import DynamicDrawer from '../../components/SwipeableDrawer/DynamicDrawer';
import { Header } from '../../components';
import { useNavigate } from 'react-router-dom';

const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

export default function Login() {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setFieldError,
    isAuthenticated,
    setIsAuthenticated,
    setOtpFailCount,
    otpFailCount,
    token,
    setToken,
  } = useContext(AuthContext);
  const { toastMessage, setToastMessage } = useContext(AuthContext);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(values?.is_mobile_verified);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;

    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }
    if (phoneNumber.length > 10) {
      return;
    }
    if (DISALLOW_NUM.includes(phoneNumber)) {
      e.preventDefault();
      return;
    }

    setShowOTPInput(false);

    setFieldValue('username', phoneNumber);

    if (phoneNumber.length === 10) {
      setHasSentOTPOnce(false);
    }
  }, []);

  const sendMobileOtp = async () => {
    setDisablePhoneNumber(true);
    setShowOTPInput(true);
    setHasSentOTPOnce(true);
    getLoginOtp(values.username);
    setToastMessage('OTP has been sent to the mobile number');
  };

  const verifyOTP = useCallback(
    async (loginotp) => {
      const otp = parseInt(loginotp);

      try {
        const res = await verifyLoginOtp(values.username, {
          otp,
        });

        if (!res) return;

        if (res.old_session_message === 'No old sessions') {
          setToken(res.token);
          setDisablePhoneNumber(false);
          setMobileVerified(true);
          setFieldError('username', undefined);
          setShowOTPInput(false);
          setIsAuthenticated(true);
          return true;
        }

        setIsOpen(true);
        setToken(res.token);
        setDisablePhoneNumber(false);
        setMobileVerified(true);
        setFieldError('username', undefined);
        setShowOTPInput(false);
        setIsOpen(true);
      } catch (err) {
        console.log(err);

        setMobileVerified(false);
        setOtpFailCount(err.response.data.fail_count);
        setIsAuthenticated(false);
        return false;
      }
    },
    [values.username, setFieldError, setMobileVerified],
  );

  const handleLogout = async () => {
    try {
      const res = await logout(
        {
          status: 'no',
          logout_via: 'New Login',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (!res) return;

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await logout(
        {
          status: 'yes',
          logout_via: 'New Login',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (!res) return;

      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />

      <div className='bg-[#CCE2BE] overflow-hidden'>
        <div>
          <img src='./IS-Login-Logo.png' alt='login-logo' />
        </div>

        <div className='flex flex-col gap-5 px-4 pb-4 pt-3 rounded-t-2xl h-full bg-white'>
          <div>
            <h2 className='text-primary-black font-semibold'>Welcome!</h2>
            <p className='text-dark-grey font-normal'>Login to continue</p>
          </div>

          <ToastMessage message={toastMessage} setMessage={setToastMessage} />

          <TextInputWithSendOtp
            type='tel'
            inputClasses='hidearrow'
            label='Mobile Number'
            placeholder='Eg: 1234567890'
            required
            name='username'
            value={values.username}
            onChange={handleOnPhoneNumberChange}
            error={errors.username}
            touched={touched.username}
            onOTPSendClick={sendMobileOtp}
            disabledOtpButton={
              !values.username || !!errors.username || mobileVerified || hasSentOTPOnce
            }
            disabled={disablePhoneNumber || mobileVerified}
            message={
              mobileVerified
                ? `<img src="${otpVerified}" alt='Otp Verified' role='presentation' /> OTP Verfied`
                : null
            }
            onBlur={(e) => {
              handleBlur(e);
            }}
            pattern='\d*'
            onFocus={(e) =>
              e.target.addEventListener(
                'wheel',
                function (e) {
                  e.preventDefault();
                },
                { passive: false },
              )
            }
            min='0'
            onInput={(e) => {
              if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
            }}
          />

          {showOTPInput && (
            <OtpInput
              label='Enter OTP'
              required
              verified={mobileVerified}
              setOTPVerified={setMobileVerified}
              onSendOTPClick={sendMobileOtp}
              defaultResendTime={30}
              disableSendOTP={!mobileVerified}
              verifyOTPCB={verifyOTP}
              hasSentOTPOnce={hasSentOTPOnce}
            />
          )}

          <Button
            disabled={!mobileVerified}
            primary
            inputClasses={`h-[48px] ${mobileVerified ? 'font-semibold' : 'font-normal'}`}
            link='/'
          >
            Login
          </Button>

          <p className='absolute w-[328px] text-xs text-light-grey font-normal text-center bottom-4 flex flex-col justify-center left-2/4 -translate-x-2/4'>
            In case of any queries, write a mail to
            <span className='text-primary-black text-xs'>abc@xyz.com</span>
          </p>
        </div>
      </div>

      <DynamicDrawer open={isOpen} setOpen={() => {}} height='200px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-1'>
              Previous session was not properly logged out
            </h4>
            <p className='text-center text-sm not-italic font-normal text-primary-black'>
              Do you want to log out previous session and continue with the new one?
            </p>
          </div>
        </div>
        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={handleLogout}>
            No
          </Button>
          <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handleLogin}>
            Yes
          </Button>
        </div>
      </DynamicDrawer>
    </>
  );
}
