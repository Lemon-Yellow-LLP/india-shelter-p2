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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loData, setLoData] = useState(null);
  const [loAllDetails, setLoAllDetails] = useState(null);
  const [phoneNumberList, setPhoneNumberList] = useState({});
  const [otpFailCount, setOtpFailCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  // move adminToastMessage to AdminContextProvider
  const [adminToastMessage, setAdminToastMessage] = useState('User has been added successfully');
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [errorToastSubMessage, setErrorToastSubMessage] = useState(null);
  const [isQaulifierActivated, setIsQaulifierActivated] = useState(null);
  const [sfdcCount, setSfdcCount] = useState(0);

  //p3 states
  const [userStatus, setUserStatus] = useState(null);
  const [userAction, setUserAction] = useState(null);
  const [show, setShow] = useState(false);
  const [showActionControlPopup, setShowActionControlPopup] = useState(false);
  const [useradd, setUseradd] = useState(null);
  const [userToastMessage, setUserToastMessage] = useState();
  const [toastType, setToastType] = useState();

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
        editUser(userAction.id, values, {
          headers: {
            Authorization: token,
          },
        })
          .then((editedUser) => {
            setToastType('success');
            setUserToastMessage('Changes saved successfully!');
            setUseradd(editedUser);
            setShow(false);
            setShowActionControlPopup(false);
            formik.setValues(formik.initialValues);
            setUserAction(null);
          })
          .catch((error) => {
            console.log('EDIT_USER_ERROR', error);
            setToastType('error');
            setUserToastMessage(`Changes couldn't be saved!`);
            setShowActionControlPopup(false);
            setShow(false);
            formik.setValues(formik.initialValues);
            setUserAction(null);
          });
      } else {
        addUser(values, {
          headers: {
            Authorization: token,
          },
        })
          .then((user) => {
            setToastType('success');
            setUserToastMessage('User added successfully!');
            setUseradd(user);
            setShow(false);
            formik.setValues(formik.initialValues);
          })
          .catch((error) => {
            console.log('ADD_USER_ERROR', error);
            if (error.response.status == 400) {
              formik.setFieldError('employee_code', 'This is an existing user');
              return;
            }
            setToastType('error');
            setUserToastMessage(`User couldn't be added!`);
            setShow(false);
            formik.setValues(formik.initialValues);
          });
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
        errorToastSubMessage,
        setErrorToastSubMessage,
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
        userToastMessage,
        setUserToastMessage,
        toastType,
        setToastType,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        showActionControlPopup,
        setShowActionControlPopup,
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
