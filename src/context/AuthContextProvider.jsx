import { createContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { signInSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import axios from 'axios';

export const defaultValues = {
  employee_code: '',
  username: import.meta.env.VITE_DEV === 'true' ? '9876543210' : '',
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
  const [loData, setLoData] = useState(null);
  const [loAllDetails, setLoAllDetails] = useState(null);
  const [phoneNumberList, setPhoneNumberList] = useState({});
  const [otpFailCount, setOtpFailCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  // move adminToastMessage to AdminContextProvider
  const [adminToastMessage, setAdminToastMessage] = useState('User has been added successfully');
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [isQaulifierActivated, setIsQaulifierActivated] = useState(null);
  const [sfdcCount, setSfdcCount] = useState(0);

  useEffect(() => {
    if (sfdcCount > 1) {
      setToastMessage(null);
    }
  }, [sfdcCount]);

  const formik = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: signInSchema,
  });

  const getLoAllDetails = async () => {
    if (loData?.session?.user_id) {
      await axios
        .get(`https://uatagile.indiashelter.in/api/account/${loData?.session?.user_id}`)
        .then(({ data }) => {
          setLoAllDetails(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    console.log('Lo All Details', loAllDetails);
  }, [loAllDetails]);

  useEffect(() => {
    getLoAllDetails();
    console.log('Lo Session Data', { loData, token, isAuthenticated });
  }, [loData, token, isAuthenticated]);

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
        loAllDetails,
        sfdcCount,
        setSfdcCount,
        adminToastMessage,
        setAdminToastMessage,
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
