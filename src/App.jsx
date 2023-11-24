import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const DashboardRoutes = lazy(() => import('./pages'));
import Loader from './components/Loader';
import ContextLayout from './context/ContextProvider';
import { useIdleTimer } from 'react-idle-timer';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

function App() {
  const logout = () => {
    window.location.replace('/');
    console.log('User logged out due to inactivity');
  };

  const idleTimer = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: logout,
    onPresenceChange: (presence) => {
      // Handle state changes in one function
      console.log(presence);
    },
  });
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route element={<ContextLayout />}>
            <Route path='*' element={<DashboardRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
