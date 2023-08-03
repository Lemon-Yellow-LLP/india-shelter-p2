import { Route, Routes } from 'react-router-dom';
import AuthContextLayout from '../context/AuthContext';
import Dashboard from './dashboard';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthContextLayout />}>
        <Route path='/' element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
