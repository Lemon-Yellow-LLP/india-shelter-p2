import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { signUpSchema } from '../schemas/index';
import PropTypes from 'prop-types';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

export const defaultValues = {
  lead_id: '',
  applicant_id: '',

  lead: {
    loan_type: '',
    purpose_of_loan: '',
    property_type: '',
    applied_amount: '500000',
  },

  applicant_details: {
    lead_id: null,
    is_primary: true,
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    mobile_number: '',
    is_mobile_verified: false,
  },

  personal_details: {
    applicant_type: 'Primary Applicant',
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

  propertySchema: {
    property_identification_is: '',
    property_value_estimate: '',
    owner_name: '',
    plot_house_flat: '',
    project_society_colony: '',
    pincode: '',
    city: '',
    state: '',
    geo_lat: '',
    geo_long: '',
  },

  referenceSchema: {
    reference_1_type: '',
    reference_1_full_name: '',
    reference_1_phone_number: '',
    reference_1_address: '',
    reference_1_pincode: '',
    reference_1_city: '',
    reference_1_state: '',
    reference_1_email: '',
    reference_2_type: '',
    reference_2_full_name: '',
    reference_2_phone_number: '',
    reference_2_address: '',
    reference_2_pincode: '',
    reference_2_city: '',
    reference_2_state: '',
    reference_2_email: '',
  },
  addressSchema: {
    current_type_of_residence: '',
    current_flat_no_building_name: '',
    current_street_area_locality: '',
    current_town: '',
    current_landmark: '',
    current_pincode: '',
    current_city: '',
    current_state: '',
    current_no_of_year_residing: null,
    permanent_type_of_residence: '',
    permanent_flat_no_building_name: '',
    permanent_street_area_locality: '',
    permanent_town: '',
    permanent_landmark: '',
    permanent_pincode: '',
    permanent_city: '',
    permanent_state: '',
    permanent_no_of_year_residing: null,
    extra_params: {
      permanent_address_same_as_current: false,
    },
  },

  work_income_details: {
    profession: '',
    company_name: '',
    total_income: '',
    pf_uan: '',
    no_current_loan: '',
    ongoing_emi: '',
    working_since: '',
    mode_of_salary: '',
    flat_no_building_name: '',
    street_area_locality: '',
    town: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    total_family_number: '',
    total_household_income: '',
    no_of_dependents: '',
    business_name: '',
    industries: '',
    gst_number: '',
    pention_amount: '',
    geo_lat: '',
    geo_long: '',
    extra_params: {
      extra_company_name: '',
      extra_industries: '',
    },
  },

  lnt_charges: {
    mobile_number: '',
  },

  applicants: [
    {
      applicant_details: {
        applicant_id: '',
        is_primary: true,
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: null,
        mobile_number: '',
        is_mobile_verified: false,
      },
      personal_details: {
        applicant_type: 'Primary Applicant',
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
      addressSchema: {
        current_type_of_residence: '',
        current_flat_no_building_name: '',
        current_street_area_locality: '',
        current_town: '',
        current_landmark: '',
        current_pincode: '',
        current_city: '',
        current_state: '',
        current_no_of_year_residing: null,
        permanent_type_of_residence: '',
        permanent_flat_no_building_name: '',
        permanent_street_area_locality: '',
        permanent_town: '',
        permanent_landmark: '',
        permanent_pincode: '',
        permanent_city: '',
        permanent_state: '',
        permanent_no_of_year_residing: null,
        extra_params: {
          permanent_address_same_as_current: false,
        },
      },
      work_income_details: {
        profession: '',
        company_name: '',
        business_name: '',
        industries: '',
        gst_number: '',
        total_income: '',
        pf_uan: '',
        no_current_loan: '',
        ongoing_emi: '',
        working_since: '',
        mode_of_salary: '',
        flat_no_building_name: '',
        street_area_locality: '',
        town: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        total_family_number: '',
        total_household_income: '',
        no_of_dependents: '',
        pention_amount: '',
        geo_lat: '',
        geo_long: '',
        extra_params: {
          extra_company_name: '',
        },
      },
    },
    {
      applicant_details: {
        applicant_id: '',
        is_primary: true,
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: null,
        mobile_number: '',
        is_mobile_verified: false,
      },
      personal_details: {
        applicant_type: 'Primary Applicant',
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
      addressSchema: {
        current_type_of_residence: '',
        current_flat_no_building_name: '',
        current_street_area_locality: '',
        current_town: '',
        current_landmark: '',
        current_pincode: '',
        current_city: '',
        current_state: '',
        current_no_of_year_residing: null,
        permanent_type_of_residence: '',
        permanent_flat_no_building_name: '',
        permanent_street_area_locality: '',
        permanent_town: '',
        permanent_landmark: '',
        permanent_pincode: '',
        permanent_city: '',
        permanent_state: '',
        permanent_no_of_year_residing: null,
        extra_params: {
          permanent_address_same_as_current: false,
        },
      },
      work_income_details: {
        profession: '',
        company_name: '',
        business_name: '',
        industries: '',
        gst_number: '',
        total_income: '',
        pf_uan: '',
        no_current_loan: '',
        ongoing_emi: '',
        working_since: '',
        mode_of_salary: '',
        flat_no_building_name: '',
        street_area_locality: '',
        town: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        total_family_number: '',
        total_household_income: '',
        no_of_dependents: '',
        pention_amount: '',
        geo_lat: '',
        geo_long: '',
        extra_params: {
          extra_company_name: '',
        },
      },
    },
    {
      applicant_details: {
        applicant_id: '',
        is_primary: true,
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: null,
        mobile_number: '',
        is_mobile_verified: false,
      },
      personal_details: {
        applicant_type: 'Primary Applicant',
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
      addressSchema: {
        current_type_of_residence: '',
        current_flat_no_building_name: '',
        current_street_area_locality: '',
        current_town: '',
        current_landmark: '',
        current_pincode: '',
        current_city: '',
        current_state: '',
        current_no_of_year_residing: null,
        permanent_type_of_residence: '',
        permanent_flat_no_building_name: '',
        permanent_street_area_locality: '',
        permanent_town: '',
        permanent_landmark: '',
        permanent_pincode: '',
        permanent_city: '',
        permanent_state: '',
        permanent_no_of_year_residing: null,
        extra_params: {
          permanent_address_same_as_current: false,
        },
      },
      work_income_details: {
        profession: '',
        company_name: '',
        business_name: '',
        industries: '',
        gst_number: '',
        total_income: '',
        pf_uan: '',
        no_current_loan: '',
        ongoing_emi: '',
        working_since: '',
        mode_of_salary: '',
        flat_no_building_name: '',
        street_area_locality: '',
        town: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        total_family_number: '',
        total_household_income: '',
        no_of_dependents: '',
        pention_amount: '',
        geo_lat: '',
        geo_long: '',
        extra_params: {
          extra_company_name: '',
        },
      },
    },
  ],
};

export const LeadContext = createContext(defaultValues);

const LeadContextProvider = ({ children }) => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isLeadGenerated, setIsLeadGenearted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addressProofcheckbox, setAddressProofCheckbox] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
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
      console.log(action);
      action.resetForm(defaultValues);
    },
  });

  return (
    <LeadContext.Provider
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
        inputDisabled,
        setInputDisabled,
        isLeadGenerated,
        setIsLeadGenearted,
        showError,
        setShowError,
        addressProofcheckbox,
        setAddressProofCheckbox,
        toastMessage,
        setToastMessage,
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
