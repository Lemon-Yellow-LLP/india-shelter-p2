import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const defaultValues = {
  lead_id: '',
  applicant_id: '',
};

export const AuthContext = createContext(defaultValues);

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
