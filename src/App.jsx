import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardRoutes from './pages';
import Loader from './components/Loader';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<DashboardRoutes />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
