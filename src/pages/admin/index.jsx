import { Routes, Route } from 'react-router-dom';
import CaseAssigning from './case-assignment';
import UserManagement from './user-management';
import StepConfiguration from './step-configuration';
import MasterManagement from './master-management';
import SideBar from '../../components/Sidebar';

const AdminRoutes = () => {
  return (
    <div className='flex'>
      <div className='max-w-[252px] w-full'>
        <SideBar />
      </div>
      <div className='w-full'>
        <Routes>
          <Route index element={<UserManagement />}></Route>
          <Route path='/user-management' element={<UserManagement />}></Route>
          <Route path='/master-management' element={<MasterManagement />}></Route>
          <Route path='/step-configuration' element={<StepConfiguration />}></Route>
          <Route path='/case-assignment' element={<CaseAssigning />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
