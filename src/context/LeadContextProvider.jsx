import { createContext, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { validationSchemaLead } from '../schemas/index';
import { defaultErrorsLead } from './defaultErrorsLead';
import { defaultValuesLead } from './defaultValuesLead';
import { useNavigate } from 'react-router-dom';
import { applicantSteps, coApplicantSteps } from './Steps';
import { editFieldsById, getApplicantById } from '../global';
import { newCoApplicantValues } from './NewCoApplicant';

export const LeadContext = createContext(defaultValuesLead);

const LeadContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [existingData, setExistingData] = useState({});
  const [applicantStepsProgress, setApplicantSetpsProgress] = useState([...applicantSteps]);
  const [coApplicantStepsProgress, setCoApplicantSetpsProgress] = useState([...coApplicantSteps]);
  const [bankSuccessTost, setBankSuccessTost] = useState('');
  const [bankErrorTost, setBankErrorTost] = useState('');

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

    if (page === 'reference' || page === 'property') {
      if (newData?.[updateStep] && typeof newData[updateStep]?.extra_params === 'object') {
        newData[updateStep].extra_params.progress = finalProgress;
        newData[updateStep].extra_params.required_fields_status = requiredFieldsStatus;
        await editFieldsById(formik.values[updateStep].id, page, newData[updateStep]);
      }
    } else {
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
      }
    }
    formik.setValues(newData);
  };

  const updateProgressUploadDocumentSteps = async (requiredFieldsStatus) => {
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

    newData.applicants[activeIndex].applicant_details.extra_params.upload_progress = finalProgress;
    newData.applicants[activeIndex].applicant_details.extra_params.upload_required_fields_status =
      requiredFieldsStatus;

    // const updated_field_status = { ...}
    //    newData.applicants[activeIndex].applicant_details,

    const applicant = await getApplicantById(
      formik.values?.applicants?.[activeIndex]?.applicant_details.id,
    );

    const old_extra_params = applicant.extra_params;
    const required_fields = applicant.extra_params.upload_required_fields_status;
    const updated_required_fields = { ...required_fields, ...requiredFieldsStatus };

    // const updated_required_fields_status = {
    //   upload_required_fields_status: updated_required_fields,
    // };

    const updated_extra_params = {
      ...old_extra_params,
      upload_required_fields_status: updated_required_fields,
      upload_progress: finalProgress,
    };

    await editFieldsById(formik.values.applicants[activeIndex].applicant_details.id, 'applicant', {
      extra_params: updated_extra_params,
    });

    formik.setValues(newData);
  };

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

  return (
    <LeadContext.Provider
      value={{
        ...formik,
        applicantStepsProgress,
        setApplicantSetpsProgress,
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
        updateProgressUploadDocumentSteps,
        bankSuccessTost,
        setBankSuccessTost,
        bankErrorTost,
        setBankErrorTost,
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
