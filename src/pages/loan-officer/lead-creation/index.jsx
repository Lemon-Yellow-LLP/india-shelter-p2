import { lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Qualifier from './Qualifier';
import Eligibility from './Eligibility';
import Preview from './preview';
import { Snackbar } from '@mui/material';
import { useSearchParams, useLocation } from 'react-router-dom';
import BankingManual from './banking-details/BankingManual';
import AccountAggregator from './banking-details/AccountAggregator';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preview = searchParams.get('preview');
  const [open, setOpen] = useState(false);
  const [showPreviewFAB, setShowPreviewFAB] = useState(false);

  useEffect(() => {
    if (preview === location.pathname) {
      setOpen(true);
      setShowPreviewFAB(false);
    } else {
      setOpen(false);
    }
  }, [preview]);

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowPreviewFAB(true);
  };

  const gotoPreview = () => navigate('/lead/preview');

  const PreviewSnackbar = () => {
    return (
      <div className='flex-1 w-full p-3 flex flex-col gap-3 rounded bg-[#000000F2] shadow-[0px_8px_32px_0px_rgba(0_0_0_0.20)]'>
        <div className='flex gap-2 items-start'>
          <div className='flex-1 flex flex-col'>
            <h4 className='text-sm not-italic font-normal text-neutral-white'>
              Fill the mandatory fields
            </h4>
            <p className='not-italic font-normal text-[11px] leading-4 text-light-grey'>
              Looks like you have been directed from the <br /> preview page
            </p>
          </div>
          <button onClick={handleClose} className='p-[6px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              fill='none'
              viewBox='0 0 12 12'
            >
              <g stroke='#FEFEFE' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
                <path d='M11 1L1 11'></path>
                <path d='M1 1l10 10'></path>
              </g>
            </svg>
          </button>
        </div>

        <button onClick={gotoPreview} className='ml-auto'>
          <span className='text-right text-sm not-italic font-semibold text-primary-red'>
            Go To Preview
          </span>
        </button>
      </div>
    );
  };

  const PreviewFAB = () => {
    return (
      <div className='flex-1 flex justify-end w-full'>
        <button
          onClick={gotoPreview}
          className='w-fit inline-flex items-center gap-1 p-3 bg-primary-red rounded-full'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='none'
            viewBox='0 0 20 20'
          >
            <g>
              <g stroke='#FEFEFE' strokeWidth='1.5'>
                <path d='M17.61 8.21a2.57 2.57 0 010 3.579c-1.63 1.715-4.43 4.044-7.609 4.044-3.18 0-5.978-2.33-7.608-4.044a2.57 2.57 0 010-3.578C4.023 6.496 6.822 4.167 10 4.167c3.18 0 5.98 2.33 7.609 4.044z'></path>
                <path d='M12.501 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'></path>
              </g>
            </g>
          </svg>
          <span className='text-sm not-italic font-medium text-white'>Go to preview</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* {params['*'] === 'applicant-details' ||
      params['*'] === 'qualifier' ||
      params['*'] === 'lnt-charges' ||
      params['*'] === 'banking-details/manual' ||
      params['*'] === 'banking-details/account-aggregator' ? null : (
        <SwipeableDrawerComponent />
      )} */}
      <Routes>
        <Route index element={<ApplicantDetails />} />
        <Route path='applicant-details' element={<ApplicantDetails />} />
        <Route path='address-details' element={<AddressDetails />} />
        <Route path='banking-details' element={<BankingDetails />} />
        <Route path='banking-details/manual' element={<BankingManual />} />
        <Route path='banking-details/account-aggregator' element={<AccountAggregator />} />
        <Route path='lnt-charges' element={<LntCharges />} />
        <Route path='personal-details' element={<PersonalDetails />} />
        <Route path='reference-details' element={<ReferenceDetails />} />
        <Route path='work-income-details' element={<WorkIncomeDetails />} />
        <Route path='qualifier' element={<Qualifier />} />
        <Route path='property-details' element={<PropertyDetails />} />
        <Route path='upload-documents' element={<UploadDocuments />} />
        <Route path='eligibility' element={<Eligibility />}></Route>
        <Route path='preview' element={<Preview />} />
        <Route path='*' element={<h1>404, Page not found!</h1>} />
      </Routes>

      {/* Preview snackbar */}
      <Snackbar
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: showPreviewFAB ? 'transparent' : '#000000F2',
            fontFamily: 'Poppins',
            margin: 0,
            padding: 0,
            boxShadow: showPreviewFAB && 'none',
          },

          '& .MuiPaper-root .MuiSnackbarContent-message': {
            color: '#FEFEFE',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 400,
            padding: 0,
            width: '100%',
          },
        }}
        className='-translate-y-32 m-[10px]'
        open={open}
        onClose={handleClose}
        message={showPreviewFAB ? <PreviewFAB /> : <PreviewSnackbar />}
      />
    </>
  );
};

export default LeadCreationRoutes;
