import { Route, Routes } from 'react-router-dom';
import AuthContextLayout from '../context/AuthContext';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthContextLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/lead/*' element={<LeadCreationRoutes />} />
        <Route path='*' element={<h1>404, Page not found!</h1>} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
