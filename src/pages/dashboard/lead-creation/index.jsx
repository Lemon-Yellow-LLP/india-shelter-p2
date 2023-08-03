import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AddressDetails = lazy(() => import('./address-details'));
const ApplicantDetails = lazy(() => import('./applicant-details'));
const BankingDetails = lazy(() => import('./banking-details'));
const LntCharges = lazy(() => import('./lnt-charges'));
const PersonalDetails = lazy(() => import('./personal-details'));
const ReferenceDetails = lazy(() => import('./reference-details'));
const WorkIncomeDetails = lazy(() => import('./work-income-details'));

const LeadCreationRoutes = () => {
  return (
    <Routes>
      <Route index element={<ApplicantDetails />} />
      <Route path='applicant-details' element={<ApplicantDetails />} />
      <Route path='address-details' element={<AddressDetails />} />
      <Route path='banking-details' element={<BankingDetails />} />
      <Route path='lnt-charges' element={<LntCharges />} />
      <Route path='personal-details' element={<PersonalDetails />} />
      <Route path='reference-details' element={<ReferenceDetails />} />
      <Route path='work-income-details' element={<WorkIncomeDetails />} />
    </Routes>
  );
};

export default LeadCreationRoutes;
