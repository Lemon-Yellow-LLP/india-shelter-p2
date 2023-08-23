import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

export const defaultValues = {
  selected_personal_details_mode: null,
  gender: null,
  marital_status: null,
  id_type: null,
  id_number: '',
  address_proof: null,
  address_proof_number: '',
  date_of_birth: null,
  mobile_number: '',
  father_or_husband_name: '',
  mother_name: '',
  religion: '',
  preferred_language: '',
  qualification: '',
  email: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  profession: '',
};

export const AuthContext = createContext(defaultValues);

const AuthContextProvider = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [stepsProgress, setStepProgress] = useState([
    {
      title: 'Applicant Details',
      description: 'Name, Mobile Number, Loan Type',
      progress: 0,
      url: '/lead/applicant-details',
    },
    {
      title: 'Personal Details',
      description: 'OCR, e-KYC, Address',
      progress: 0,
      url: '/lead/personal-details',
    },
    {
      title: 'Address Details',
      description: 'OCR, e-KYC, Address',
      progress: 0,
      url: '/lead/address-details',
    },
    {
      title: 'Work/Income Details',
      description: 'Profession details, Family Income',
      progress: 0,
      url: '/lead/work-income-details',
    },
    {
      title: 'Property Details',
      description: 'Loan Type, Property address',
      progress: 0,
      url: '/lead/property-details',
    },
    {
      title: 'Banking Details',
      description: 'IFSC Details, Bank Statement',
      progress: 0,
      url: '/lead/banking-details',
    },
    {
      title: 'Reference Details',
      description: 'Reference person name, Mobile number',
      progress: 0,
      url: '/lead/reference-details',
    },
    {
      title: 'Upload Documents',
      description: 'Aadhar, PAN, Property document',
      progress: 0,
      url: '/lead/upload-documents',
    },
    {
      title: 'L&T Charges',
      description: 'Fee details',
      progress: 0,
      url: '/lead/lnt-charges',
    },
  ]);

  const [applicants, setApplicants] = useState([
    {
      title: 'Suresh Ramji Shah ️',
      description: 'Name, Mobile Number, Loan Type',
      progress: 0,
      applicant: true,
    },
    {
      title: 'Anjali Shah ️',
      description: 'OCR, e-KYC, Address',
      progress: 0,
      applicant: false,
    },
  ]);

  const updateProgress = (updateIndex, requiredFieldsStatus) => {
    let trueCount = 0;

    for (const field in requiredFieldsStatus) {
      if (requiredFieldsStatus[field] === true) {
        trueCount++;
      }
    }

    setStepProgress((prevStepsProgress) => {
      const newData = prevStepsProgress.map((step, index) => {
        if (index === updateIndex && step.progress !== 100) {
          return {
            ...step,
            progress:
              (parseInt(trueCount + 1) / parseInt(Object.keys(requiredFieldsStatus).length)) * 100,
          };
        }
        return step;
      });
      return newData;
    });
  };

  const addApplicant = () => {
    setApplicants((prevStepsProgress) => {
      let newData = [...prevStepsProgress];
      newData.push({
        title: '',
        description: '',
        progress: 0,
        applicant: false,
      });
      return newData;
    });
  };

  const formik = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: signUpSchema,
    onSubmit: (_, action) => {
      action.resetForm(defaultValues);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        ...formik,
        stepsProgress,
        updateProgress,
        applicants,
        addApplicant,
        currentStepIndex,
        setCurrentStepIndex,
        drawerOpen,
        setDrawerOpen,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextLayout = () => {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  );
};

export default AuthContextLayout;

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
