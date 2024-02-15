import { createContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { signInSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import axios from 'axios';
import { addUser, editUser } from '../global';

export const defaultValues = {
  employee_code: '',
  username: '',
  // password: '',
  role: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  // address: '',
  mobile_number: '',
  // alternate_number: '',
  // comments: '',
  // extra_params: '',
  branch: '',
  department: '',
  // is_active: true,
  loimage: '',
  // is_mobile_verified: false,
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

  //p3 states
  const [userStatus, setUserStatus] = useState(null);
  const [userAction, setUserAction] = useState(null);
  const [show, setShow] = useState(false);
  const [useradd, setUseradd] = useState(null);

  useEffect(() => {
    if (sfdcCount > 1) {
      setToastMessage(null);
    }
  }, [sfdcCount]);

  const formik = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: signInSchema,
    onSubmit: (values) => {
      if (userAction) {
        const editedUser = editUser(userAction.id, values);
        setUseradd(editedUser);
        setShow(false);
      } else {
        const user = addUser(values);
        setUseradd(user);
        setShow(false);
      }
    },
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
        userStatus,
        setUserStatus,
        userAction,
        setUserAction,
        show,
        setShow,
        useradd,
        setUseradd,
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
