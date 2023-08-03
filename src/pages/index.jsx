import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthContextLayout from '../context/AuthContext';
import Dashboard from './dashboard';

const AddressDetails = lazy(() => import('./dashboard/lead-creation/address-details'));
const ApplicantDetails = lazy(() => import('./dashboard/lead-creation/applicant-details'));
const BankingDetails = lazy(() => import('./dashboard/lead-creation/banking-details'));
const LntCharges = lazy(() => import('./dashboard/lead-creation/lnt-charges'));
const PersonalDetails = lazy(() => import('./dashboard/lead-creation/personal-details'));
const ReferenceDetails = lazy(() => import('./dashboard/lead-creation/reference-details'));
const WorkIncomeDetails = lazy(() => import('./dashboard/lead-creation/work-income-details'));

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthContextLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/lead'>
          <Route index element={<ApplicantDetails />} />
          <Route path='applicant-details' element={<ApplicantDetails />} />
          <Route path='address-details' element={<AddressDetails />} />
          <Route path='banking-details' element={<BankingDetails />} />
          <Route path='lnt-charges' element={<LntCharges />} />
          <Route path='personal-details' element={<PersonalDetails />} />
          <Route path='reference-details' element={<ReferenceDetails />} />
          <Route path='work-income-details' element={<WorkIncomeDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
