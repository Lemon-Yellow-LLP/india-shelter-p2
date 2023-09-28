import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SwipeableDrawerComponent from '../../../components/SwipeableDrawer/LeadDrawer';
import BRE_ONE from './bre-screen';

const AddressDetails = lazy(() => import('./address-details'));
const ApplicantDetails = lazy(() => import('./applicant-details'));
const BankingDetails = lazy(() => import('./banking-details'));
const LntCharges = lazy(() => import('./lnt-charges'));
const PersonalDetails = lazy(() => import('./personal-details'));
const ReferenceDetails = lazy(() => import('./reference-details'));
const WorkIncomeDetails = lazy(() => import('./work-income-details'));
const PropertyDetails = lazy(() => import('./property-details'));
const UploadDocuments = lazy(() => import('./upload-documents'));

const LeadCreationRoutes = () => {
  return (
    <>
      <SwipeableDrawerComponent />
      <Routes>
        <Route index element={<ApplicantDetails />} />
        <Route path='applicant-details' element={<ApplicantDetails />} />
        <Route path='address-details' element={<AddressDetails />} />
        <Route path='banking-details' element={<BankingDetails />} />
        <Route path='lnt-charges' element={<LntCharges />} />
        <Route path='personal-details' element={<PersonalDetails />} />
        <Route path='reference-details' element={<ReferenceDetails />} />
        <Route path='work-income-details' element={<WorkIncomeDetails />} />
        <Route path='qualifier' element={<BRE_ONE />} />
        <Route path='property-details' element={<PropertyDetails />} />
        <Route path='upload-documents' element={<UploadDocuments />} />
        <Route path='*' element={<h1>404, Page not found!</h1>} />
      </Routes>
    </>
  );
};

export default LeadCreationRoutes;
