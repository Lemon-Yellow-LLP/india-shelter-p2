import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthContextLayout from '../context/AuthContext';
import Dashboard from './dashboard';

const AddressDetails = lazy(() => import('./address-details'));
const ApplicantDetails = lazy(() => import('./applicant-details'));
const BankingDetails = lazy(() => import('./banking-details'));
const LntCharges = lazy(() => import('./lnt-charges'));
const PersonalDetails = lazy(() => import('./personal-details'));
const ReferenceDetails = lazy(() => import('./reference-details'));
const WorkIncomeDetails = lazy(() => import('./work-income-details'));

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthContextLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/address-details' element={<AddressDetails />} />
        <Route path='/applicant-details' element={<ApplicantDetails />} />
        <Route path='/banking-details' element={<BankingDetails />} />
        <Route path='/lnt-charges' element={<LntCharges />} />
        <Route path='/personal-details' element={<PersonalDetails />} />
        <Route path='/reference-details' element={<ReferenceDetails />} />
        <Route path='/work-income-details' element={<WorkIncomeDetails />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
