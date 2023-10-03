import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import ImageUpload from '../../../../components/ImageUpload';
import PdfAndImageUpload from '../../../../components/PdfAndImageUpload';
import PhotoUpload from '../../../../components/PhotoUpload';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { manualModeDropdownOptions } from '../personal-details/manualModeDropdownOptions';
import { DropDown, UploadDocsInput } from '../../../../components';
import { AuthContext } from '../../../../context/AuthContextProvider';

const isQaulifierActivated = true;

const UploadDocuments = () => {
  const { activeIndex, values, errors, touched, handleBlur, setFieldValue } =
    useContext(LeadContext);
  // const { isQaulifierActivated } = useContext(AuthContext);
  const [customerPhotos, setCustomerPhotos] = useState([]);
  const [idProofPhotos, setIdProofPhotos] = useState([]);
  const [addressProofPhotos, setAddressProofPhotos] = useState([]);
  const [propertyPapers, setPropertyPapers] = useState([]);
  const [salarySlipPhotos, setSalarySlipPhotos] = useState([]);
  const [form60photos, setForm60photos] = useState([]);
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [selfie, setSelfie] = useState([]);
  const [docs, setDocs] = useState([]);
  const [editIdNumber, setEditIdNumber] = useState(false);
  const [editAddressNumber, setEditAddressNumber] = useState(false);
  const [idStatus, setIdSatus] = useState(null);
  const [addressStatus, setAddressSatus] = useState(null);

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

  useEffect(() => {
    console.log(idProofPhotos);

    if (idProofPhotos) {
      const galleryData = new FormData();
      for (let i = 0; i < idProofPhotos.length; i++) {
        galleryData.append('images[]', idProofPhotos[i]);
      }
      console.log(galleryData);
    }
  }, [idProofPhotos]);

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

  console.log(errors?.applicants?.[activeIndex]?.personal_details?.id_number);

  console.log(isQaulifierActivated);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div className='flex flex-col bg-medium-grey gap-9 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <PhotoUpload
          files={customerPhotos}
          setFile={setCustomerPhotos}
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
                <ImageUpload files={idProofPhotos} setFile={setIdProofPhotos} noBorder={true} />

                <div
                  className={`flex justify-between border-x border-y ${
                    editIdNumber ? '' : 'border-stroke'
                  }  p-2 rounded`}
                >
                  <div className='flex gap-1'>
                    <p className='text-dark-grey text-xs font-normal'>
                      {values?.applicants?.[activeIndex]?.personal_details?.id_type} :
                    </p>
                    {/* <input
                      type='text'
                      className='inline w-36 text-xs font-normal'
                      name={`applicants[${activeIndex}].personal_details.id_number`}
                      value={values?.applicants?.[activeIndex]?.personal_details?.id_number}
                      onChange={(e) => {
                        handleTextInputChange(e);
                      }}
                      ref={idRef}
                      disabled={editIdNumber ? false : true}
                    /> */}
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
                    <p className='flex gap-1'>
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
                      className='text-primary-red text-xs font-normal'
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
                          Not isQaulifierActivated
                        </span>
                      </>
                    )}
                  </div>
                  {!isQaulifierActivated && (
                    <p className='text-light-grey leading-5 text-xs font-normal'>Photo mandatory</p>
                  )}
                </div>
              </div>
            ) : (
              <ImageUpload files={idProofPhotos} setFile={setIdProofPhotos} />
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
                  noBorder={true}
                />

                <div
                  className={`flex justify-between border-x border-y ${
                    editAddressNumber ? 'border-secondary-blue' : 'border-stroke'
                  }  p-2 rounded`}
                >
                  <div className='flex gap-1'>
                    <p className='text-dark-grey text-xs font-normal'>
                      {values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof}{' '}
                      :
                    </p>
                    <input
                      type='text'
                      className='inline w-36 text-xs font-normal'
                      name={`applicants[${activeIndex}].personal_details.address_proof_number`}
                      value={
                        values?.applicants?.[activeIndex]?.personal_details?.address_proof_number
                      }
                      onChange={(e) => {
                        handleTextInputChange(e);
                      }}
                      ref={addressRef}
                      disabled={editAddressNumber ? false : true}
                    />
                  </div>
                  {!editAddressNumber ? (
                    <p className='flex gap-1'>
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
                      className='text-primary-red text-xs font-normal'
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
                          Not isQaulifierActivated
                        </span>
                      </>
                    )}
                  </div>
                  {!isQaulifierActivated && (
                    <p className='text-light-grey leading-5 text-xs font-normal'>Photo mandatory</p>
                  )}
                </div>
              </div>
            ) : (
              <ImageUpload files={addressProofPhotos} setFile={setAddressProofPhotos} />
            )}
          </div>
        </div>

        <PdfAndImageUpload
          files={propertyPapers}
          setFile={setPropertyPapers}
          label='Property papers'
          required
          hint='File size should be less than 5MB'
        />

        <ImageUpload
          files={salarySlipPhotos}
          setFile={setSalarySlipPhotos}
          label='Salary slip'
          required
          hint='File size should be less than 5MB'
        />

        <ImageUpload
          files={form60photos}
          setFile={setForm60photos}
          label='Form 60'
          required
          hint='File size should be less than 5MB'
        />

        <ImageUpload
          files={propertyPhotos}
          setFile={setPropertyPhotos}
          label='Property image'
          required
          hint='File size should be less than 5MB'
        />

        <PhotoUpload files={selfie} setFile={setSelfie} label='Upload selfie' required />

        <ImageUpload
          files={docs}
          setFile={setDocs}
          label='Other documents'
          required
          hint='File size should be less than 5MB'
        />
      </div>
    </div>
  );
};

export default UploadDocuments;
