import { Route, Routes } from 'react-router-dom';
import Dashboard, { DashboardTest } from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { LeadContext } from '../context/LeadContextProvider';
import axios from 'axios';
import DashboardApplicant from './dashboard/DashboardApplicant';

const DashboardRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { setValues, setActiveIndex } = useContext(LeadContext);

  // const getData = async () => {
  //   await axios
  //     .get(`https://lo.scotttiger.in/api/dashboard/lead/124`)
  //     .then(({ data }) => {
  //       setValues({ ...data });
  //       let newActiveIndex = 0;
  //       data.applicants.map((e, index) => {
  //         if (e.applicant_details.is_primary) {
  //           newActiveIndex = index;
  //         }
  //       });
  //       setActiveIndex(newActiveIndex);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to={'/login'}></Navigate>;
  };

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route
          path='/'
          element={
            <RequireAuth>
              <DashboardTest />
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
