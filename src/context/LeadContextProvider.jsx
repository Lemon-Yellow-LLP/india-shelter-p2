import { createContext, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { validationSchemaLead } from '../schemas/index';
import { defaultErrorsLead } from './defaultErrorsLead';
import { defaultValuesLead } from './defaultValuesLead';
import { useNavigate } from 'react-router-dom';
import { applicantSteps, coApplicantSteps } from './Steps';

export const LeadContext = createContext(defaultValuesLead);

const LeadContextProvider = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [existingData, setExistingData] = useState({});

  const [applicantStepsProgress, setApplicantSetpsProgress] = useState([...applicantSteps]);

  const [coApplicantStepsProgress, setCoApplicantSetpsProgress] = useState([...coApplicantSteps]);

  const updateProgress = (updateIndex, requiredFieldsStatus, applicantIndex) => {
    let trueCount = 0;

    for (const field in requiredFieldsStatus) {
      if (requiredFieldsStatus[field] === true) {
        trueCount++;
      }
    }

    // console.log(trueCount, Object.keys(requiredFieldsStatus).length);

    setApplicantSetpsProgress((prevApplicantStepsProgress) => {
      const newData = prevApplicantStepsProgress.map((step, index) => {
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
          extra_params: {
            progress: 0,
            is_existing: false,
          },
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
            progress: 0,
          },
        },
        address_detail: {
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
            progress: 0,
          },
        },
        work_income_detail: {
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
            progress: 0,
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
  // console.log(activeIndex);

  return (
    <LeadContext.Provider
      value={{
        ...formik,
        applicantStepsProgress,
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
        existingData,
        setExistingData,
        coApplicantStepsProgress,
        setCoApplicantSetpsProgress,
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
