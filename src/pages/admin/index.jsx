import { Routes, Route } from 'react-router-dom';
import CaseAssigning from './case-assignment';
import UserManagement from './user-management';
import StepConfiguration from './step-configuration';
import MasterManagement from './master-management';
import SideBar from '../../components/Sidebar';
import AdminHeader from '../../components/Header/AdminHeader';
import { useState } from 'react';

const AdminRoutes = () => {
  return (
    <div className='flex'>
      <div className='max-w-[252px] w-full'>
        <SideBar />
      </div>
      <div className='w-full'>
        <AdminHeader
          title='Manage users'
          showSearch={true}
          showButton={true}
          buttonText={
            <>
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='mr-2'
              >
                <path
                  d='M6 1V11M11 6L1 6'
                  stroke='#FEFEFE'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Add User
            </>
          }
          handleButtonClick={() => alert('form open')}
        />
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
