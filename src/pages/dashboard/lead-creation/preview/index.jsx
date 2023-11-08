import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { useContext, useEffect, useState } from 'react';
import ArrowRightIcon2 from '../../../../assets/icons/arrow-right-2';
import { fieldLabels, pages } from '../../../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components';
import StepCompletedIllustration from '../../../../assets/step-completed';
import { Snackbar } from '@mui/material';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';
import PropTypes from 'prop-types';
import { getApplicantById } from '../../../../global';
import { AuthContext } from '../../../../context/AuthContextProvider';
import Popup from '../../../../components/Popup';

const steps = ['', '', '', '', ''];

export default function Preview() {
  const {
    values,
    errors,
    activeIndex,
    setActiveIndex,
    handleSubmit,
    pincodeErr,
    setFieldValue,
    propertyValueEstimateError,
    updateProgressUploadDocumentSteps,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const isCoApplicant = values?.applicants?.[activeIndex]?.applicant_details?.is_primary == false;

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.applicant_details?.extra_params?.upload_required_fields_status,
  });

  useEffect(() => {
    updateProgressUploadDocumentSteps(requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [coApplicantIndex, setCoApplicantIndex] = useState(null);
  const [coApplicantIndexes, setCoApplicantIndexes] = useState([]);
  const [flattedErrors, setFlattedErrors] = useState({});

  const [openQualifierNotActivePopup, setOpenQualifierNotActivePopup] = useState(false);

  const handleCloseQualifierNotActivePopup = () => {
    setOpenQualifierNotActivePopup(false);
  };

  function flattenExtraParams(obj) {
    function flattenExtraParamsHelper(inputObj) {
      if (typeof inputObj === 'object' && inputObj !== null) {
        const newObj = {};
        for (const key in inputObj) {
          if (key === 'extra_params') {
            for (const extraParamKey in inputObj[key]) {
              newObj[extraParamKey] = inputObj[key][extraParamKey];
            }
          } else {
            newObj[key] = flattenExtraParamsHelper(inputObj[key]);
          }
        }
        return newObj;
      } else {
        return inputObj;
      }
    }
    return flattenExtraParamsHelper(obj);
  }

  function checkTotalProgress(applicant) {
    return (
      applicant?.applicant_details?.extra_params?.progress == 100 &&
      applicant?.personal_details?.extra_params?.progress == 100 &&
      applicant?.address_detail?.extra_params?.progress == 100 &&
      applicant?.work_income_detail?.extra_params?.progress == 100 &&
      applicant?.applicant_details?.extra_params?.banking_progress == 100 &&
      applicant?.applicant_details?.extra_params?.upload_progress == 100
    );
  }

  useEffect(() => {
    let _errors = Object.assign({}, errors);
    // console.error(errors);
    errors?.applicants?.map((applicant, idx) => {
      let work_income_detail = {};
      let value = values?.applicants?.[idx]?.work_income_detail?.profession;

      if (value === 'Salaried') {
        work_income_detail = {
          ...(errors?.applicants?.[idx]?.work_income_detail?.company_name && {
            company_name: errors?.applicants?.[idx]?.work_income_detail?.company_name,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.extra_params?.extra_company_name &&
            values?.applicants?.[idx]?.work_income_detail?.company_name == 'Others' && {
              extra_company_name:
                errors?.applicants?.[idx]?.work_income_detail?.extra_params?.extra_company_name,
            }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.total_income && {
            total_income: errors?.applicants?.[idx]?.work_income_detail?.total_income,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.working_since && {
            working_since: errors?.applicants?.[idx]?.work_income_detail?.working_since,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.mode_of_salary && {
            mode_of_salary: errors?.applicants?.[idx]?.work_income_detail?.mode_of_salary,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi &&
            values?.applicants?.[idx]?.work_income_detail?.no_current_loan > 0 && {
              ongoing_emi: errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi,
            }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.flat_no_building_name && {
            flat_no_building_name:
              errors?.applicants?.[idx]?.work_income_detail?.flat_no_building_name,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.street_area_locality && {
            street_area_locality:
              errors?.applicants?.[idx]?.work_income_detail?.street_area_locality,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.town && {
            town: errors?.applicants?.[idx]?.work_income_detail?.town,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.landmark && {
            landmark: errors?.applicants?.[idx]?.work_income_detail?.landmark,
          }),

          ...((errors?.applicants?.[idx]?.work_income_detail?.pincode ||
            pincodeErr?.[`work_income_detail_${idx}`]) && {
            pincode:
              errors?.applicants?.[idx]?.work_income_detail?.pincode ||
              pincodeErr?.[`work_income_detail_${idx}`],
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.total_family_number && {
            total_family_number: errors?.applicants?.[idx]?.work_income_detail?.total_family_number,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.total_household_income && {
            total_household_income:
              errors?.applicants?.[idx]?.work_income_detail?.total_household_income,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents && {
            no_of_dependents: errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents,
          }),
        };
      } else if (value === 'Self-employed') {
        work_income_detail = {
          ...(errors?.applicants?.[idx]?.work_income_detail?.business_name && {
            business_name: errors?.applicants?.[idx]?.work_income_detail?.business_name,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.industries && {
            industries: errors?.applicants?.[idx]?.work_income_detail?.industries,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi &&
            values?.applicants?.[idx]?.work_income_detail?.no_current_loan > 0 && {
              ongoing_emi: errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi,
            }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.flat_no_building_name && {
            flat_no_building_name:
              errors?.applicants?.[idx]?.work_income_detail?.flat_no_building_name,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.street_area_locality && {
            street_area_locality:
              errors?.applicants?.[idx]?.work_income_detail?.street_area_locality,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.town && {
            town: errors?.applicants?.[idx]?.work_income_detail?.town,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.landmark && {
            landmark: errors?.applicants?.[idx]?.work_income_detail?.landmark,
          }),

          ...((errors?.applicants?.[idx]?.work_income_detail?.pincode ||
            pincodeErr?.[`work_income_detail_${idx}`]) && {
            pincode:
              errors?.applicants?.[idx]?.work_income_detail?.pincode ||
              pincodeErr?.[`work_income_detail_${idx}`],
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.total_family_number && {
            total_family_number: errors?.applicants?.[idx]?.work_income_detail?.total_family_number,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.total_household_income && {
            total_household_income:
              errors?.applicants?.[idx]?.work_income_detail?.total_household_income,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents && {
            no_of_dependents: errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents,
          }),
        };
      } else if (value === 'Unemployed') {
        work_income_detail = {
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi &&
            values?.applicants?.[idx]?.work_income_detail?.no_current_loan > 0 && {
              ongoing_emi: errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi,
            }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.total_family_number && {
            total_family_number: errors?.applicants?.[idx]?.work_income_detail?.total_family_number,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.total_household_income && {
            total_household_income:
              errors?.applicants?.[idx]?.work_income_detail?.total_household_income,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents && {
            no_of_dependents: errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents,
          }),
        };
      } else if (value === 'Retired') {
        work_income_detail = {
          ...(errors?.applicants?.[idx]?.work_income_detail?.pention_amount && {
            pention_amount: errors?.applicants?.[idx]?.work_income_detail?.pention_amount,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_current_loan && {
            no_current_loan: errors?.applicants?.[idx]?.work_income_detail?.no_current_loan,
          }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi &&
            values?.applicants?.[idx]?.work_income_detail?.no_current_loan > 0 && {
              ongoing_emi: errors?.applicants?.[idx]?.work_income_detail?.ongoing_emi,
            }),

          ...(errors?.applicants?.[idx]?.work_income_detail?.total_family_number && {
            total_family_number: errors?.applicants?.[idx]?.work_income_detail?.total_family_number,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.total_household_income && {
            total_household_income:
              errors?.applicants?.[idx]?.work_income_detail?.total_household_income,
          }),
          ...(errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents && {
            no_of_dependents: errors?.applicants?.[idx]?.work_income_detail?.no_of_dependents,
          }),
        };
      } else {
        work_income_detail = applicant?.work_income_detail;
      }

      if (_errors?.applicants?.[idx]?.work_income_detail) {
        _errors.applicants[idx].work_income_detail = work_income_detail;
      }

      if (
        _errors?.applicants?.[idx]?.work_income_detail &&
        Object.keys(_errors?.applicants?.[idx]?.work_income_detail)?.length == 0
      ) {
        delete _errors.applicants[idx].work_income_detail;
      }

      if (_errors?.applicants?.[idx] && Object.keys(_errors?.applicants?.[idx])?.length == 0) {
        delete _errors.applicants[idx];
      }

      if (pincodeErr?.[`address_permanent_${idx}`] && _errors.applicants[idx]) {
        _errors.applicants[idx].address_detail = {
          ..._errors?.applicants[idx]?.address_detail,
          permanent_pincode: true,
        };
      }
      if (pincodeErr?.[`address_current_${idx}`] && _errors.applicants[idx]) {
        _errors.applicants[idx].address_detail = {
          ..._errors?.applicants[idx]?.address_detail,
          current_pincode: true,
        };
      }
    });

    if (
      _errors?.property_details &&
      values?.property_details?.property_identification_is == 'not-yet'
    ) {
      _errors.property_details = {};
    } else if (_errors?.property_details && propertyValueEstimateError) {
      _errors.property_details = {
        ..._errors.property_details,
        property_value_estimate: false,
      };
    }

    if (pincodeErr?.property_details) {
      _errors.property_details = {
        ..._errors?.property_details,
        pincode: true,
      };
    }

    if (pincodeErr?.reference_1) {
      _errors.reference_details = {
        ..._errors?.reference_details,
        reference_1_pincode: true,
      };
    }

    if (pincodeErr?.reference_2) {
      _errors.reference_details = {
        ..._errors?.reference_details,
        reference_2_pincode: true,
      };
    }

    setFlattedErrors(flattenExtraParams(_errors));
  }, [errors]);

  useEffect(() => {
    const _primaryIndex = values?.applicants?.findIndex(
      (applicant) => applicant?.applicant_details?.is_primary,
    );

    const _coApplicantIndexes = [];
    for (let i = 0; i < values?.applicants?.length; i++) {
      if (i === _primaryIndex) continue;
      _coApplicantIndexes.push(i);
    }

    setPrimaryIndex(_primaryIndex);
    setCoApplicantIndex(0);
    setCoApplicantIndexes(_coApplicantIndexes);
    setOpenQualifierNotActivePopup(
      !values?.applicants?.[_primaryIndex]?.applicant_details?.extra_params?.qualifier,
    );

    // To show errors
    handleSubmit();
  }, []);

  useEffect(() => {
    setCoApplicantIndex(activeStep ? activeStep - 1 : 0);
    if (activeStep == 0 && primaryIndex != null) {
      setOpenQualifierNotActivePopup(
        !values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.qualifier,
      );
    } else if (activeStep != 0 && coApplicantIndexes[coApplicantIndex] != null) {
      setOpenQualifierNotActivePopup(
        !values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.applicant_details?.extra_params
          ?.qualifier,
      );
    }
  }, [activeStep]);

  useEffect(() => {
    async function getRequiredFields() {
      const { extra_params, document_meta } = await getApplicantById(
        values?.applicants?.[activeIndex]?.applicant_details?.id,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setFieldValue(`applicants.[${activeIndex}].applicant_details.document_meta`, document_meta);
      setRequiredFieldsStatus({
        customer_photo: !!document_meta?.customer_photos?.find((slip) => slip?.active),
        id_proof: !!document_meta?.id_proof_photos?.find((slip) => slip?.active),
        address_proof: !!document_meta?.address_proof_photos?.find((slip) => slip?.active),

        form_60: !!document_meta?.form_60_photos?.find((slip) => slip?.active),

        ...(values?.applicants[activeIndex]?.work_income_detail?.profession === 'Salaried' &&
          !isCoApplicant && {
            salary_slip: !!document_meta?.salary_slip_photos?.find((slip) => slip?.active),
          }),

        ...(values?.property_details?.property_identification_is === 'done' &&
          !isCoApplicant && {
            property_paper: !!document_meta?.property_paper_photos?.find((slip) => slip?.active),
            property_image: !!document_meta?.property_photos?.find((slip) => slip?.active),
          }),

        ...(!isCoApplicant && {
          upload_selfie: !!(
            document_meta?.lo_selfie?.find((slip) => slip?.active) &&
            extra_params?.is_upload_otp_verified
          ),
        }),
      });
    }
    getRequiredFields();
  }, []);

  const previousStep = () => {
    setActiveStep((prev) => {
      if (prev === 0) {
        navigate('/lead/upload-documents');
        return prev;
      }
      return prev - 1;
    });
  };

  const gotoLntCharges = () => navigate('/lead/lnt-charges');

  const nextStep = () => {
    if (activeStep === coApplicantIndexes.length) {
      return;
    }
    setActiveStep((prev) => {
      return prev + 1;
    });
  };

  const CoApplicantDetails = () => {
    return (
      <>
        {checkTotalProgress(values?.applicants?.[coApplicantIndexes[coApplicantIndex]]) ? (
          <StepCompleted />
        ) : (
          <div className='flex-1 flex flex-col gap-4 p-4 pb-[200px] overflow-auto bg-[##F9F9F9]'>
            <div className='flex gap-2'>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 16 16'
                >
                  <g
                    stroke='#96989A'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    clipPath='url(#clip0_3125_37927)'
                  >
                    <path d='M7.999 14.667a6.667 6.667 0 100-13.334 6.667 6.667 0 000 13.334z'></path>
                    <path d='M8 10.667V8'></path>
                    <path d='M8 5.333h.007'></path>
                  </g>
                  <defs>
                    <clipPath id='clip0_3125_37927'>
                      <path fill='#fff' d='M0 0H16V16H0z'></path>
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <p className='text-xs not-italic font-normal text-dark-grey'>
                To get the applicant’s eligible amount, complete the mandatory fields
              </p>
            </div>
            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.progress == 100
              }
              title={pages.applicant_details.title}
              link={pages.applicant_details.url + '?preview=' + pages.applicant_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.applicant_details.name
                      ],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.applicant_details.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.applicant_details.name
                  ],
                ).map((val, i) => (
                  <p key={i} className='text-xs pb-[3px] not-italic font-normal text-primary-black'>
                    {fieldLabels[val] ?? '-'}
                    <span className='text-primary-red text-xs'>*</span>
                  </p>
                ))}
            </PreviewCard>

            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ]?.extra_params?.progress == 100
              }
              title={pages.personal_details.title}
              link={pages.personal_details.url + '?preview=' + pages.personal_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ]?.extra_params?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.personal_details.name
                      ],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.personal_details.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.personal_details.name
                  ],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              title={pages.address_detail.title}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ]?.extra_params?.progress == 100
              }
              link={pages.address_detail.url + '?preview=' + pages.address_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ]?.extra_params?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.address_detail.name
                      ],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.address_detail.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.address_detail.name
                  ],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ]?.extra_params?.progress == 100
              }
              title={pages.work_income_detail.title}
              link={pages.work_income_detail.url + '?preview=' + pages.work_income_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ] &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ]?.extra_params?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.work_income_detail.name
                      ],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.work_income_detail.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.work_income_detail.name
                  ],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.banking_progress == 100 ||
                !values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.applicant_details
                  ?.extra_params?.qualifier
              }
              title={pages.banking_details.title}
              link={pages.banking_details.url + '?preview=' + pages.banking_details.url}
              hideLabel={true}
              count={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.banking_progress == 100
                  ? 'Banking completed'
                  : 'No bank added'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.banking_details.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.banking_details.name
                  ],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={coApplicantIndexes[coApplicantIndex]}
              hide={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.upload_progress == 100
              }
              title={pages.upload_documents.title}
              link={pages.upload_documents.url + '?preview=' + pages.upload_documents.url}
              // hideLabel={true}
              count={
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.upload_required_fields_status &&
                values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]?.extra_params?.upload_progress != 0
                  ? Object.keys(
                      values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.applicant_details.name
                      ]?.extra_params?.upload_required_fields_status,
                    ).filter(
                      (k) =>
                        !values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                          pages.applicant_details.name
                        ]?.extra_params?.upload_required_fields_status[k],
                    )?.length
                  : 'ALL'
              }
            >
              {values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.applicant_details.name
              ]?.extra_params?.upload_required_fields_status &&
                Object.keys(
                  values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.applicant_details.name
                  ]?.extra_params?.upload_required_fields_status,
                )
                  .filter(
                    (k) =>
                      !values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.applicant_details.name
                      ]?.extra_params?.upload_required_fields_status[k],
                  )
                  .map((val, i) =>
                    fieldLabels[val] ? (
                      <p
                        key={i}
                        className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                      >
                        {fieldLabels[val]}
                        <span className='text-primary-red text-xs'>*</span>
                      </p>
                    ) : null,
                  )}
            </PreviewCard>
          </div>
        )}
      </>
    );
  };

  const PrimaryApplicantDetails = () => {
    return (
      <>
        {checkTotalProgress(values?.applicants?.[primaryIndex]) &&
        values?.property_details?.extra_params?.progress == 100 &&
        values?.reference_details?.extra_params?.progress == 100 ? (
          <StepCompleted />
        ) : (
          <div className='flex-1 flex flex-col gap-4 p-4 pb-[200px] overflow-auto bg-[##F9F9F9]'>
            <div className='flex gap-2'>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='none'
                  viewBox='0 0 16 16'
                >
                  <g
                    stroke='#96989A'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                    clipPath='url(#clip0_3125_37927)'
                  >
                    <path d='M7.999 14.667a6.667 6.667 0 100-13.334 6.667 6.667 0 000 13.334z'></path>
                    <path d='M8 10.667V8'></path>
                    <path d='M8 5.333h.007'></path>
                  </g>
                  <defs>
                    <clipPath id='clip0_3125_37927'>
                      <path fill='#fff' d='M0 0H16V16H0z'></path>
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <p className='text-xs not-italic font-normal text-dark-grey'>
                To get the applicant’s eligible amount, complete the mandatory fields
              </p>
            </div>
            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.progress == 100
              }
              title={pages.applicant_details.title}
              link={pages.applicant_details.url + '?preview=' + pages.applicant_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.applicant_details.name] &&
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name] &&
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.applicant_details.name],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.applicant_details.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.applicant_details.name],
                ).map((val, i) => (
                  <p key={i} className='text-xs pb-[3px] not-italic font-normal text-primary-black'>
                    {fieldLabels[val] ?? '-'}
                    <span className='text-primary-red text-xs'>*</span>
                  </p>
                ))}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.personal_details.name]?.extra_params
                  ?.progress == 100
              }
              title={pages.personal_details.title}
              link={pages.personal_details.url + '?preview=' + pages.personal_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.personal_details.name] &&
                values?.applicants?.[primaryIndex]?.[pages.personal_details.name] &&
                values?.applicants?.[primaryIndex]?.[pages.personal_details.name]?.extra_params
                  ?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.personal_details.name],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.personal_details.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.personal_details.name],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.address_detail.name]?.extra_params
                  ?.progress == 100
              }
              title={pages.address_detail.title}
              link={pages.address_detail.url + '?preview=' + pages.address_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.address_detail.name] &&
                values?.applicants?.[primaryIndex]?.[pages.address_detail.name] &&
                values?.applicants?.[primaryIndex]?.[pages.address_detail.name]?.extra_params
                  ?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.address_detail.name],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.address_detail.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.address_detail.name],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.work_income_detail.name]?.extra_params
                  ?.progress == 100
              }
              title={pages.work_income_detail.title}
              link={pages.work_income_detail.url + '?preview=' + pages.work_income_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name] &&
                values?.applicants?.[primaryIndex]?.[pages.work_income_detail.name] &&
                values?.applicants?.[primaryIndex]?.[pages.work_income_detail.name]?.extra_params
                  ?.progress != 0
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={values?.[pages.property_details.name]?.extra_params?.progress == 100}
              title={pages.property_details.title}
              link={pages.property_details.url + '?preview=' + pages.property_details.url}
              count={
                flattedErrors &&
                flattedErrors?.[pages.property_details.name] &&
                values?.[pages.property_details.name] &&
                values?.[pages.property_details.name]?.extra_params?.progress != 0
                  ? Object.keys(flattedErrors?.[pages.property_details.name]).length
                  : 'ALL'
              }
            >
              {flattedErrors?.[pages.property_details.name] &&
                Object.keys(flattedErrors?.[pages.property_details.name]).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.banking_progress == 100 ||
                !values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.qualifier
              }
              title={pages.banking_details.title}
              link={pages.banking_details.url + '?preview=' + pages.banking_details.url}
              hideLabel={true}
              count={
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.banking_progress == 100
                  ? 'Banking completed'
                  : 'No bank added'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.banking_details.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.banking_details.name],
                ).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={values?.[pages.reference_details.name]?.extra_params?.progress == 100}
              title={pages.reference_details.title}
              link={pages.reference_details.url + '?preview=' + pages.reference_details.url}
              count={
                flattedErrors &&
                flattedErrors?.[pages.reference_details.name] &&
                values?.[pages.reference_details.name] &&
                values?.[pages.reference_details.name]?.extra_params?.progress != 0
                  ? Object.keys(flattedErrors?.[pages.reference_details.name]).length
                  : 'ALL'
              }
            >
              {flattedErrors?.[pages.reference_details.name] &&
                Object.keys(flattedErrors?.[pages.reference_details.name]).map((val, i) =>
                  fieldLabels[val] ? (
                    <p
                      key={i}
                      className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                    >
                      {fieldLabels[val]}
                      <span className='text-primary-red text-xs'>*</span>
                    </p>
                  ) : null,
                )}
            </PreviewCard>

            <PreviewCard
              index={primaryIndex}
              hide={
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.upload_progress == 100
              }
              title={pages.upload_documents.title}
              link={pages.upload_documents.url + '?preview=' + pages.upload_documents.url}
              count={
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.upload_required_fields_status &&
                values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                  ?.upload_progress != 0
                  ? Object.keys(
                      values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]
                        ?.extra_params?.upload_required_fields_status,
                    ).filter(
                      (k) =>
                        !values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]
                          ?.extra_params?.upload_required_fields_status[k],
                    )?.length
                  : 'ALL'
              }
            >
              {values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                ?.upload_required_fields_status &&
                Object.keys(
                  values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]?.extra_params
                    ?.upload_required_fields_status,
                )
                  .filter(
                    (k) =>
                      !values?.applicants?.[primaryIndex]?.[pages.applicant_details.name]
                        ?.extra_params?.upload_required_fields_status[k],
                  )
                  .map((val, i) =>
                    fieldLabels[val] ? (
                      <p
                        key={i}
                        className='text-xs pb-[3px] not-italic font-normal text-primary-black'
                      >
                        {fieldLabels[val]}
                        <span className='text-primary-red text-xs'>*</span>
                      </p>
                    ) : null,
                  )}
            </PreviewCard>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh] bg-[#F9F9F9] justify-between'>
        <Topbar title='Preview of the application' id={values?.lead?.id} showClose={true} />
        <div className='pt-4 overflow-auto no-scrollbar flex flex-col flex-1'>
          <div className='px-6 mb-3 flex justify-between'>
            <span className='text-xs not-italic font-medium text-dark-grey'>APPLICANTS</span>
            <span className='text-right text-xs not-italic font-normal text-primary-black'>{`${
              values?.applicants?.[
                activeStep == 0 ? primaryIndex : coApplicantIndexes[coApplicantIndex]
              ]?.applicant_details?.first_name || '-'
            } (${activeStep == 0 ? 'Primary' : 'Co-app'}) `}</span>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, i) => (
              <Step
                sx={{
                  '& .MuiStepLabel-root': {
                    margin: '0',
                    padding: '0',
                    fontFamily: 'Poppins',
                  },
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#E33439', // circle color (COMPLETED)
                  },
                  '& .MuiStepLabel-root .Mui-disabled': {
                    borderWidth: i > coApplicantIndexes.length ? 0 : '1px',
                    borderRadius: '100%',
                    borderColor: i > coApplicantIndexes.length ? '#F3F3F3' : '#727376',
                  },
                  '& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-root': {
                    color: i > coApplicantIndexes.length ? '#F3F3F3' : '#fff',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'white', // circle color (ACTIVE)
                    borderWidth: '1px',
                    borderRadius: '100%',
                    borderColor: '#E33439',
                  },

                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                    color: 'common.white', // Just text label (ACTIVE)
                  },
                  '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel': {
                    color: 'common.white',
                  },
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: '#E33439', // circle's number (ACTIVE)
                    fontSize: '14px',
                    fontWeight: '600',
                  },

                  '& .MuiStepLabel-root .Mui-disabled .MuiStepIcon-text': {
                    fill: '#727376',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: i > coApplicantIndexes.length ? '0.6' : '1',
                  },
                }}
                key={i}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep == 0 ? <PrimaryApplicantDetails /> : <CoApplicantDetails />}
        </div>

        <div
          className='flex w-[100vw] p-[18px] bg-white gap-[20px] justify-end'
          style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
        >
          <Button inputClasses='w-1/2 h-[46px]' onClick={previousStep}>
            Previous
          </Button>
          <Button
            link={
              activeStep === coApplicantIndexes.length &&
              values?.lead?.extra_params?.progress_without_eligibility === 100 &&
              values?.lt_charges?.find((e) => e.status === 'Completed')
                ? '/lead/eligibility'
                : null
            }
            primary={true}
            disabled={
              ((activeStep === 0
                ? !checkTotalProgress(values?.applicants?.[primaryIndex]) ||
                  values?.property_details?.extra_params?.progress != 100 ||
                  values?.reference_details?.extra_params?.progress != 100
                : !checkTotalProgress(
                    values?.applicants?.[coApplicantIndexes[coApplicantIndex]],
                  )) &&
                values?.lead?.extra_params?.progress_without_eligibility !== 100) ||
              (activeStep === coApplicantIndexes.length &&
                !values?.lt_charges?.find((e) => e.status === 'Completed'))
            }
            inputClasses='w-1/2 h-[46px]'
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
        <SwipeableDrawerComponent />
      </div>

      {/* Lnt Charges */}
      {activeStep == 0 &&
      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params?.qualifier ? (
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: '#000000F2',
              fontFamily: 'Poppins',
            },

            '& .MuiPaper-root .MuiSnackbarContent-message': {
              color: '#FEFEFE',

              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
            },
          }}
          className='-translate-y-32 m-[10px]'
          open={!values?.lt_charges?.find((e) => e.status === 'Completed')}
          onClose={() => {}}
          message='L&T charges is pending'
          action={
            <button onClick={gotoLntCharges} className='mr-3'>
              <span className='text-right text-sm not-italic font-semibold text-primary-red'>
                Pay now
              </span>
            </button>
          }
        />
      ) : null}

      {activeStep != 0 &&
      values?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.applicant_details?.extra_params
        ?.qualifier ? (
        <Snackbar
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: '#000000F2',
              fontFamily: 'Poppins',
            },

            '& .MuiPaper-root .MuiSnackbarContent-message': {
              color: '#FEFEFE',

              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
            },
          }}
          className='-translate-y-32 m-[10px]'
          open={!values?.lt_charges?.find((e) => e.status === 'Completed')}
          onClose={() => {}}
          message='L&T charges is pending'
          action={
            <button onClick={gotoLntCharges} className='mr-3'>
              <span className='text-right text-sm not-italic font-semibold text-primary-red'>
                Pay now
              </span>
            </button>
          }
        />
      ) : null}

      <Popup
        handleClose={handleCloseQualifierNotActivePopup}
        open={openQualifierNotActivePopup}
        setOpen={setOpenQualifierNotActivePopup}
        title='Qualifier is not activated'
        description='Complete Applicant, Personal, Address and Work & Income details to activate'
      />
    </>
  );
}

