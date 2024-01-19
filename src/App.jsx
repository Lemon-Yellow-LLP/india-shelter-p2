import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const DashboardRoutes = lazy(() => import('./pages'));
import Loader from './components/Loader';
import ContextLayout from './context/ContextProvider';
import { useIdleTimer } from 'react-idle-timer';
import Overlay from './components/Overlay';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const CheckInternet = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      {!isOnline && <Overlay />}
      {children}
    </>
  );
};

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
        <CheckInternet>
          <Routes>
            <Route element={<ContextLayout />}>
              <Route path='*' element={<DashboardRoutes />} />
            </Route>
          </Routes>
        </CheckInternet>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
