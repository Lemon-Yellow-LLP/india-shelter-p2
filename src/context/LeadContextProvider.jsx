import { createContext, useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { validationSchemaLead } from '../schemas/index';
import { defaultErrorsLead } from './defaultErrorsLead';
import { defaultValuesLead } from './defaultValuesLead';
import { useLocation, useNavigate } from 'react-router-dom';
import { applicantSteps, coApplicantSteps } from './Steps';
import {
  checkIsValidStatePincode,
  editAddressById,
  editFieldsById,
  getApplicantById,
} from '../global';
import { newCoApplicantValues } from './NewCoApplicant';
import { AuthContext } from './AuthContextProvider';

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
  const [drawerTabIndex, setDrawerTabIndex] = useState(0);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [activeCoApplicantIndex, setActiveCoApplicantIndex] = useState(0);
  const [coApplicants, setCoApplicants] = useState([]);
  const [pincodeErr, setPincodeErr] = useState({});
  const [propertyValueEstimateError, setPropertyValueEstimateError] = useState('');
  const [salesforceID, setSalesforceID] = useState(null);
  const [showMap, setShowMap] = useState(false);

  //p3 states
  const [idDisableFields, setIdDisableFields] = useState(true);
  const [addressDisableFields, setAddressDisableFields] = useState(true);

  //ocr states
  const [enableOCRIdType, setEnableOCRIdType] = useState(false);
  const [enableOCRAddressProof, setEnableOCRAddressProof] = useState(false);

  const [enableVerifyOCRIdType, setEnableVerifyOCRIdType] = useState(false);
  const [enableVerifyOCRAddressProof, setEnableVerifyOCRAddressProof] = useState(false);

  const [idTypeOCRCount, setIdTypeOCRCount] = useState(0);
  const [addressProofOCRCount, setAddressProofOCRCount] = useState(0);

  const [idTypeOCRStatus, setIdTypeOCRStatus] = useState(false);
  const [addressProofOCRStatus, setAddressProofOCRStatus] = useState(false);

  const [idTypeOCRText, setIdTypeOCRText] = useState('Capture front image');
  const [addressTypeOCRText, setAddressTypeOCRText] = useState('Capture front image');

  const [idTypeClickedPhotoText, setIdTypeClickedPhotoText] = useState('');
  const [addressTypeClickedPhotoText, setAddressTypeClickedPhotoText] = useState('');

  const [idTypeOCRImages, setIdTypeOCRImages] = useState([]);
  const [addressTypeOCRImages, setAddressTypeOCRImages] = useState([]);

  // ekyc fields
  const [disableEkycGlobally, setDisableEkycGlobally] = useState(true);
  const [enableEkycIdtype, setEnableEkycIdtype] = useState(false);
  const [ekycIDStatus, setEkycIDStatus] = useState(false);
  const [enableEKYCAddressProof, setEnableEKYCAddressProof] = useState(false);
  const [ekycAddressStatus, setEkycAddressStatus] = useState(false);

  const { token } = useContext(AuthContext);

  const location = useLocation();

  const formik = useFormik({
    initialValues: structuredClone(defaultValuesLead),
    initialErrors: structuredClone(defaultErrorsLead),
    validationSchema: validationSchemaLead,
    onSubmit: (_, action) => {
      // console.log(action);
      // action.resetForm(defaultValues);
    },
  });

  const [addressRequiredFieldsStatus, setAddressRequiredFieldsStatus] = useState({
    ...formik?.values?.applicants?.[activeIndex]?.address_detail?.extra_params
      ?.required_fields_status,
  });

  // Function to recursively count keys and calculate the sum of values
  const countKeysAndValues = (obj, result = { totalKeys: 0, valuesSum: 0 }) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        countKeysAndValues(obj[key], result);
      } else {
        result.totalKeys += 1;
        result.valuesSum += obj[key];
      }
    }

    return result;
  };

  const updateCompleteFormProgress = async () => {
    if (formik?.values) {
      let newData = structuredClone(formik.values);

      const getProgress = (obj) => obj?.extra_params?.progress;

      // Map over the keys of formData and get progress for each key
      let progressMap = {};
      let progressMapTemp = {};
      const kv = Object.keys(newData);
      for (const key of kv) {
        if (key === 'lead' || key === 'lnt_mobile_number') {
          continue;
        }
        let newDataKeyprogress = getProgress(newData[key]);
        progressMap[key] = newDataKeyprogress ? newDataKeyprogress : 0;
      }

      progressMap.applicants = [];
      progressMapTemp = structuredClone(progressMap);
      progressMapTemp.applicants = [];

      newData?.applicants?.map((applicant, index) => {
        progressMap.applicants[index] = {};
        progressMapTemp.applicants[index] = {};
        Object.keys(applicant).forEach((key) => {
          if (key === 'banking_details') {
            if (applicant?.applicant_details?.is_primary) {
              progressMap.applicants[index][key] = applicant?.applicant_details?.extra_params
                ?.banking_progress
                ? 100
                : 0;
            }
          } else {
            let newDataKeyprogress = getProgress(applicant[key]);
            progressMap.applicants[index][key] = newDataKeyprogress ? newDataKeyprogress : 0;
          }
        });
        progressMap.applicants[index].upload_progress = applicant?.applicant_details?.extra_params
          ?.upload_progress
          ? applicant?.applicant_details?.extra_params?.upload_progress
          : 0;

        progressMap.applicants[index].qualifier = applicant?.applicant_details?.extra_params
          ?.qualifier
          ? 100
          : 0;

        progressMapTemp.applicants[index] = structuredClone(progressMap.applicants[index]);

        if (applicant?.applicant_details?.is_primary) {
          progressMap.applicants[index].eligibility = applicant?.applicant_details?.extra_params
            ?.eligibility
            ? 100
            : 0;
        }
      });
      progressMap.lt_charges = newData?.lt_charges?.find((e) => e.status === 'Completed') ? 100 : 0;

      progressMapTemp.lt_charges = structuredClone(progressMap.lt_charges);
      // console.log(progressMap);

      const { totalKeys, valuesSum } = countKeysAndValues(progressMap);
      const resValues = countKeysAndValues(progressMapTemp);

      let finalProgress = parseInt(parseInt(valuesSum) / parseInt(totalKeys));

      // console.log(finalProgress);

      let tempFinalProgress = parseInt(
        parseInt(resValues.valuesSum) / parseInt(resValues.totalKeys),
      );

      formik.setFieldValue('lead.extra_params.progress', finalProgress);
      formik.setFieldValue('lead.extra_params.progress_without_eligibility', tempFinalProgress);

      if (formik?.values?.lead?.id) {
        await editFieldsById(
          formik?.values?.lead?.id,
          'lead',
          {
            extra_params: {
              progress: finalProgress,
              progress_without_eligibility: tempFinalProgress,
            },
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }
    }
  };

  const updateProgressApplicantSteps = async (updateStep, requiredFieldsStatus, page) => {
    if (!requiredFieldsStatus || !updateStep) {
      return;
    }

    let trueCount = 0;

    for (const field in requiredFieldsStatus) {
      if (requiredFieldsStatus[field] === true) {
        trueCount++;
      }
    }

    let finalProgress = parseInt(
      (parseInt(trueCount) / parseInt(Object.keys(requiredFieldsStatus).length)) * 100,
    );

    let newData = structuredClone(formik.values);

    if (page === 'reference' || page === 'property') {
      if (newData?.[updateStep] && typeof newData[updateStep]?.extra_params === 'object') {
        newData[updateStep].extra_params.progress = finalProgress;
        newData[updateStep].extra_params.required_fields_status = requiredFieldsStatus;
        await editFieldsById(
          formik.values[updateStep].id,
          page,
          {
            extra_params: newData[updateStep].extra_params,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
        formik.setFieldValue(`${updateStep}.extra_params`, newData[updateStep].extra_params);
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
          {
            extra_params: newData.applicants[activeIndex][updateStep].extra_params,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );

        formik.setFieldValue(
          `applicants[${activeIndex}].${updateStep}.extra_params`,
          newData.applicants[activeIndex][updateStep].extra_params,
        );
      }
    }

    // formik.setValues(newData);

    updateCompleteFormProgress();
  };

  const updateProgressUploadDocumentSteps = async (requiredFieldsStatus) => {
    if (!requiredFieldsStatus) {
      return;
    }

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
      formik.values?.applicants?.[activeIndex]?.applicant_details?.id,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const old_extra_params = applicant.extra_params;
    const required_fields = applicant.extra_params.upload_required_fields_status;
    const updated_required_fields = { ...requiredFieldsStatus };

    // const updated_required_fields_status = {
    //   upload_required_fields_status: updated_required_fields,
    // };

    const updated_extra_params = {
      ...old_extra_params,
      upload_required_fields_status: updated_required_fields,
      upload_progress: finalProgress,
    };

    await editFieldsById(
      formik.values.applicants[activeIndex].applicant_details.id,
      'applicant',
      {
        extra_params: updated_extra_params,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    formik.setFieldValue(
      `applicants[${activeIndex}].applicant_details.extra_params`,
      updated_extra_params,
    );

    updateCompleteFormProgress();
  };

  const addApplicant = () => {
    let newData = structuredClone(formik?.values?.applicants);
    newData.push(structuredClone(newCoApplicantValues));

    formik.setFieldValue('applicants', newData, updateCompleteFormProgress());

    formik.setFieldTouched(`applicants[${newData.length - 1}]`, null);

    setActiveIndex(newData.length - 1);

    setActiveCoApplicantIndex(newData.length - 1);

    navigate('/lead/applicant-details');

    setDrawerOpen(false);
  };

  const removeCoApplicant = (applicantIndex) => {
    let newData = structuredClone(formik?.values?.applicants);
    newData.splice(applicantIndex, 1);

    formik.setFieldValue('applicants', newData, updateCompleteFormProgress());

    setActiveIndex(0);

    navigate('/lead/applicant-details');

    setDrawerOpen(false);
  };

  const coApplicantDrawerUpdate = (applicants) => {
    let newData = [];

    let newPrimaryIndex = primaryIndex;

    applicants?.map((e, index) => {
      if (!e.applicant_details.is_primary) {
        newData.push({
          label:
            e.applicant_details.first_name ||
            e.applicant_details.mobile_number ||
            'New Co-Applicant',
          value: index,
        });
      } else if (e.applicant_details.is_primary) {
        newData.push({
          label: 'Primary',
          value: index,
        });
        newPrimaryIndex = index;
        setPrimaryIndex(index);
      }
    });
    setCoApplicants(newData);

    if (
      activeCoApplicantIndex === newPrimaryIndex ||
      activeCoApplicantIndex !== applicants?.length - 1
    ) {
      const newIndex = newData?.findIndex((obj) => obj.label !== 'Primary');
      setActiveCoApplicantIndex(newIndex);
    }
  };

  useEffect(() => {
    if (!location.pathname.includes('dashboard')) {
      setAddressRequiredFieldsStatus({
        ...formik?.values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.required_fields_status,
      });

      let newApplicants = structuredClone(formik.values);

      const updatedValues = newApplicants.applicants.filter(
        (e, index) => index === activeIndex || e.applicant_details.is_mobile_verified,
      );

      //Reset id type ocr states
      setIdTypeOCRImages([]);
      setIdTypeClickedPhotoText('');
      setIdTypeOCRText('Capture front image');
      setEnableVerifyOCRIdType(false);

      //Reset address type ocr states
      setAddressTypeOCRImages([]);
      setAddressTypeClickedPhotoText('');
      setAddressTypeOCRText('Capture front image');
      setEnableVerifyOCRAddressProof(false);

      formik.setFieldValue('applicants', updatedValues, updateCompleteFormProgress());
    }
  }, [activeIndex, location.pathname]);

  useEffect(() => {
    if (!!formik.values?.applicants[activeIndex]?.applicant_details?.id_type_ocr_count) {
      let ocrData = formik.values?.applicants[activeIndex]?.applicant_details.id_type_ocr_count;

      let ocrCount = 0;
      for (let i in ocrData) {
        ocrCount = ocrCount + ocrData[i];
      }
      setIdTypeOCRCount(ocrCount);
    } else {
      setIdTypeOCRCount(0);
    }

    if (formik.values?.applicants[activeIndex]?.applicant_details?.id_type_ocr_status) {
      setIdTypeOCRStatus(true);
    } else {
      setIdTypeOCRStatus(false);
    }

    if (
      formik.values?.applicants[activeIndex]?.personal_details?.id_type &&
      formik.values?.applicants[activeIndex]?.personal_details?.id_type !== 'AADHAR' &&
      !formik.values?.applicants[activeIndex]?.applicant_details?.id_type_ocr_status
    ) {
      setEnableOCRIdType(true);
    } else {
      setEnableOCRIdType(false);
    }

    if (
      !!formik.values?.applicants[activeIndex]?.applicant_details?.selected_address_proof_ocr_count
    ) {
      let ocrData =
        formik.values?.applicants[activeIndex]?.applicant_details.selected_address_proof_ocr_count;

      let ocrCount = 0;
      for (let i in ocrData) {
        ocrCount = ocrCount + ocrData[i];
      }
      setAddressProofOCRCount(ocrCount);
    } else {
      setAddressProofOCRCount(0);
    }

    if (formik.values?.applicants[activeIndex]?.applicant_details?.selected_address_ocr_status) {
      setAddressProofOCRStatus(true);
    } else {
      if (
        !formik.values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type
      ) {
        setAddressProofOCRStatus(false);
      }
    }

    if (
      formik.values?.applicants[activeIndex]?.personal_details?.selected_address_proof &&
      formik.values?.applicants[activeIndex]?.personal_details?.selected_address_proof !==
        'AADHAR' &&
      !formik.values?.applicants[activeIndex]?.applicant_details?.selected_address_ocr_status &&
      !formik.values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type
    ) {
      setEnableOCRAddressProof(true);
    } else {
      setEnableOCRAddressProof(false);
    }

    // did user left on id_type being aadhar
    if (formik?.values?.applicants?.[activeIndex]?.personal_details?.id_type === 'AADHAR') {
      // did user perfomed ekyc atleast once irrespective of success or fail
      if (
        formik?.values?.applicants[activeIndex]?.applicant_details?.extra_params
          .is_ekyc_performed_id
      ) {
        if (formik?.values?.applicants[activeIndex]?.applicant_details?.is_ekyc_verified) {
          setEnableEkycIdtype(false);
          setEkycIDStatus(true);
        } else {
          // unsuccessful Ekyc
          setEnableEkycIdtype(true);
          setEkycIDStatus(false);
        }
      } else {
        // ekyc didn't perfomed
        setEnableEkycIdtype(true);
        setEkycIDStatus(false);
      }
    } else {
      setEnableEkycIdtype(false);
      setEkycIDStatus(false);
    }

    // did user left on selected_address_proof being aadhar
    if (
      formik?.values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof ===
      'AADHAR'
    ) {
      // did user perfomed ekyc atleast once irrespective of success or fail
      if (
        formik?.values?.applicants[activeIndex]?.applicant_details?.extra_params
          .is_ekyc_performed_address
      ) {
        // successful Ekyc (default is_ekyc_verified=false)
        if (formik?.values?.applicants[activeIndex]?.applicant_details?.is_ekyc_verified) {
          setEnableEKYCAddressProof(false);
          setEkycAddressStatus(true);
        } else {
          // unsuccessful Ekyc
          if (
            formik?.values?.applicants[activeIndex]?.personal_details?.extra_params?.same_as_id_type
          ) {
            setEnableEKYCAddressProof(false);
          } else {
            setEnableEKYCAddressProof(true);
          }
          setEkycAddressStatus(false);
        }
      } else {
        // ekyc didn't perfomed
        if (
          !formik.values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type
        ) {
          setEnableEKYCAddressProof(true);
          setEkycAddressStatus(false);
        }
      }
    } else {
      setEnableEKYCAddressProof(false);
      setEkycAddressStatus(false);
    }

    if (formik?.values?.applicants?.length !== coApplicants?.length) {
      coApplicantDrawerUpdate(formik?.values?.applicants);
    }
  }, [formik?.values?.applicants]);

  const handleCurrentPincodeChange = async (value) => {
    if (!value || value.toString().length < 5) {
      formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, '');
      formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, '');

      editAddressById(
        formik?.values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          current_pincode: '',
          current_city: '',
          current_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (
        formik?.values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current
      ) {
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, '');
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');

        editAddressById(
          formik?.values?.applicants?.[activeIndex]?.address_detail?.id,
          {
            additional_pincode: '',
            additional_city: '',
            additional_state: '',
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }

      return;
    }

    const res = await checkIsValidStatePincode(value, {
      headers: {
        Authorization: token,
      },
    });
    if (!res) {
      formik.setFieldError(
        `applicants[${activeIndex}].address_detail.current_pincode`,
        'Invalid Pincode',
      );
      formik.setFieldTouched(`applicants[${activeIndex}].address_detail.current_pincode`);
      setPincodeErr((prev) => ({ ...prev, [`address_current_${activeIndex}`]: 'Invalid Pincode' }));

      formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, '');
      formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, '');

      editAddressById(
        formik?.values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          current_pincode: '',
          current_city: '',
          current_state: '',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (
        formik?.values?.applicants?.[activeIndex]?.address_detail?.extra_params
          ?.additional_address_same_as_current
      ) {
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, '');
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, '');
        formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, '');
      }

      return;
    }

    editAddressById(
      formik.values?.applicants?.[activeIndex]?.address_detail?.id,
      {
        current_pincode: value,
        current_city: res.city,
        current_state: res.state,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_city`, res.city);
    formik.setFieldValue(`applicants[${activeIndex}].address_detail.current_state`, res.state);
    setPincodeErr((prev) => ({ ...prev, [`address_current_${activeIndex}`]: '' }));

    if (
      formik.values?.applicants?.[activeIndex]?.address_detail?.extra_params
        ?.additional_address_same_as_current
    ) {
      editAddressById(
        formik.values?.applicants?.[activeIndex]?.address_detail?.id,
        {
          additional_pincode: value,
          additional_city: res.city,
          additional_state: res.state,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_pincode`, value);
      formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_city`, res.city);
      formik.setFieldValue(`applicants[${activeIndex}].address_detail.additional_state`, res.state);

      setPincodeErr((prev) => ({ ...prev, [`address_additional_${activeIndex}`]: '' }));
    }
  };

  useEffect(() => {
    if (idTypeOCRStatus || addressProofOCRStatus || ekycIDStatus || ekycAddressStatus) {
      const updateCompleteProgress = async () => {
        Promise.all([
          await updateProgressApplicantSteps(
            'applicant_details',
            formik?.values?.applicants[activeIndex]?.applicant_details?.extra_params
              ?.required_fields_status,
            'applicant',
          ),
          await updateProgressApplicantSteps(
            'personal_details',
            formik?.values?.applicants[activeIndex]?.personal_details?.extra_params
              ?.required_fields_status,
            'personal',
          ),
          await updateProgressApplicantSteps(
            'address_detail',
            formik?.values?.applicants[activeIndex]?.address_detail?.extra_params
              ?.required_fields_status,
            'address',
          ),
          await updateProgressUploadDocumentSteps(
            formik?.values?.applicants[activeIndex]?.applicant_details?.extra_params
              ?.upload_required_fields_status,
          ),
        ])
          .then(() => {
            if (idTypeOCRStatus || addressProofOCRStatus) {
              handleCurrentPincodeChange(
                formik?.values?.applicants?.[activeIndex]?.address_detail?.current_pincode,
              );
            }
          })
          .catch((err) => console.log('UPDATE_PROGRESS_ERR', err));
      };
      updateCompleteProgress();
    } else {
      console.log('OCR/EKYC FAILED');
    }
  }, [
    formik?.values?.applicants[activeIndex]?.applicant_details?.id_type_ocr_status,
    formik?.values?.applicants[activeIndex]?.applicant_details?.selected_address_ocr_status,
    formik?.values?.applicants[activeIndex]?.applicant_details?.is_ekyc_verified,
  ]);

  useEffect(() => {
    console.log('Lead Context Values', formik.values);
  }, [formik.values]);

  return (
    <LeadContext.Provider
      value={{
        ...formik,
        updateCompleteFormProgress,
        removeCoApplicant,
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
        drawerTabIndex,
        setDrawerTabIndex,
        primaryIndex,
        setPrimaryIndex,
        activeCoApplicantIndex,
        setActiveCoApplicantIndex,
        coApplicants,
        setCoApplicants,
        pincodeErr,
        setPincodeErr,
        propertyValueEstimateError,
        setPropertyValueEstimateError,
        salesforceID,
        setSalesforceID,
        coApplicantDrawerUpdate,
        showMap,
        setShowMap,
        idDisableFields,
        setIdDisableFields,
        addressDisableFields,
        setAddressDisableFields,
        enableOCRIdType,
        setEnableOCRIdType,
        enableOCRAddressProof,
        setEnableOCRAddressProof,
        enableVerifyOCRIdType,
        setEnableVerifyOCRIdType,
        enableVerifyOCRAddressProof,
        setEnableVerifyOCRAddressProof,
        idTypeOCRCount,
        setIdTypeOCRCount,
        addressProofOCRCount,
        setAddressProofOCRCount,
        idTypeOCRStatus,
        setIdTypeOCRStatus,
        addressProofOCRStatus,
        setAddressProofOCRStatus,
        idTypeOCRText,
        setIdTypeOCRText,
        addressTypeOCRText,
        setAddressTypeOCRText,
        idTypeClickedPhotoText,
        setIdTypeClickedPhotoText,
        addressTypeClickedPhotoText,
        setAddressTypeClickedPhotoText,
        idTypeOCRImages,
        setIdTypeOCRImages,
        addressTypeOCRImages,
        setAddressTypeOCRImages,
        enableEkycIdtype,
        setEnableEkycIdtype,
        ekycIDStatus,
        setEkycIDStatus,
        enableEKYCAddressProof,
        setEnableEKYCAddressProof,
        ekycAddressStatus,
        setEkycAddressStatus,
        disableEkycGlobally,
        addressRequiredFieldsStatus,
        setAddressRequiredFieldsStatus,
        handleCurrentPincodeChange,
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
