import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import LeadCreationRoutes from './dashboard/lead-creation';
import Login from './login/Login';
import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import DashboardApplicant from './dashboard/DashboardApplicant';
import { logout } from '../global';
import PropTypes from 'prop-types';
import AdminPagination from '../components/AdminPagination';
import UserTable from '../components/UserTable';
import { LeadContext } from '../context/LeadContextProvider';

const TIMEOUT = 15 * 60 * 1000; // 15 minutes

const userslist = [
  {
    employee_code: '1',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '2',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '3',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '4',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '5',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '6',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '7',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '8',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '9',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '10',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '11',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: '12',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
];

const DashboardRoutes = () => {
  const [count, setCount] = useState(0);
  const [leadList, setLeadList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const { userStatus, userAction, setUserStatus, setUserAction } = useContext(LeadContext);

  const RequireAuth = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);

    // useEffect(() => {
    //   const resetSessionTimer = () => {
    //     const reset = async () => {
    //       try {
    //         await logout(
    //           {
    //             status: 'no',
    //             logout_via: 'New Login',
    //           },
    //           {
    //             headers: {
    //               Authorization: token,
    //             },
    //           },
    //         );

    //         window.location.reload();
    //       } catch (err) {
    //         window.location.reload();
    //         console.log(err);
    //       }
    //     };

    //     // // Reset the session timer when the user is Active
    //     const timer = setTimeout(reset, TIMEOUT);

    //     return () => clearTimeout(timer);
    //   };

    //   // Attach an event listener to track user activity
    //   window.addEventListener('touchmove', resetSessionTimer);

    //   // Clean up the event listener when the component unmounts
    //   return () => {
    //     window.removeEventListener('touchmove', resetSessionTimer);
    //   };
    // }, []);

    // Check authentication once and render accordingly

    if (isAuthenticated) {
      return children;
    } else {
      return <Navigate to='/login' />;
    }
  };

  const handleChange = (event, value) => {
    // Assuming each page contains a fixed number of items, let's say 10 items per page
    const itemsPerPage = 10;

    // Calculate the start and end count based on the current page
    const startCount = (value - 1) * itemsPerPage;
    const endCount = value * itemsPerPage - 1;

    setFilteredList(
      leadList.filter((lead, i) => {
        return i >= startCount && i <= endCount;
      }),
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setLeadList(userslist);
      setCount(Math.ceil(userslist.length / 10));
    }, 2000);
  }, []);

  useEffect(() => {
    setFilteredList(
      leadList.filter((lead, i) => {
        return i < 10;
      }),
    );
  }, [leadList]);

  console.log(userStatus);
  console.log(userAction);

  useEffect(() => {
    if (userStatus) {
      console.log('call status change api');
      setUserStatus('');
    }
  }, [userStatus]);

  useEffect(() => {
    if (userAction) {
      console.log('call action change api');
      setUserAction('');
    }
  }, [userAction]);

  return (
    <>
      <Routes>
        <Route
          path='/login'
          element={
            leadList.length ? (
              <>
                <UserTable userslist={filteredList} />
                <AdminPagination count={count} handlePageChangeCb={handleChange} />
              </>
            ) : (
              <span>Loading</span>
            )
          }
        ></Route>
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
