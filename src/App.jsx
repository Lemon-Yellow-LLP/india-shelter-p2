import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const DashboardRoutes = lazy(() => import('./pages'));
import Loader from './components/Loader';
import AuthContextLayout from './context/AuthContext';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthContextLayout />}>
            <Route path='*' element={<DashboardRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
