import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import DashboardApplicant from './dashboard/DashboardApplicant';
import { logout } from '../global';
import PropTypes from 'prop-types';

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

const DashboardRoutes = () => {
  const RequireAuth = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);

    useEffect(() => {
      const resetSessionTimer = () => {
        const reset = async () => {
          try {
            await logout(
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

            window.location.reload();
          } catch (err) {
            window.location.reload();
            console.log(err);
          }
        };

        // // Reset the session timer when the user is active
        const timer = setTimeout(reset, TIMEOUT);

        return () => clearTimeout(timer);
      };

      // Attach an event listener to track user activity
      window.addEventListener('touchstart', resetSessionTimer);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('touchstart', resetSessionTimer);
      };
    }, []);

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
