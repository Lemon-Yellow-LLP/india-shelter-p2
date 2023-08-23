import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import FaceAuth from './login/FaceAuth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from './login/Login';

const DashboardRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
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
          {/* <Route path='/' element={<FaceAuth />} /> */}
          <Route path='/' element={<Dashboard />} />
          <Route path='/manual-login' element={<Login />} />
          <Route path='*' element={<FaceAuth />} />
        </Routes>
      )}
    </>
  );
};

export default DashboardRoutes;
