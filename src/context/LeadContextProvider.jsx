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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExisting, setIsExisting] = useState(true);
  const [existingData, setExistingData] = useState({});

  const [applicantStepsProgress, setApplicantSetpsProgress] = useState([...applicantSteps]);

  const [coApplicantStepsProgress, setCoApplicantSetpsProgress] = useState([...coApplicantSteps]);

  const updateProgress = (updateIndex, requiredFieldsStatus) => {
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
      newData.applicants.push({ ...defaultValuesLead.applicants[0] });

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
        isExisting,
        setIsExisting,
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