function PreviewCard({ index, title, count, link, hide, children, hideLabel }) {
  const { setActiveIndex } = useContext(LeadContext);
  const handleClick = () => setActiveIndex(index);

  return (
    <>
      {hide || count == 0 ? null : (
        <div onClick={handleClick}>
          <Link
            to={link}
            className='rounded-lg border border-[#EBEBEB] bg-white p-3 flex flex-col gap-2 active:opacity-90'
          >
            <div className='flex justify-between'>
              <h4 className='overflow-hidden text-sm not-italic font-medium text-primary-black'>
                {title || '-'}
              </h4>
              <ArrowRightIcon2 />
            </div>

            <Separator />
            <div className='flex justify-start gap-[6px]'>
              {!hideLabel && (
                <p className='not-italic font-medium text-[10px] text-light-grey'>
                  INCOMPLETE FIELDS:{' '}
                </p>
              )}
              <span className='not-italic font-medium text-[10px] text-dark-grey leading-loose'>
                {count}
              </span>
            </div>
            {count === 'ALL' ? null : children}
          </Link>
        </div>
      )}
    </>
  );
}

function StepCompleted() {
  return (
    <div className='h-full w-full flex justify-center items-center bg-[#EEF0DD] mt-[20px]'>
      <StepCompletedIllustration />
    </div>
  );
}

const Separator = () => {
  return <div className='border-t-2 border-b-0 w-full'></div>;
};

PreviewCard.propTypes = {
  title: PropTypes.string,
  link: PropTypes.any,
  count: PropTypes.any,
  hide: PropTypes.any,
  children: PropTypes.any,
};
