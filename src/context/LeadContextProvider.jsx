import { createContext, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { validationSchemaLead } from '../schemas/index';
import { defaultErrorsLead } from './defaultErrorsLead';
import { defaultValuesLead } from './defaultValuesLead';
import { useNavigate } from 'react-router-dom';
import {
  ApplicantDetailsIcon,
  WorkIncomeIcon,
  UploadIcon,
  ReferenceDetailsIcon,
  QualifierIcon,
  PropertyDetailsIcon,
  PreviewIcon,
  PersonalDetailsIcon,
  LnTIcon,
  BankingDetailsIcon,
  AddressDetailsIcon,
} from '../assets/icons';

export const LeadContext = createContext(defaultValuesLead);

const LeadContextProvider = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExisting, setIsExisting] = useState(true);
  const [existingData, setExistingData] = useState({});

  const [stepsProgress, setStepProgress] = useState([
    {
      title: 'Applicant Details',
      description: 'Name, Mobile Number, Loan Type',
      progress: 0,
      url: '/lead/applicant-details',
      Icon: ApplicantDetailsIcon,
    },
    {
      title: 'Personal Details',
      description: 'OCR, e-KYC, Address',
      progress: 0,
      url: '/lead/personal-details',
      lock: true,
      Icon: PersonalDetailsIcon,
    },
    {
      title: 'Address Details',
      description: 'OCR, e-KYC, Address',
      progress: 0,
      url: '/lead/address-details',
      lock: true,
      Icon: AddressDetailsIcon,
    },
    {
      title: 'Work/Income Details',
      description: 'Profession details, Family Income',
      progress: 0,
      url: '/lead/work-income-details',
      lock: true,
      Icon: WorkIncomeIcon,
    },
    {
      title: 'Qualifier is not activated',
      description: 'Complete Applicant, Personal, Address and Work & Income details to activate',
      url: '/lead/work-income-details',
      hideProgress: true,
      Icon: QualifierIcon,
    },
    {
      title: 'L&T Charges',
      description: 'Fee details',
      progress: 0,
      url: '/lead/lnt-charges',
      lock: true,
      Icon: LnTIcon,
    },
    {
      title: 'Property Details',
      description: 'Profession details, Family Income',
      progress: 0,
      url: '/lead/property-details',
      lock: true,
      Icon: PropertyDetailsIcon,
    },
    {
      title: 'Banking Details',
      description: 'IFSC Details, Bank Statement',
      progress: 0,
      url: '/lead/banking-details',
      lock: true,
      Icon: BankingDetailsIcon,
    },
    {
      title: 'Reference Details',
      description: 'Reference person name, Mobile number',
      progress: 0,
      url: '/lead/reference-details',
      lock: true,
      Icon: ReferenceDetailsIcon,
    },
    {
      title: 'Upload Documents',
      description: 'Aadhar, PAN, Property document',
      progress: 0,
      url: '/lead/upload-documents',
      lock: true,
      Icon: UploadIcon,
    },
    {
      title: 'Preview',
      description: '',
      url: '/lead/upload-documents',
      hideProgress: true,
      Icon: PreviewIcon,
    },
  ]);

  const updateProgress = (updateIndex, requiredFieldsStatus) => {
    let trueCount = 0;

    for (const field in requiredFieldsStatus) {
      if (requiredFieldsStatus[field] === true) {
        trueCount++;
      }
    }

    // console.log(trueCount, Object.keys(requiredFieldsStatus).length);

    setStepProgress((prevStepsProgress) => {
      const newData = prevStepsProgress.map((step, index) => {
        if (index === updateIndex && step.progress !== 100) {
          return {
            ...step,
            progress:
              (parseInt(trueCount) / parseInt(Object.keys(requiredFieldsStatus).length)) * 100,
          };
        }
        return step;
      });
      return newData;
    });
  };

  const navigate = useNavigate();

  const addApplicant = () => {
    formik.setValues((prev) => {
      let newData = { ...prev };
      newData.applicants.push({
        applicant_details: {
          lead_id: null,
          is_primary: false,
          first_name: '',
          middle_name: '',
          last_name: '',
          date_of_birth: null,
          mobile_number: '',
          is_mobile_verified: false,
        },
        personal_details: {
          how_would_you_like_to_proceed: null,
          id_type: null,
          id_number: '',
          selected_address_proof: null,
          address_proof_number: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          gender: null,
          date_of_birth: null,
          mobile_number: '',
          father_husband_name: '',
          mother_name: '',
          marital_status: null,
          religion: '',
          preferred_language: '',
          qualification: '',
          email: '',
          is_email_verified: false,
          extra_params: {
            same_as_id_type: false,
          },
        },
      });

      return newData;
    });

    setActiveIndex(formik.values.applicants.length - 1);

    navigate('/lead/applicant-details');

    setDrawerOpen(false);
  };

  const formik = useFormik({
    initialValues: { ...defaultValuesLead },
    initialErrors: {
      ...defaultErrorsLead,
    },
    validationSchema: validationSchemaLead,
    onSubmit: (_, action) => {
      console.log(action);
      action.resetForm(defaultValues);
    },
  });

  // console.log(formik.values);

  return (
    <LeadContext.Provider
      value={{
        ...formik,
        stepsProgress,
        updateProgress,
        addApplicant,
        currentStepIndex,
        setCurrentStepIndex,
        drawerOpen,
        setDrawerOpen,
        toastMessage,
        setToastMessage,
        activeIndex,
        setActiveIndex,
        isExisting,
        setIsExisting,
        existingData,
        setExistingData,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export default LeadContextProvider;

LeadContextProvider.propTypes = {
  children: PropTypes.element,
};
