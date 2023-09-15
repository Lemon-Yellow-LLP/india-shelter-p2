import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const DashboardRoutes = lazy(() => import('./pages'));
import Loader from './components/Loader';
import ContextLayout from './context/ContextProvider';

function App() {
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
