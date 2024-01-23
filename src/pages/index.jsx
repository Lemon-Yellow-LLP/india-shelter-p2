import { Route, Routes } from 'react-router-dom';
import Dashboard from './loan-officer';
import LeadCreationRoutes from './loan-officer/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import DashboardApplicant from './loan-officer/DashboardApplicant';
import PropTypes from 'prop-types';
import AdminRoutes from './admin/index.jsx';

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

const DashboardRoutes = () => {
  const RequireAuth = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);

    // Check authentication once and render accordingly

    if (isAuthenticated) {
      return children;
    } else {
      return <Navigate to='/login' />;
    }
  };

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route
          path='/'
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path='/dashboard'
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path='/dashboard/:id'
          element={
            <RequireAuth>
              <DashboardApplicant />
            </RequireAuth>
          }
        />
        <Route
          path='/lead/*'
          element={
            <RequireAuth>
              <LeadCreationRoutes />
            </RequireAuth>
          }
        />
        <Route path='*' element={<h1>404, Page not found!</h1>} />
      </Routes>
    </>
  );
};

DashboardRoutes.propTypes = {
  children: PropTypes.any,
};

export default DashboardRoutes;
