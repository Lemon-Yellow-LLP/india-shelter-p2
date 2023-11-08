import { createContext, useState } from 'react';
import { useFormik } from 'formik';
import { signInSchema } from '../schemas/index';
import PropTypes from 'prop-types';

export const defaultValues = {
  employee_code: '',
  username: '9876543210',
  password: '',
  role: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  address: '',
  mobile_number: '',
  alternate_number: '',
  comments: '',
  extra_params: '',
  is_mobile_verified: false,
};

export const AuthContext = createContext(defaultValues);

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loData, setLoData] = useState({
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
  const [phoneNumberList, setPhoneNumberList] = useState({});
  const [otpFailCount, setOtpFailCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [isQaulifierActivated, setIsQaulifierActivated] = useState(null);

  const formik = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: signInSchema,
  });

  // console.log(formik.values);

  return (
    <AuthContext.Provider
      value={{
        ...formik,
        isAuthenticated,
        setIsAuthenticated,
        toastMessage,
        setToastMessage,
        otpFailCount,
        setOtpFailCount,
        token,
        setToken,
        isQaulifierActivated,
        setIsQaulifierActivated,
        loData,
        setLoData,
        phoneNumberList,
        setPhoneNumberList,
        errorToastMessage,
        setErrorToastMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
