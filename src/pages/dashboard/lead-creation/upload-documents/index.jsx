import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import ImageUpload from '../../../../components/ImageUpload';
import PdfAndImageUpload from '../../../../components/PdfAndImageUpload';
import PhotoUpload from '../../../../components/PhotoUpload';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { manualModeDropdownOptions } from '../personal-details/manualModeDropdownOptions';
import { DropDown, ToastMessage, UploadDocsInput } from '../../../../components';
import { AuthContext } from '../../../../context/AuthContextProvider';
import OtpInputNoEdit from '../../../../components/OtpInput/OtpInputNoEdit';
import {
  editFieldsById,
  getApplicantById,
  getUploadOtp,
  reUploadDoc,
  uploadDoc,
  verifyUploadOtp,
} from '../../../../global';

const isQaulifierActivated = false;

const UploadDocuments = () => {
  const { activeIndex, values, errors, touched, handleBlur, setFieldValue, setFieldError } =
    useContext(LeadContext);
  const { toastMessage, setToastMessage } = useContext(AuthContext);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);
  // isQaulifierActivated

  const [customerPhotos, setCustomerPhotos] = useState([]);
  const [customerPhotosFile, setCustomerPhotosFile] = useState(null);
  const [customerUploads, setCustomerUploads] = useState(null);

  const [idProofPhotos, setIdProofPhotos] = useState([]);
  const [idProofPhotosFile, setIdProofPhotosFile] = useState(null);
  const [idProofUploads, setIdProofUploads] = useState(null);
  const [editIdProof, setEditIdProof] = useState({
    file: {},
    id: null,
  });

  const [addressProofPhotos, setAddressProofPhotos] = useState([]);
  const [addressProofPhotosFile, setAddressProofPhotosFile] = useState(null);
  const [addressProofUploads, setAddressProofUploads] = useState(null);
  const [editAddressProof, setEditAddressProof] = useState({
    file: {},
    id: null,
  });

  const [propertyPapers, setPropertyPapers] = useState([]);
  const [propertyPapersFile, setPropertyPapersFile] = useState(null);
  const [propertyPaperUploads, setPropertyPaperUploads] = useState(null);
  const [propertyPdf, setPropertyPdf] = useState(null);
  const [editPropertyPaper, setEditPropertyPaper] = useState({
    file: {},
    id: null,
  });

  const [salarySlipPhotos, setSalarySlipPhotos] = useState([]);
  const [salarySlipPhotosFile, setSalarySlipPhotosFile] = useState(null);
  const [salarySlipUploads, setSalarySlipUploads] = useState(null);
  const [editSalarySlip, setEditSalarySlip] = useState({
    file: {},
    id: null,
  });

  const [form60photos, setForm60photos] = useState([]);
  const [form60photosFile, setForm60photosFile] = useState(null);
  const [form60Uploads, setForm60Uploads] = useState(null);
  const [editForm60, setEditForm60] = useState({
    file: {},
    id: null,
  });

  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [propertyPhotosFile, setPropertyPhotosFile] = useState(null);
  const [propertyUploads, setPropertyUploads] = useState(null);
  const [editProperty, setEditProperty] = useState({
    file: {},
    id: null,
  });

  const [selfie, setSelfie] = useState([]);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfieUploads, setSelfieUploads] = useState(null);

  const [docs, setDocs] = useState([]);
  const [docsFile, setDocsFile] = useState(null);
  const [docUploads, setDocUploads] = useState(null);
  const [editDoc, setEditDoc] = useState({
    file: {},
    id: null,
  });

  const [editIdNumber, setEditIdNumber] = useState(false);
  const [editAddressNumber, setEditAddressNumber] = useState(false);
  const [idStatus, setIdSatus] = useState(null);
  const [addressStatus, setAddressSatus] = useState(null);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(values?.is_mobile_verified);
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);

  const idRef = useRef();
  const addressRef = useRef();

  useEffect(() => {
    if (editIdNumber) {
      idRef.current.focus();
    }
  }, [editIdNumber]);

  useEffect(() => {
    if (editAddressNumber) {
      addressRef.current.focus();
    }
  }, [editAddressNumber]);

  // useEffect(() => {
  //   if (isQaulifierActivated) {
  //     const bre_body = isQaulifierActivated.bre_101_res.body;

  //     for (let i in bre_body) {
  //       if (i === values?.applicants?.[activeIndex]?.personal_details?.id_type) {
  //         setIdSatus(bre_body[i]);
  //       }
  //       if (i === values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof) {
  //         setAddressSatus(bre_body[i]);
  //       }
  //     }
  //   }
  // }, [isQaulifierActivated]);

  const changeIdType = useCallback((e) => {
    setFieldValue(`applicants[${activeIndex}].personal_details.id_type`, e);
    setFieldValue(`applicants[${activeIndex}].personal_details.id_number`, '');
    // updateFields('id_type', e);
    // updateFields('id_number', '');
    // if (values?.applicants?.[activeIndex]?.personal_details?.extra_params?.same_as_id_type) {
    //   updateFields('selected_address_proof', e);
    //   updateFields('address_proof_number', '');
    // }
    // if (!requiredFieldsStatus.id_type) {
    //   setRequiredFieldsStatus((prev) => ({ ...prev, id_type: true }));
    // }
  }, []);

  const changeSelectedAddressProof = useCallback((e) => {
    setFieldValue(`applicants[${activeIndex}].personal_details.selected_address_proof`, e);
    setFieldValue(`applicants[${activeIndex}].personal_details.address_proof_number`, '');
    // updateFields('selected_address_proof', e);
    // updateFields('address_proof_number', '');
    // if (!requiredFieldsStatus.selected_address_proof) {
    //   setRequiredFieldsStatus((prev) => ({ ...prev, selected_address_proof: true }));
    // }
  }, []);

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      const pattern = /^[A-Za-z]+$/;
      if (
        pattern.exec(value[value.length - 1]) &&
        e.target.name !== `applicants[${activeIndex}].personal_details.email` &&
        e.target.name !== `applicants[${activeIndex}].personal_details.id_number` &&
        e.target.name !== `applicants[${activeIndex}].personal_details.address_proof_number`
      ) {
        setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (
        e.target.name === `applicants[${activeIndex}].personal_details.id_number` ||
        e.target.name === `applicants[${activeIndex}].personal_details.address_proof_number`
      ) {
        if (
          e.target.name === `applicants[${activeIndex}].personal_details.id_number` &&
          values?.applicants?.[activeIndex]?.personal_details?.id_type === 'AADHAR'
        ) {
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (
            value.length < values?.applicants?.[activeIndex]?.personal_details?.id_number.length
          ) {
            setFieldValue(e.target.name, value);
          }
        } else if (
          e.target.name === `applicants[${activeIndex}].personal_details.address_proof_number` &&
          values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof === 'AADHAR'
        ) {
          let aadharPattern = /^\d$/;
          if (aadharPattern.exec(value[value.length - 1]) && value[0] != '0' && value[0] != '1') {
            const maskedPortion = value.slice(0, 8).replace(/\d/g, '*');
            const maskedAadhar = maskedPortion + value.slice(8);
            setFieldValue(e.target.name, maskedAadhar);
          } else if (
            value.length <
            values?.applicants?.[activeIndex]?.personal_details?.address_proof_number.length
          ) {
            setFieldValue(e.target.name, value);
          }
        } else {
          const pattern2 = /^[A-Za-z0-9]+$/;
          if (pattern2.exec(value[value.length - 1])) {
            setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }
      }
    },
    [values],
  );

  const sendMobileOtp = async () => {
    setHasSentOTPOnce(true);
    setShowOTPInput(true);

    // const res = await getUploadOtp(login_res.session.user_id);
    // if (!res) return;

    const res = await getUploadOtp(1);
    if (!res) return;

    setToastMessage('OTP has been sent to the mobile number');
  };

  const verifyOTP = useCallback(
    async (loginotp) => {
      const otp = parseInt(loginotp);

      try {
        // const res = await verifyUploadOtp(login_res.session.user_id, {
        //   otp,
        // });

        // if (!res) return;

        const res = await verifyUploadOtp(1, otp);

        if (!res) return;

        setDisablePhoneNumber(false);
        setMobileVerified(true);

        // if (res.old_session_message === 'No old sessions') {
        //   setToken(res.token);
        //   setDisablePhoneNumber(false);
        //   setMobileVerified(true);
        //   setFieldError('username', undefined);
        //   setShowOTPInput(false);
        //   setIsAuthenticated(true);
        //   return true;
        // }
        // setIsOpen(true);
        // setToken(res.token);
        // setDisablePhoneNumber(false);
        // setMobileVerified(true);
        // setFieldError('username', undefined);
        // setShowOTPInput(false);
        // setIsOpen(true);
      } catch (err) {
        console.log(err);

        setMobileVerified(false);
        // setOtpFailCount(err.response.data.fail_count);
        // setIsAuthenticated(false);
        return false;
      }
    },
    //values.mobile_number

    [setFieldError, setMobileVerified],
  );

  // console.log(errors?.applicants?.[activeIndex]?.personal_details?.id_number);

  // console.log(isQaulifierActivated);

  // console.log(selfie.length !== 0);

  useEffect(() => {
    async function addPropertyPaperPhotos() {
      const data = new FormData();
      const filename = Date.now() + propertyPapersFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'property_paper_photos');
      data.append('document_name', filename);
      data.append('file', propertyPapersFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('property_paper_photos' in document_meta == false) {
          document_meta['property_paper_photos'] = [];
        }
        document_meta['property_paper_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const pdf = edited_applicant.document_meta.property_paper_photos.find((data) => {
          if (data.document_meta.mimetype === 'application/pdf' && data.active === true) {
            return data;
          }
        });

        if (pdf) {
          setPropertyPdf(pdf);
        } else {
          const active_uploads = edited_applicant.document_meta.property_paper_photos.filter(
            (data) => {
              return data.active === true;
            },
          );

          setPropertyPaperUploads(active_uploads);
        }
      }
    }
    propertyPapers.length > 0 && addPropertyPaperPhotos();
  }, [propertyPapersFile]);

  useEffect(() => {
    async function editPropertyPaperPhotos() {
      const data = new FormData();
      const filename = editPropertyPaper.file.name;
      data.append('document_type', 'property_paper_photos');
      data.append('document_name', filename);
      data.append('file', editPropertyPaper.file);

      const res = await reUploadDoc(editPropertyPaper.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.property_paper_photos.filter((data) => {
        return data.active === true;
      });

      setPropertyPaperUploads({ type: 'property_paper_photos', data: active_uploads });
      setPropertyPapers(active_uploads);
    }
    editPropertyPaper.id && editPropertyPaperPhotos();
  }, [editPropertyPaper]);

  useEffect(() => {
    async function addCustomerPhotos() {
      const data = new FormData();
      const filename = Date.now() + customerPhotosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'customer_photos');
      data.append('document_name', filename);
      data.append('file', customerPhotosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('customer_photos' in document_meta == false) {
          document_meta['customer_photos'] = [];
        }

        document_meta['customer_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_upload = edited_applicant.document_meta.customer_photos.find((data) => {
          return data.active === true;
        });

        setCustomerUploads({ type: 'customer_photos', data: active_upload });
      }
    }
    customerPhotos.length > 0 && addCustomerPhotos();
  }, [customerPhotosFile]);

  useEffect(() => {
    async function addIdProofPhotos() {
      const data = new FormData();
      const filename = Date.now() + idProofPhotosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'id_proof_photos');
      data.append('document_name', filename);
      data.append('file', idProofPhotosFile);

      console.log(idProofPhotosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('id_proof_photos' in document_meta == false) {
          document_meta['id_proof_photos'] = [];
        }

        document_meta['id_proof_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.id_proof_photos.filter((data) => {
          return data.active === true;
        });

        setIdProofUploads({ type: 'id_proof_photos', data: active_uploads });
      }
    }
    idProofPhotos.length > 0 && addIdProofPhotos();
  }, [idProofPhotosFile]);

  useEffect(() => {
    async function editIdProofPhotos() {
      const data = new FormData();
      const filename = editIdProof.file.name;
      data.append('document_type', 'id_proof_photos');
      data.append('document_name', filename);
      data.append('file', editIdProof.file);

      const res = await reUploadDoc(editIdProof.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.id_proof_photos.filter((data) => {
        return data.active === true;
      });

      setIdProofUploads({ type: 'id_proof_photos', data: active_uploads });
    }
    editIdProof.id && editIdProofPhotos();
  }, [editIdProof]);

  useEffect(() => {
    async function addAddressProofPhotos() {
      const data = new FormData();
      const filename = Date.now() + addressProofPhotosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'address_proof_photos');
      data.append('document_name', filename);
      data.append('file', addressProofPhotosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('address_proof_photos' in document_meta == false) {
          document_meta['address_proof_photos'] = [];
        }

        document_meta['address_proof_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.address_proof_photos.filter(
          (data) => {
            return data.active === true;
          },
        );

        setAddressProofUploads({ type: 'address_proof_photos', data: active_uploads });
      }
    }
    addressProofPhotos.length > 0 && addAddressProofPhotos();
  }, [addressProofPhotosFile]);

  useEffect(() => {
    async function editAddressProofPhotos() {
      const data = new FormData();
      const filename = editAddressProof.file.name;
      data.append('document_type', 'address_proof_photos');
      data.append('document_name', filename);
      data.append('file', editAddressProof.file);

      const res = await reUploadDoc(editAddressProof.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.address_proof_photos.filter((data) => {
        return data.active === true;
      });

      setAddressProofUploads({ type: 'address_proof_photos', data: active_uploads });
    }
    editAddressProof.id && editAddressProofPhotos();
  }, [editAddressProof]);

  useEffect(() => {
    async function addSalarySlipPhotos() {
      const data = new FormData();
      const filename = Date.now() + salarySlipPhotosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'salary_slip_photos');
      data.append('document_name', filename);
      data.append('file', salarySlipPhotosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('salary_slip_photos' in document_meta == false) {
          document_meta['salary_slip_photos'] = [];
        }

        document_meta['salary_slip_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.salary_slip_photos.filter((data) => {
          return data.active === true;
        });

        setSalarySlipUploads({ type: 'salary_slip_photos', data: active_uploads });
      }
    }
    salarySlipPhotos.length > 0 && addSalarySlipPhotos();
  }, [salarySlipPhotosFile]);

  useEffect(() => {
    async function editSalarySlipPhotos() {
      const data = new FormData();
      const filename = editSalarySlip.file.name;
      data.append('document_type', 'salary_slip_photos');
      data.append('document_name', filename);
      data.append('file', editSalarySlip.file);

      const res = await reUploadDoc(editSalarySlip.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.salary_slip_photos.filter((data) => {
        return data.active === true;
      });

      setSalarySlipUploads({ type: 'salary_slip_photos', data: active_uploads });
    }
    editSalarySlip.id && editSalarySlipPhotos();
  }, [editSalarySlip]);

  useEffect(() => {
    async function addForm60Photos() {
      const data = new FormData();
      const filename = Date.now() + form60photosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'form_60_photos');
      data.append('document_name', filename);
      data.append('file', form60photosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('form_60_photos' in document_meta == false) {
          document_meta['form_60_photos'] = [];
        }
        document_meta['form_60_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.form_60_photos.filter((data) => {
          return data.active === true;
        });

        setForm60Uploads({ type: 'form_60_photos', data: active_uploads });
      }
    }
    form60photos.length > 0 && addForm60Photos();
  }, [form60photosFile]);

  useEffect(() => {
    async function editForm60Photos() {
      const data = new FormData();
      const filename = editForm60.file.name;
      data.append('document_type', 'form_60_photos');
      data.append('document_name', filename);
      data.append('file', editForm60.file);

      const res = await reUploadDoc(editForm60.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.form_60_photos.filter((data) => {
        return data.active === true;
      });

      setForm60Uploads({ type: 'form_60_photos', data: active_uploads });
    }
    form60photos.id && editForm60Photos();
  }, [form60photos]);

  useEffect(() => {
    async function addPropertyPhotos() {
      const data = new FormData();
      const filename = Date.now() + propertyPhotosFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'property_photos');
      data.append('document_name', filename);
      data.append('file', propertyPhotosFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('property_photos' in document_meta == false) {
          document_meta['property_photos'] = [];
        }
        document_meta['property_photos'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.property_photos.filter((data) => {
          return data.active === true;
        });

        setPropertyUploads({ type: 'property_photos', data: active_uploads });
      }
    }
    propertyPhotos.length > 0 && addPropertyPhotos();
  }, [propertyPhotosFile]);

  useEffect(() => {
    async function editPropertyPhotos() {
      const data = new FormData();
      const filename = editProperty.file.name;
      data.append('document_type', 'property_photos');
      data.append('document_name', filename);
      data.append('file', editProperty.file);

      const res = await reUploadDoc(editProperty.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.property_photos.filter((data) => {
        return data.active === true;
      });

      setPropertyUploads({ type: 'property_photos', data: active_uploads });
    }
    editProperty.id && editPropertyPhotos();
  }, [editProperty]);

  useEffect(() => {
    async function addSelfiePhoto() {
      const data = new FormData();
      const filename = Date.now() + selfieFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'lo_selfie');
      data.append('document_name', filename);
      data.append('file', selfieFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('lo_selfie' in document_meta == false) {
          document_meta['lo_selfie'] = [];
        }
        document_meta['lo_selfie'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_upload = edited_applicant.document_meta.lo_selfie.find((data) => {
          return data.active === true;
        });

        setSelfieUploads({ type: 'lo_selfie', data: active_upload });
      }
    }
    selfie.length > 0 && addSelfiePhoto();
  }, [selfieFile]);

  useEffect(() => {
    async function addOtherDocPhotos() {
      const data = new FormData();
      const filename = Date.now() + docsFile.name;
      data.append('applicant_id', 1);
      data.append('document_type', 'other_docs');
      data.append('document_name', filename);
      data.append('file', docsFile);

      const res = await uploadDoc(data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res) {
        const applicant = await getApplicantById(1);
        const document_meta = applicant.document_meta;
        if ('other_docs' in document_meta == false) {
          document_meta['other_docs'] = [];
        }
        document_meta['other_docs'].push(res.document);

        const edited_applicant = await editFieldsById(1, 'applicant', {
          document_meta: document_meta,
        });

        const active_uploads = edited_applicant.document_meta.other_docs.filter((data) => {
          return data.active === true;
        });

        setDocUploads({ type: 'other_docs', data: active_uploads });
      }
    }
    docs.length > 0 && addOtherDocPhotos();
  }, [docsFile]);

  useEffect(() => {
    async function editOtherDocPhotos() {
      const data = new FormData();
      const filename = editDoc.file.name;
      data.append('document_type', 'other_docs');
      data.append('document_name', filename);
      data.append('file', editDoc.file);

      const res = await reUploadDoc(editDoc.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res) return;

      const applicant = await getApplicantById(1);

      const active_uploads = applicant.document_meta.other_docs.filter((data) => {
        return data.active === true;
      });

      setDocUploads({ type: 'other_docs', data: active_uploads });
    }
    editDoc.id && editOtherDocPhotos();
  }, [editDoc]);

  useEffect(() => {
    async function getPreviousUploads() {
      const res = await getApplicantById(1);

      if (!res) return;

      if (res.document_meta.customer_photos) {
        const active_upload = res.document_meta.customer_photos.find((data) => {
          return data.active === true;
        });

        if (!active_upload) return;

        setCustomerUploads({ type: 'customer_photos', data: active_upload });
        setCustomerPhotos([1]);
      }

      if (res.document_meta.id_proof_photos) {
        const active_uploads = res.document_meta.id_proof_photos.filter((data) => {
          return data.active === true;
        });

        setIdProofUploads({ type: 'id_proof_photos', data: active_uploads });
        setIdProofPhotos(active_uploads);
      }

      if (res.document_meta.property_paper_photos) {
        const pdf = res.document_meta.property_paper_photos.find((data) => {
          if (data.document_meta.mimetype === 'application/pdf' && data.active === true) {
            return data;
          }
        });

        if (pdf) {
          setPropertyPdf(pdf);
          setPropertyPapers([1]);
        } else {
          const active_uploads = res.document_meta.property_paper_photos.filter((data) => {
            return data.active === true;
          });

          setPropertyPaperUploads({ type: 'property_paper_photos', data: active_uploads });
          setPropertyPapers(active_uploads);
        }
      }

      if (res.document_meta.address_proof_photos) {
        const active_uploads = res.document_meta.address_proof_photos.filter((data) => {
          return data.active === true;
        });

        setAddressProofUploads({ type: 'address_proof_photos', data: active_uploads });
        setAddressProofPhotos(active_uploads);
      }

      if (res.document_meta.salary_slip_photos) {
        const active_uploads = res.document_meta.salary_slip_photos.filter((data) => {
          return data.active === true;
        });

        setSalarySlipUploads({ type: 'salary_slip_photos', data: active_uploads });
        setSalarySlipPhotos(active_uploads);
      }

      if (res.document_meta.form_60_photos) {
        const active_uploads = res.document_meta.form_60_photos.filter((data) => {
          return data.active === true;
        });

        setForm60Uploads({ type: 'form_60_photos', data: active_uploads });
        setForm60photos(active_uploads);
      }

      if (res.document_meta.property_photos) {
        const active_uploads = res.document_meta.property_photos.filter((data) => {
          return data.active === true;
        });

        setPropertyUploads({ type: 'property_photos', data: active_uploads });
        setPropertyPhotos(active_uploads);
      }

      if (res.document_meta.lo_selfie) {
        const active_upload = res.document_meta.lo_selfie.find((data) => {
          return data.active === true;
        });

        if (!active_upload) return;

        setSelfieUploads({ type: 'lo_selfie', data: active_upload });
        setSelfie([1]);
      }

      if (res.document_meta.other_docs) {
        const active_uploads = res.document_meta.other_docs.filter((data) => {
          return data.active === true;
        });

        setDocUploads({ type: 'other_docs', data: active_uploads });
        setDocs(active_uploads);
      }
    }
    getPreviousUploads();
  }, []);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <ToastMessage message={toastMessage} setMessage={setToastMessage} />

      <div className='flex flex-col bg-medium-grey gap-9 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <PhotoUpload
          files={customerPhotos}
          setFile={setCustomerPhotos}
          setSingleFile={setCustomerPhotosFile}
          uploads={customerUploads}
          setUploads={setCustomerUploads}
          label='Customer photo'
          required
        />

        <div className='flex flex-col gap-5'>
          <DropDown
            label='Select ID type'
            name={`applicants[${activeIndex}].personal_details.id_type`}
            required
            options={manualModeDropdownOptions[0].options}
            placeholder='Choose ID type'
            onChange={changeIdType}
            defaultSelected={values?.applicants?.[activeIndex]?.personal_details?.id_type}
            // error={errors.applicants?.[activeIndex]?.personal_details?.id_type}
            touched={
              touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.id_type
            }
            disabled={values?.applicants?.[activeIndex]?.personal_details?.id_type ? true : false}
            disableOption={
              values?.applicants[activeIndex]?.personal_details?.selected_address_proof
            }
            onBlur={(e) => {
              handleBlur(e);
              if (
                values?.applicants[activeIndex]?.personal_details?.extra_params?.same_as_id_type
              ) {
                updateFields(
                  'selected_address_proof',
                  values?.applicants[activeIndex]?.personal_details.id_type,
                );
              }
            }}
          />

          <div>
            <label className='flex gap-0.5 items-center text-primary-black font-medium'>
              ID proof
              <span className='text-primary-red text-sm'>*</span>
            </label>
            <span
              className='mb-1.5 text-light-grey text-xs font-normal'
              dangerouslySetInnerHTML={{
                __html: 'File size should be less than 5MB',
              }}
            />

            {isQaulifierActivated ? (
              <div className='bg-white mt-1 border-x border-y border-stroke rounded-lg px-2 pb-2'>
                <ImageUpload
                  files={idProofPhotos}
                  setFile={setIdProofPhotos}
                  uploads={idProofUploads}
                  setUploads={setIdProofUploads}
                  noBorder={true}
                  setEdit={setEditIdProof}
                />

                <div
                  className={`flex gap-2 justify-between border-x border-y ${
                    editIdNumber ? '' : 'border-stroke'
                  }  p-2 rounded`}
                >
                  <div className='flex gap-2 w-full'>
                    <p className='text-dark-grey text-xs font-normal self-center'>
                      {values?.applicants?.[activeIndex]?.personal_details?.id_type}:
                    </p>
                    <UploadDocsInput
                      name={`applicants[${activeIndex}].personal_details.id_number`}
                      value={values?.applicants?.[activeIndex]?.personal_details?.id_number}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        handleTextInputChange(e);
                      }}
                      error={errors.applicants?.[activeIndex]?.personal_details?.id_number}
                      touched={
                        touched?.applicants &&
                        touched?.applicants?.[activeIndex]?.personal_details?.id_number
                      }
                      ref={idRef}
                      disabled={editIdNumber ? false : true}
                      onBlur={handleBlur}
                      inputClasses='text-xs capitalize h-3'
                    />
                  </div>
                  {!editIdNumber ? (
                    <p className='flex gap-1 items-center'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M2.66797 13.3334H13.3346M9.05873 4.03665C9.05873 4.03665 9.05873 5.00532 10.0274 5.97399C10.9961 6.94265 11.9647 6.94265 11.9647 6.94265M5.22775 11.5486L7.26195 11.258C7.55537 11.2161 7.82729 11.0801 8.03688 10.8705L12.9334 5.97398C13.4684 5.439 13.4684 4.57163 12.9334 4.03665L11.9647 3.06798C11.4298 2.533 10.5624 2.533 10.0274 3.06798L5.13088 7.9645C4.92129 8.17409 4.78533 8.44601 4.74341 8.73944L4.45281 10.7736C4.38824 11.2257 4.7757 11.6131 5.22775 11.5486Z'
                          stroke='#E33439'
                          strokeLinecap='round'
                        />
                      </svg>

                      <span
                        className='text-primary-red text-xs font-normal'
                        onClick={() => setEditIdNumber(!editIdNumber)}
                      >
                        Edit
                      </span>
                    </p>
                  ) : (
                    <span
                      className='text-primary-red text-xs font-normal flex items-center'
                      onClick={() => setEditIdNumber(!editIdNumber)}
                    >
                      Save
                    </span>
                  )}
                </div>

                <div className='flex justify-between mt-1'>
                  <div className='flex items-center gap-1'>
                    {idStatus === 'Valid' ? (
                      <>
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 18 18'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M15 4.5L6.75 12.75L3 9'
                            stroke='#147257'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span className='text-secondary-green leading-5 text-xs font-normal'>
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g clipPath='url(#clip0_3732_51311)'>
                            <path
                              d='M8 5.28003V8.3867'
                              stroke='#E33439'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M8 10.72C8.27614 10.72 8.5 10.4961 8.5 10.22C8.5 9.94383 8.27614 9.71997 8 9.71997C7.72386 9.71997 7.5 9.94383 7.5 10.22C7.5 10.4961 7.72386 10.72 8 10.72Z'
                              fill='#E33439'
                            />
                            <path
                              d='M7.9987 14.1666C11.4045 14.1666 14.1654 11.4057 14.1654 7.99992C14.1654 4.59416 11.4045 1.83325 7.9987 1.83325C4.59294 1.83325 1.83203 4.59416 1.83203 7.99992C1.83203 11.4057 4.59294 14.1666 7.9987 14.1666Z'
                              stroke='#E33439'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_3732_51311'>
                              <rect width='16' height='16' fill='white' />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className='text-primary-red leading-5 text-xs font-normal'>
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>

                  <p className='text-light-grey leading-5 text-xs font-normal'>Photo mandatory</p>
                </div>
              </div>
            ) : (
              <ImageUpload
                files={idProofPhotos}
                setFile={setIdProofPhotos}
                setSingleFile={setIdProofPhotosFile}
                uploads={idProofUploads}
                setUploads={setIdProofUploads}
                setEdit={setEditIdProof}
              />
            )}

            {isQaulifierActivated && (
              <p className='text-xs leading-[18px] font-normal text-light-grey mt-1'>
                To be verified during the eligibility step
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <DropDown
            label='Select address proof'
            name={`applicants[${activeIndex}].personal_details.selected_address_proof`}
            required
            options={manualModeDropdownOptions[1].options}
            placeholder='Choose address proof'
            onChange={changeSelectedAddressProof}
            defaultSelected={
              values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof
            }
            // error={errors.applicants?.[activeIndex]?.personal_details?.selected_address_proof}
            touched={
              touched?.applicants &&
              touched.applicants?.[activeIndex]?.personal_details?.selected_address_proof
            }
            disabled={
              values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof
                ? true
                : false
            }
            disableOption={values?.applicants?.[activeIndex]?.personal_details?.id_type}
            onBlur={(e) => {
              handleBlur(e);
            }}
          />

          <div>
            <label className='flex gap-0.5 items-center text-primary-black font-medium'>
              Address proof
              <span className='text-primary-red text-sm'>*</span>
            </label>
            <span
              className='mb-1.5 text-light-grey text-xs font-normal'
              dangerouslySetInnerHTML={{
                __html: 'File size should be less than 5MB',
              }}
            />

            {isQaulifierActivated ? (
              <div className='bg-white mt-1 border-x border-y border-stroke rounded-lg px-2 pb-2'>
                <ImageUpload
                  files={addressProofPhotos}
                  setFile={setAddressProofPhotos}
                  setSingleFile={setAddressProofPhotosFile}
                  setEdit={setEditAddressProof}
                  uploads={addressProofUploads}
                  setUploads={setAddressProofUploads}
                  noBorder={true}
                />

                <div
                  className={`flex gap-2 justify-between border-x border-y ${
                    editAddressNumber ? '' : 'border-stroke'
                  }  p-2 rounded`}
                >
                  <div className='flex gap-2 w-full'>
                    <p className='text-dark-grey text-xs font-normal self-center'>
                      {values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof}:
                    </p>
                    <UploadDocsInput
                      name={`applicants[${activeIndex}].personal_details.address_proof_number`}
                      value={
                        values?.applicants?.[activeIndex]?.personal_details?.address_proof_number
                      }
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                        handleTextInputChange(e);
                      }}
                      error={
                        errors.applicants?.[activeIndex]?.personal_details?.address_proof_number
                      }
                      touched={
                        touched?.applicants &&
                        touched?.applicants?.[activeIndex]?.personal_details?.address_proof_number
                      }
                      ref={addressRef}
                      disabled={editAddressNumber ? false : true}
                      onBlur={handleBlur}
                      inputClasses='text-xs capitalize h-3'
                    />
                  </div>
                  {!editAddressNumber ? (
                    <p className='flex gap-1 items-center'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M2.66797 13.3334H13.3346M9.05873 4.03665C9.05873 4.03665 9.05873 5.00532 10.0274 5.97399C10.9961 6.94265 11.9647 6.94265 11.9647 6.94265M5.22775 11.5486L7.26195 11.258C7.55537 11.2161 7.82729 11.0801 8.03688 10.8705L12.9334 5.97398C13.4684 5.439 13.4684 4.57163 12.9334 4.03665L11.9647 3.06798C11.4298 2.533 10.5624 2.533 10.0274 3.06798L5.13088 7.9645C4.92129 8.17409 4.78533 8.44601 4.74341 8.73944L4.45281 10.7736C4.38824 11.2257 4.7757 11.6131 5.22775 11.5486Z'
                          stroke='#E33439'
                          strokeLinecap='round'
                        />
                      </svg>

                      <span
                        className='text-primary-red text-xs font-normal'
                        onClick={() => setEditAddressNumber(!editAddressNumber)}
                      >
                        Edit
                      </span>
                    </p>
                  ) : (
                    <span
                      className='text-primary-red text-xs font-normal flex items-center'
                      onClick={() => setEditAddressNumber(!editAddressNumber)}
                    >
                      Save
                    </span>
                  )}
                </div>

                <div className='flex justify-between mt-1'>
                  <div className='flex items-center gap-1'>
                    {addressStatus === 'Valid' ? (
                      <>
                        <svg
                          width='18'
                          height='18'
                          viewBox='0 0 18 18'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M15 4.5L6.75 12.75L3 9'
                            stroke='#147257'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span className='text-secondary-green leading-5 text-xs font-normal'>
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g clipPath='url(#clip0_3732_51311)'>
                            <path
                              d='M8 5.28003V8.3867'
                              stroke='#E33439'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M8 10.72C8.27614 10.72 8.5 10.4961 8.5 10.22C8.5 9.94383 8.27614 9.71997 8 9.71997C7.72386 9.71997 7.5 9.94383 7.5 10.22C7.5 10.4961 7.72386 10.72 8 10.72Z'
                              fill='#E33439'
                            />
                            <path
                              d='M7.9987 14.1666C11.4045 14.1666 14.1654 11.4057 14.1654 7.99992C14.1654 4.59416 11.4045 1.83325 7.9987 1.83325C4.59294 1.83325 1.83203 4.59416 1.83203 7.99992C1.83203 11.4057 4.59294 14.1666 7.9987 14.1666Z'
                              stroke='#E33439'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_3732_51311'>
                              <rect width='16' height='16' fill='white' />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className='text-primary-red leading-5 text-xs font-normal'>
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>

                  <p className='text-light-grey leading-5 text-xs font-normal'>Photo mandatory</p>
                </div>
              </div>
            ) : (
              <ImageUpload
                files={addressProofPhotos}
                setFile={setAddressProofPhotos}
                setSingleFile={setAddressProofPhotosFile}
                setEdit={setEditAddressProof}
                uploads={addressProofUploads}
                setUploads={setAddressProofUploads}
              />
            )}

            {isQaulifierActivated && (
              <p className='text-xs leading-[18px] font-normal text-light-grey mt-1'>
                To be verified during the eligibility step
              </p>
            )}
          </div>
        </div>

        <PdfAndImageUpload
          files={propertyPapers}
          setFile={setPropertyPapers}
          uploads={propertyPaperUploads}
          setUploads={setPropertyPaperUploads}
          setEdit={setEditPropertyPaper}
          pdf={propertyPdf}
          setPdf={setPropertyPdf}
          label='Property papers'
          required
          hint='File size should be less than 5MB'
          setSingleFile={setPropertyPapersFile}
        />

        <ImageUpload
          files={salarySlipPhotos}
          setFile={setSalarySlipPhotos}
          uploads={salarySlipUploads}
          setUploads={setSalarySlipUploads}
          setEdit={setEditSalarySlip}
          label='Salary slip'
          required
          hint='File size should be less than 5MB'
          setSingleFile={setSalarySlipPhotosFile}
        />

        <ImageUpload
          files={form60photos}
          setFile={setForm60photos}
          uploads={form60Uploads}
          setUploads={setForm60Uploads}
          setEdit={setEditForm60}
          label='Form 60'
          required
          hint='File size should be less than 5MB'
          setSingleFile={setForm60photosFile}
        />

        <ImageUpload
          files={propertyPhotos}
          setFile={setPropertyPhotos}
          uploads={propertyUploads}
          setUploads={setPropertyUploads}
          setEdit={setEditProperty}
          label='Property image'
          required
          hint='File size should be less than 5MB'
          setSingleFile={setPropertyPhotosFile}
        />

        <div className='flex justify-between gap-2'>
          <div className='w-[65%]'>
            <PhotoUpload
              files={selfie}
              setFile={setSelfie}
              setSingleFile={setSelfieFile}
              uploads={selfieUploads}
              setUploads={setSelfieUploads}
              label='Upload selfie'
              required
            />
          </div>

          <button
            className={`w-[35%] self-end font-normal h-[57px] py-3 px-2 rounded disabled:text-dark-grey disabled:bg-stroke ${
              mobileVerified || hasSentOTPOnce || selfie.length === 0
                ? 'text-dark-grey bg-stroke pointer-events-none'
                : 'bg-primary-red text-white'
            }`}
            disabled={disablePhoneNumber || mobileVerified}
            onClick={sendMobileOtp}
          >
            Send OTP
          </button>
        </div>

        {showOTPInput && selfie.length >= 1 ? (
          <OtpInputNoEdit
            label='Enter OTP'
            required
            verified={mobileVerified}
            setOTPVerified={setMobileVerified}
            onSendOTPClick={sendMobileOtp}
            defaultResendTime={30}
            disableSendOTP={!mobileVerified}
            verifyOTPCB={verifyOTP}
            hasSentOTPOnce={hasSentOTPOnce}
          />
        ) : null}

        <ImageUpload
          files={docs}
          setFile={setDocs}
          uploads={docUploads}
          setUploads={setDocUploads}
          setEdit={setEditDoc}
          label='Other documents'
          required
          hint='File size should be less than 5MB'
          setSingleFile={setDocsFile}
        />
      </div>
    </div>
  );
};

export default UploadDocuments;
