import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import DashboardApplicant from './dashboard/DashboardApplicant';
import axios from 'axios';
import { logout } from '../global';
import { LeadContext } from '../context/LeadContextProvider';

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

const DashboardRoutes = () => {
  const RequireAuth = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);

    //for testing
    const { setValues, setActiveIndex } = useContext(LeadContext);
    const getLead = async () => {
      await axios.get(`https://lo.scotttiger.in/api/dashboard/lead/377`).then(({ data }) => {
        setValues(data);
        setActiveIndex(0);
      });
    };
    useEffect(() => {
      getLead();
    }, []);

    //for testing end

    useEffect(() => {
      const resetSessionTimer = () => {
        const reset = async () => {
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

        // // Reset the session timer when the user is active
        const timer = setTimeout(reset, TIMEOUT);

        return () => clearTimeout(timer);
      };

      // Attach an event listener to track user activity
      window.addEventListener('mousemove', resetSessionTimer);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('mousemove', resetSessionTimer);
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

export default DashboardRoutes;
