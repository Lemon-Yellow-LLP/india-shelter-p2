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

const steps = ['', '', '', '', ''];

export default function Preview() {
  const { values, errors, activeIndex, setActiveIndex, handleSubmit } = useContext(LeadContext);

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [coApplicantIndex, setCoApplicantIndex] = useState(null);
  const [coApplicantIndexes, setCoApplicantIndexes] = useState([]);
  const [flattedErrors, setFlattedErrors] = useState({});

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

          ...(errors?.applicants?.[idx]?.work_income_detail?.pincode && {
            pincode: errors?.applicants?.[idx]?.work_income_detail?.pincode,
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

          ...(errors?.applicants?.[idx]?.work_income_detail?.pincode && {
            pincode: errors?.applicants?.[idx]?.work_income_detail?.pincode,
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
    });

    if (
      _errors?.property_details &&
      values?.property_details?.property_identification_is == 'not-yet'
    ) {
      _errors.property_details = {};
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

    // To show errors
    handleSubmit();
  }, []);

  useEffect(() => {
    setCoApplicantIndex(activeStep ? activeStep - 1 : 0);
  }, [activeStep]);

  useEffect(() => {
    setActiveIndex(coApplicantIndexes[coApplicantIndex]);
  }, [coApplicantIndex]);

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
      if (prev === 0) {
        setActiveIndex(coApplicantIndexes[coApplicantIndex]);
      }
      return prev + 1;
    });
  };

  const CoApplicantDetails = () => {
    return (
      <>
        {!errors?.applicants?.[coApplicantIndexes[coApplicantIndex]] ? (
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
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]
              }
              title={pages.applicant_details.title}
              link={pages.applicant_details.url + '?preview=' + pages.applicant_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.applicant_details.name
                ]
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
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ]
              }
              title={pages.personal_details.title}
              link={pages.personal_details.url + '?preview=' + pages.personal_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.personal_details.name
                ]
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
              title={pages.address_detail.title}
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ]
              }
              link={pages.address_detail.url + '?preview=' + pages.address_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.address_detail.name
                ]
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
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ]
              }
              title={pages.work_income_detail.title}
              link={pages.work_income_detail.url + '?preview=' + pages.work_income_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.work_income_detail.name
                ]
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
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.banking_details.name
                ]
              }
              title={pages.banking_details.title}
              link={pages.banking_details.url + '?preview=' + pages.banking_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.banking_details.name
                ]
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.banking_details.name
                      ],
                    ).length
                  : 'ALL'
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
              hide={
                !errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.upload_documents.name
                ]
              }
              title={pages.upload_documents.title}
              link={pages.upload_documents.url + '?preview=' + pages.upload_documents.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                  pages.upload_documents.name
                ]
                  ? Object.keys(
                      flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                        pages.upload_documents.name
                      ],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                pages.upload_documents.name
              ] &&
                Object.keys(
                  flattedErrors?.applicants?.[coApplicantIndexes[coApplicantIndex]]?.[
                    pages.upload_documents.name
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
          </div>
        )}
      </>
    );
  };

  const PrimaryApplicantDetails = () => {
    return (
      <>
        {!errors?.applicants?.[primaryIndex] &&
        !errors?.propertySchema &&
        !errors?.referenceSchema ? (
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.applicant_details.name]}
              title={pages.applicant_details.title}
              link={pages.applicant_details.url + '?preview=' + pages.applicant_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.applicant_details.name]
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.personal_details.name]}
              title={pages.personal_details.title}
              link={pages.personal_details.url + '?preview=' + pages.personal_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.personal_details.name]
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.address_detail.name]}
              title={pages.address_detail.title}
              link={pages.address_detail.url + '?preview=' + pages.address_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.address_detail.name]
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name]}
              title={pages.work_income_detail.title}
              link={pages.work_income_detail.url + '?preview=' + pages.work_income_detail.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.work_income_detail.name]
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
              hide={!flattedErrors?.[pages.property_details.name]}
              title={pages.property_details.title}
              link={pages.property_details.url + '?preview=' + pages.property_details.url}
              count={
                flattedErrors && flattedErrors?.[pages.property_details.name]
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.banking_details.name]}
              title={pages.banking_details.title}
              link={pages.banking_details.url + '?preview=' + pages.banking_details.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.banking_details.name]
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.banking_details.name],
                    ).length
                  : 'ALL'
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
              hide={!errors?.[pages.reference_details.name]}
              title={pages.reference_details.title}
              link={pages.reference_details.url + '?preview=' + pages.reference_details.url}
              count={
                flattedErrors && flattedErrors?.[pages.reference_details.name]
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
              hide={!errors?.applicants?.[primaryIndex]?.[pages.upload_documents.name]}
              title={pages.upload_documents.title}
              link={pages.upload_documents.url + '?preview=' + pages.upload_documents.url}
              count={
                flattedErrors &&
                flattedErrors?.applicants?.[primaryIndex]?.[pages.upload_documents.name]
                  ? Object.keys(
                      flattedErrors?.applicants?.[primaryIndex]?.[pages.upload_documents.name],
                    ).length
                  : 'ALL'
              }
            >
              {flattedErrors?.applicants?.[primaryIndex]?.[pages.upload_documents.name] &&
                Object.keys(
                  flattedErrors?.applicants?.[primaryIndex]?.[pages.upload_documents.name],
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
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh] bg-[#F9F9F9] justify-between'>
        <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
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
            link={activeStep === coApplicantIndexes.length ? '/lead/eligibility' : null}
            primary={true}
            disabled={
              activeStep === 0
                ? errors?.applicants?.[primaryIndex] ||
                  errors?.propertySchema ||
                  errors?.referenceSchema
                : errors?.applicants?.[coApplicantIndexes[coApplicantIndex]]
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
    </>
  );
}

function PreviewCard({ title, count, link, hide, children }) {
  return (
    <>
      {hide || count == 0 ? null : (
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
            <p className='not-italic font-medium text-[10px] text-light-grey'>
              INCOMPLETE FIELDS:{' '}
            </p>
            <span className='not-italic font-medium text-[10px] text-dark-grey leading-loose'>
              {count}
            </span>
          </div>
          {children}
        </Link>
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
