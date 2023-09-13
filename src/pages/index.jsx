import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';

const currentUser = false;

const DashboardRoutes = () => {
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to={'/login'}></Navigate>;
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
