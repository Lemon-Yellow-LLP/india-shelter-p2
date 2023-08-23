import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

export const defaultValues = {
  reference_one_type: '',
  reference_one_full_name: '',
  reference_one_phone_number: '',
  reference_one_address: '',
  reference_one_pincode: '',
  reference_one_city: '',
  reference_one_state: '',
  reference_one_email: '',
  reference_two_type: '',
  reference_two_full_name: '',
  reference_two_phone_number: '',
  reference_two_address: '',
  reference_two_pincode: '',
  reference_two_city: '',
  reference_two_state: '',
  reference_two_email: '',
};

export const AuthContext = createContext(defaultValues);

const AuthContextProvider = ({ children }) => {
  const [inputDisabled, setInputDisabled] = useState(false);

  const formik = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: signUpSchema,
    onSubmit: (_, action) => {
      action.resetForm(defaultValues);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        ...formik,
        inputDisabled,
        setInputDisabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextLayout = () => {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  );
};

export default AuthContextLayout;

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
