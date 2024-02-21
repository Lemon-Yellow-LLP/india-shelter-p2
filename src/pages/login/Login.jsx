import { useCallback, useContext, useState } from 'react';
import TextInputWithSendOtp from '../../components/TextInput/TextInputWithSendOtp';
import { AuthContext } from '../../context/AuthContextProvider';
import { ToastMessage, Button } from '../../components';
import {
  checkLoanOfficerExists,
  getLoginOtp,
  getUserById,
  logout,
  verifyLoginOtp,
} from '../../global';
import DynamicDrawer from '../../components/SwipeableDrawer/DynamicDrawer';
import { Header } from '../../components';
import { useNavigate } from 'react-router-dom';
import OtpInputNoEdit from '../../components/OtpInput/OtpInputNoEdit';
import ErrorTost from '../../components/ToastMessage/ErrorTost';

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
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    setOtpFailCount,
    token,
    setToken,
    toastMessage,
    setToastMessage,
    loData,
    setLoData,
    setPhoneNumberList,
    errorToastMessage,
    setErrorToastMessage,
  } = useContext(AuthContext);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(values?.is_mobile_verified);
  const [isOpen, setIsOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleOnPhoneNumberChange = useCallback(async (e) => {
    const phoneNumber = e.currentTarget.value;
    setLoginError('');
    const pattern = /^\d+$/;
    if (!pattern.test(phoneNumber) && phoneNumber.length > 0) {
      return;
    }

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
    setPhoneNumberList((prev) => {
      return { ...prev, lo: phoneNumber };
    });

    if (phoneNumber.length === 10) {
      setHasSentOTPOnce(false);
    }
  }, []);

  const sendMobileOtp = async () => {
    setLoginError('');
    //For bypass
    if (values.username.toString() === '9876543210') {
      setDisablePhoneNumber(true);
      setHasSentOTPOnce(true);
      setShowOTPInput(true);
    } else {
      try {
        await checkLoanOfficerExists(values.username);

        const res = await getLoginOtp(values.username);

        if (res.error) {
          setDisablePhoneNumber(false);
          setHasSentOTPOnce(false);
          setShowOTPInput(false);
          setErrorToastMessage(res.message);
          setLoginError(res.message);
          return;
        }

        setDisablePhoneNumber(true);
        setHasSentOTPOnce(true);
        setShowOTPInput(true);
        setLoginError('');
        setToastMessage('OTP has been sent to the mobile number');
      } catch (error) {
        console.log(error);
        if (!error.response.data.status) {
          setFieldError('username', 'User with this number does not exists');
        }
      }
    }
  };

  const verifyOTP = useCallback(
    async (loginotp) => {
      const otp = parseInt(loginotp);

      //For bypass
      if (import.meta.env.VITE_DEV === 'true') {
        if (values.username.toString() === '9876543210' && otp === 12345) {
          setDisablePhoneNumber(false);
          setMobileVerified(true);
          setFieldError('username', undefined);
          setShowOTPInput(false);
          setIsAuthenticated(true);
          setLoData({
            message: 'Successfully Logged In.',
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiNzAzOTczOTA5OSIsImlhdCI6MTY5OTQyMTQxMCwiZXhwIjoxNjk5NDUwMjEwfQ.wDspaOCJoLeExV8mYllXCc3wpMMmEzzVC_dvDQ8DsTE',
            session: {
              id: 878,
              token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiNzAzOTczOTA5OSIsImlhdCI6MTY5OTQyMTQxMCwiZXhwIjoxNjk5NDUwMjEwfQ.wDspaOCJoLeExV8mYllXCc3wpMMmEzzVC_dvDQ8DsTE',
              user_id: 14,
              employee_code: null,
              login_via: null,
              logout_via: null,
              logged_out_at: null,
              device_details: 'Mobile Safari 16.6.0 iOS 16.6.0 iPhone 0.0.0',
              geo_lat: null,
              geo_long: null,
              sms_logs: {
                sms_request: {
                  ip: '::ffff:127.0.0.1',
                  user_agent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/119.0.0.0',
                  sms_log_data: {
                    id: 3098,
                    dump: {},
                    method: 'post',
                    endpoint:
                      'https://202e24cd06a2adb8bffc7b9ca64a60766273f41e5dcbc729:5f7970a89d1842ab66962aa5a48141cb79b05031753a2fc6@api.exotel.com/v1/Accounts/indiashelter1/Sms/send?From=ISFCHL&To=7039739099&Body=Your%20OTP%20for%20login%20is%2058218.%0APlease%20enter%20this%20code%20to%20access%20your%20account.%20Do%20not%20share%20this%20OTP%20to%20anyone%20for%20security%20reasons.%0AThank%20You%0A-%20India%20Shelter%20Finance%20Corporation&DltEntityId=1201159141940678598&DltTemplateId=1007169458013483608&SmsType=transactional',
                    timestamp: '2023-11-08T05:29:37.819Z',
                  },
                  response_data:
                    '<?xml version="1.0" encoding="UTF-8"?>\n<TwilioResponse><SMSMessage><Sid>8f8932ef6fbcc255c0bf4e0dc0eb17b8</Sid><AccountSid>indiashelter1</AccountSid><From>/ISFCHL</From><To>07039739099</To><DateCreated>2023-11-08 10:59:38</DateCreated><DateUpdated>2023-11-08 10:59:38</DateUpdated><DateSent>1970-01-01 05:30:00</DateSent><Body>Your OTP for login is 58218.&#xA;Please enter this code to access your account. Do not share this OTP to anyone for security reasons.&#xA;Thank You&#xA;- India Shelter Finance Corporation</Body><Direction>outbound-api</Direction><Uri>/v1/Accounts/indiashelter1/SMS/Messages/8f8932ef6fbcc255c0bf4e0dc0eb17b8</Uri><ApiVersion></ApiVersion><Price></Price><Status>queued</Status><SmsUnits></SmsUnits><DetailedStatusCode>21010</DetailedStatusCode><DetailedStatus>PENDING_TO_OPERATOR</DetailedStatus></SMSMessage></TwilioResponse>',
                  response_date: '2023-11-08T05:29:38.087Z',
                  response_status: 200,
                  response_headers: {
                    date: 'Wed, 08 Nov 2023 05:29:38 GMT',
                    connection: 'close',
                    'content-type': 'application/xml',
                    'content-length': '850',
                    'x-frame-options': 'SAMEORIGIN',
                    'x-xss-protection': '1; mode=block',
                    'x-content-type-options': 'nosniff',
                  },
                },
              },
              extra_params: null,
              created_at: '2023-11-08T05:30:10.692Z',
              updated_at: '2023-11-08T05:30:10.692Z',
            },
            old_session_message: 'Old sessions',
          });
          return true;
        }
      }

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
          setLoData(res);

          if (res.user.role === 'Loan Officer') {
            setIsAuthenticated(true);
            return true;
          }

          setIsAdminAuthenticated(true);
          return true;
        }

        setIsOpen(true);
        setToken(res.token);
        setDisablePhoneNumber(false);
        setMobileVerified(true);
        setFieldError('username', undefined);
        setShowOTPInput(false);
        setIsOpen(true);
        setLoData(res);
      } catch (err) {
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

      if (res.user.role === 'Loan Officer') {
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setIsAdminAuthenticated(true);
        navigate('/admin');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ToastMessage message={toastMessage} setMessage={setToastMessage} />

      <ErrorTost message={errorToastMessage} setMessage={setErrorToastMessage} />

      <Header inputClasses='hidden md:flex' />

      <div className='bg-[#CCE2BE] overflow-hidden h-[100vh] relative md:flex'>
        <Header inputClasses='md:hidden' />

        <div>
          <img src='./IS-Login-Logo.png' alt='login-logo' />
        </div>

        <div className='loginstyles absolute md:relative bottom-0 w-full flex flex-col gap-5 px-4 pb-4 pt-3 rounded-t-2xl md:rounded-[0px] bg-white overflow-auto no-scrollbar'>
          <div>
            <h2 className='text-primary-black font-semibold'>Welcome!</h2>
            <p className='text-dark-grey font-normal'>Login to continue</p>
          </div>
          <TextInputWithSendOtp
            type='tel'
            inputClasses='hidearrow'
            label='Mobile Number'
            placeholder='Eg: 1234567890'
            required
            name='username'
            value={values.username}
            onChange={handleOnPhoneNumberChange}
            error={errors.username || loginError}
            touched={touched.username}
            onOTPSendClick={sendMobileOtp}
            disabledOtpButton={
              !values.username || !!errors.username || mobileVerified || hasSentOTPOnce
            }
            disabled={disablePhoneNumber || mobileVerified}
            message={
              mobileVerified
                ? `<svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    d='M15 4.5L6.75 12.75L3 9'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg> OTP Verfied`
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
            <OtpInputNoEdit
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
            inputClasses={`h-[48px] md:!w-full ${mobileVerified ? 'font-semibold' : 'font-normal'}`}
            link={isAuthenticated ? '/' : '/admin'}
          >
            Login
          </Button>

          <p className='mt-auto text-xs text-light-grey font-normal text-center  flex flex-col justify-center '>
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
