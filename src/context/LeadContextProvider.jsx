import { createContext, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { validationSchemaLead } from '../schemas/index';
import { defaultErrorsLead } from './defaultErrorsLead';
import { defaultValuesLead } from './defaultValuesLead';
import { useNavigate } from 'react-router-dom';
import { applicantSteps, coApplicantSteps } from './Steps';
import { editFieldsById } from '../global';
import { newCoApplicantValues } from './NewCoApplicant';

export const LeadContext = createContext(defaultValuesLead);

const LeadContextProvider = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [existingData, setExistingData] = useState({});

  const [applicantStepsProgress, setApplicantSetpsProgress] = useState([...applicantSteps]);

  const [coApplicantStepsProgress, setCoApplicantSetpsProgress] = useState([...coApplicantSteps]);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { ...defaultValuesLead },
    initialErrors: {
      ...defaultErrorsLead,
    },
    validationSchema: validationSchemaLead,
    onSubmit: (_, action) => {
      console.log(action);
      // action.resetForm(defaultValues);
    },
  });

  const updateProgress = async (updateStep, requiredFieldsStatus) => {};

  const updateProgressApplicantSteps = async (updateStep, requiredFieldsStatus, page) => {
    let trueCount = 0;

    for (const field in requiredFieldsStatus) {
      if (requiredFieldsStatus[field] === true) {
        trueCount++;
      }
    }

    let finalProgress = parseInt(
      (parseInt(trueCount) / parseInt(Object.keys(requiredFieldsStatus).length)) * 100,
    );

    let newData = formik.values;

    if (
      newData.applicants?.[activeIndex]?.[updateStep]?.extra_params &&
      typeof newData.applicants[activeIndex][updateStep]?.extra_params === 'object'
    ) {
      newData.applicants[activeIndex][updateStep].extra_params.progress = finalProgress;
      newData.applicants[activeIndex][updateStep].extra_params.required_fields_status =
        requiredFieldsStatus;

      await editFieldsById(
        formik.values.applicants[activeIndex][updateStep].id,
        page,
        newData.applicants[activeIndex][updateStep],
      );
    } else {
      console.error('Some properties are missing, cannot update progress');
    }

    formik.setValues(newData);
  };

  // console.log(formik.values.applicants[activeIndex]?.['applicant_details']?.extra_params?.progress);

  console.log(formik.values);

  const addApplicant = () => {
    formik.setValues((prev) => {
      let newData = { ...prev };
      newData.applicants.push({ ...newCoApplicantValues });
      return newData;
    });

    setActiveIndex(formik.values.applicants.length - 1);

    navigate('/lead/applicant-details');

    setDrawerOpen(false);
  };

  // console.log(activeIndex);

  return (
    <LeadContext.Provider
      value={{
        ...formik,
        applicantStepsProgress,
        setApplicantSetpsProgress,
        updateProgress,
        updateProgressApplicantSteps,
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
