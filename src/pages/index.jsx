import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import FaceAuth from './login/FaceAuth';
import { useContext, useEffect, useState } from 'react';
import Login from './login/Login';
import { AuthContext } from '../context/AuthContextProvider';
import { LeadContext } from '../context/LeadContextProvider';
import axios from 'axios';

const DashboardRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { setValues, setActiveIndex } = useContext(LeadContext);

  const getData = async () => {
    await axios
      .get(`https://lo.scotttiger.in/api/dashboard/lead/124`)
      .then(({ data }) => {
        setValues({ ...data });
        let newActiveIndex = 0;
        data.applicants.map((e, index) => {
          if (e.applicant_details.is_primary) {
            newActiveIndex = index;
          }
        });
        setActiveIndex(newActiveIndex);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/lead/*' element={<LeadCreationRoutes />} />
          <Route path='*' element={<h1>404, Page not found!</h1>} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default DashboardRoutes;
