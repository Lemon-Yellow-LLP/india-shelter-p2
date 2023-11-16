import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../assets/icons/edit';
import BackIcon2 from '../../assets/icons/back-2';
import { AuthContext } from '../../context/AuthContextProvider';
import { Box, Button, Tabs, Tab } from '@mui/material';
import ProgressBadge from '../../components/ProgressBadge';
import { getDashboardLeadById, pushToSalesforce } from '../../global';
import { CheckBox, DropDown, ToastMessage } from '../../components';
import moment from 'moment';
import { PrimaryDropdownOptions, CoApplicantDropdownOptions } from './DashboardDropdowns';
import { LeadContext } from '../../context/LeadContextProvider';
import EditLeadEnabled from '../../assets/icons/EditFormEnabled';
import loading from '../../assets/icons/loading.svg';

export default function DashboardApplicant() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const [leadData, setLeadData] = useState([]);
  const [primaryApplicant, setPrimaryApplicant] = useState({});
  const [coApplicants, setCoApplicants] = useState([]);
  const [coApplicantOptions, setCoApplicantOptions] = useState([]); // co-applicant dropdown options
  const [coApplicantSelectedOption, setCoApplicantSelectedOption] = useState('');
  const [activeCoApplicant, setActiveCoApplicant] = useState({});

  const [primarySelectedStep, setPrimarySelectedStep] = useState(PrimaryDropdownOptions[0].value);
  const [coApplicantSelectedStep, setCoApplicantSelectedStep] = useState(
    CoApplicantDropdownOptions[0].value,
  );
  const [lntCharges, setLntCharges] = useState(null);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getDashboardLeadById(id, {
          headers: {
            Authorization: token,
          },
        });
        setLeadData(data);

        // Find Primary Applicant
        const _primaryApplicant = data?.applicants?.find(
          (applicant) => applicant?.applicant_details?.is_primary,
        );
        setPrimaryApplicant(_primaryApplicant);

        // Get All CoApplicants
        setCoApplicants(
          data?.applicants?.filter(
            (applicant) =>
              applicant?.applicant_details?.id !== _primaryApplicant?.applicant_details?.id,
          ),
        );

        // Get completed lnt charges
        setLntCharges(data?.lt_charges?.find((charge) => charge?.status === 'Completed'));
      } catch (err) {
        console.error(err?.response?.status);
        navigate('/');
      }
    })();
  }, []);

  useEffect(() => {
    // Co Applicants Dropdown options
    if (!coApplicants) return;
    const options = [];
    coApplicants.map((applicant) => {
      options.push({
        label: `${applicant?.applicant_details?.first_name} ${applicant?.applicant_details?.middle_name} ${applicant?.applicant_details?.last_name}`,
        value: String(applicant?.applicant_details?.id),
      });
    });
    setCoApplicantOptions(options);
    setCoApplicantSelectedOption(options[0]?.value);
  }, [coApplicants]);

  useEffect(() => {
    // Active CoApplicant - whose data will be shown
    if (!coApplicants) return;
    setActiveCoApplicant(
      coApplicants.find(
        (applicant) => applicant?.applicant_details?.id == coApplicantSelectedOption,
      ),
    );
  }, [coApplicants, coApplicantSelectedOption]);

  const primaryListRef = useRef(null);
  const primarySelectedStepRef = useRef(null);
  const coApplicantListRef = useRef(null);
  const coApplicantSelectedStepRef = useRef(null);

  useEffect(() => {
    // Scroll to the selected step in primary applicant
    if (primaryListRef.current) {
      const container = primaryListRef.current;
      const selectedItem = primarySelectedStepRef.current;

      const offset = selectedItem?.offsetTop - container?.offsetTop;

      container.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, [primarySelectedStep, activeTab]);

  useEffect(() => {
    // Scroll to the selected step in co-applicants

    if (coApplicantListRef.current) {
      const container = coApplicantListRef.current;
      const selectedItem = coApplicantSelectedStepRef.current;

      const offset = selectedItem?.offsetTop - container?.offsetTop;

      container.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, [coApplicantSelectedStep, activeTab]);

  const bankingDetailsArr = (applicant) => {
    let arr = [];
    applicant?.banking_details
      ?.filter((b) => !b?.extra_params?.is_deleted)
      ?.map(
        (b, i) =>
          (arr = [
            ...arr,

            {
              subtitle: `ACCOUNT ${i + 1}`,
              label: 'Bank name',
              value: b?.bank_name,
            },
            {
              label: 'Account number',
              value: b?.account_number,
            },
            {
              label: 'Penny drop',
              value: b?.penny_drop_response?.result?.active === 'yes' ? 'Success' : 'Failed',
            },
            {
              label: 'IFSC Code',
              value: b?.ifsc_code,
            },
            {
              label: 'Branch',
              value: b?.branch_name,
            },
            {
              label: 'Account type',
              value: b?.account_type,
            },
          ]),
      );
    return arr;
  };

  return (
    <div className='relative overflow-hidden h-screen'>
      <Titlebar
        title={`${primaryApplicant?.applicant_details?.first_name} ${primaryApplicant?.applicant_details?.middle_name} ${primaryApplicant?.applicant_details?.last_name}`}
        id={id}
        primaryApplicant={primaryApplicant}
      />

      <Box sx={{ width: '100%', background: '#FEFEFE' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            textColor='inherit'
            variant='fullWidth'
            aria-label='full width tabs example'
            value={activeTab}
            onChange={handleChangeTab}
          >
            <Tab
              className='w-1/2 tabLabels2 bg-neutral-white'
              label='Primary Applicant'
              {...a11yProps(0)}
            />

            <Tab
              className='w-1/2 tabLabels2'
              label='Co-Applicants'
              {...a11yProps(1)}
              disabled={!(coApplicants && coApplicants.length)}
            />
          </Tabs>
        </Box>
      </Box>
      <CustomTabPanel className='h-full' value={activeTab} index={0}>
        <div className='py-3 px-4 bg-neutral-white'>
          <DropDown
            label='STEPS'
            name='applicant_options'
            options={PrimaryDropdownOptions}
            placeholder='Choose STEPS'
            onChange={(selection) => setPrimarySelectedStep(selection)}
            defaultSelected={primarySelectedStep}
            labelClassName={'text-xs font-medium text-dark-grey'}
          />
        </div>
        <div ref={primaryListRef} className='px-4 h-full overflow-auto'>
          <div className='flex justify-between pb-6'>
            <div>
              <span className='not-italic font-medium text-[10px] text-light-grey'>CREATED: </span>
              <span className='not-italic font-medium text-[10px] text-dark-grey'>
                {moment(primaryApplicant?.applicant_details?.created_at).format('DD/MM/YYYY')}
              </span>
            </div>

            <div>
              <span className='not-italic font-normal text-[12px] text-light-grey'>
                Completed:{' '}
              </span>
              <span className='text-right text-sm not-italic font-medium text-primary-red'>
                {`${leadData?.lead?.extra_params?.progress ?? 0}%`}
              </span>
            </div>
          </div>
          <FormDetails
            title='APPLICANT DETAILS'
            progress={primaryApplicant?.applicant_details?.extra_params?.progress}
            ref={primarySelectedStep == 'applicant_details' ? primarySelectedStepRef : null}
            data={[
              {
                label: 'Loan type',
                value: leadData?.lead?.loan_type,
              },
              {
                label: 'Required loan amount',
                value: leadData?.lead?.applied_amount,
              },
              {
                label: 'First name',
                value: primaryApplicant?.applicant_details?.first_name,
              },
              {
                label: 'Middle name',
                value: primaryApplicant?.applicant_details?.middle_name,
              },
              {
                label: 'Last name',
                value: primaryApplicant?.applicant_details?.last_name,
              },
              {
                label: 'Date of birth',
                value: primaryApplicant?.applicant_details?.date_of_birth,
              },
              {
                label: 'Purpose of loan',
                value: leadData?.lead?.purpose_of_loan,
              },
              {
                label: 'Property type',
                value: leadData?.lead?.property_type,
              },
              {
                label: 'Mobile number',
                value: primaryApplicant?.applicant_details?.mobile_number,
              },
            ]}
          />
          <Separator />

          <FormDetails
            title='PERSONAL DETAILS'
            ref={primarySelectedStep == 'personal_details' ? primarySelectedStepRef : null}
            progress={primaryApplicant?.personal_details?.extra_params?.progress}
            data={[
              {
                label: 'ID Type',
                value: primaryApplicant?.personal_details?.id_type,
              },
              {
                label: 'ID number',
                value: primaryApplicant?.personal_details?.id_number,
              },
              {
                label: 'Address proof',
                value: primaryApplicant?.personal_details?.selected_address_proof,
              },
              {
                label: 'Address proof number',
                value: primaryApplicant?.personal_details?.address_proof_number,
              },
              {
                label: 'Name',
                value: primaryApplicant?.personal_details?.first_name,
              },
              {
                label: 'Gender',
                value: primaryApplicant?.personal_details?.gender,
              },
              {
                label: 'Date of birth',
                value: primaryApplicant?.personal_details?.date_of_birth,
              },
              {
                label: 'Mobile number',
                value: primaryApplicant?.personal_details?.mobile_number,
              },
              {
                label: 'Father/Husband’s name',
                value: primaryApplicant?.personal_details?.father_name,
              },
              {
                label: 'Mother’s name',
                value: primaryApplicant?.personal_details?.mother_name,
              },
              {
                label: 'Marital status',
                value: primaryApplicant?.personal_details?.marital_status,
              },
              {
                label: 'Religion',
                value: primaryApplicant?.personal_details?.religion,
              },
              {
                label: 'Preferred Language',
                value: primaryApplicant?.personal_details?.preferred_language,
              },
              {
                label: 'Qualification',
                value: primaryApplicant?.personal_details?.qualification,
              },
              {
                label: 'Email',
                value: primaryApplicant?.personal_details?.email,
              },
            ]}
          />
          <Separator />

          <FormDetails
            ref={primarySelectedStep == 'address_details' ? primarySelectedStepRef : null}
            title='ADDRESS DETAILS'
            progress={primaryApplicant?.address_detail?.extra_params?.progress}
            data={[
              {
                label: 'Type of residence',
                value: primaryApplicant?.address_detail?.current_type_of_residence,
              },
              {
                label: 'Flat no/Building name',
                value: primaryApplicant?.address_detail?.current_flat_no_building_name,
                subtitle: 'CURRENT ADDRESS',
              },
              {
                label: 'Street/Area/Locality',
                value: primaryApplicant?.address_detail?.current_street_area_locality,
              },
              {
                label: 'Town',
                value: primaryApplicant?.address_detail?.current_town,
              },
              {
                label: 'Landmark',
                value: primaryApplicant?.address_detail?.current_landmark,
              },
              {
                label: 'Pincode',
                value: primaryApplicant?.address_detail?.current_pincode,
              },
              {
                label: 'City',
                value: primaryApplicant?.address_detail?.current_city,
              },
              {
                label: 'State',
                value: primaryApplicant?.address_detail?.current_state,
              },
              {
                label: 'No. of years residing',
                value: primaryApplicant?.address_detail?.current_no_of_year_residing,
              },
              {
                label: '',
                value: '',
                subtitle: 'PERMANENT ADDRESS',
                children: (
                  <div className='flex gap-2'>
                    <CheckBox
                      name=''
                      checked={
                        primaryApplicant?.address_detail?.extra_params
                          ?.permanent_address_same_as_current
                      }
                      disabled={true}
                    />
                    <p className='text-xs not-italic font-medium text-primary-black'>
                      Permanent address is same as Current address
                    </p>
                  </div>
                ),
              },

              {
                label: 'Type of residence',
                value: primaryApplicant?.address_detail?.current_type_of_residence,
              },
              {
                label: 'Flat no/Building name',
                value: primaryApplicant?.address_detail?.permanent_flat_no_building_name,
              },
              {
                label: 'Street/Area/Locality',
                value: primaryApplicant?.address_detail?.permanent_street_area_locality,
              },
              {
                label: 'Town',
                value: primaryApplicant?.address_detail?.permanent_town,
              },
              {
                label: 'Landmark',
                value: primaryApplicant?.address_detail?.permanent_landmark,
              },
              {
                label: 'Pincode',
                value: primaryApplicant?.address_detail?.permanent_pincode,
              },
              {
                label: 'City',
                value: primaryApplicant?.address_detail?.permanent_city,
              },
              {
                label: 'State',
                value: primaryApplicant?.address_detail?.permanent_state,
              },
              {
                label: 'No. of years residing',
                value: primaryApplicant?.address_detail?.permanent_no_of_year_residing,
              },
            ]}
          />
          <Separator />

          <FormDetails
            title='WORK & INCOME DETAILS'
            ref={primarySelectedStep == 'work_income_details' ? primarySelectedStepRef : null}
            progress={primaryApplicant?.work_income_detail?.extra_params?.progress}
            data={[
              {
                label: 'Profession',
                value: primaryApplicant?.work_income_detail?.profession,
              },
              {
                label: 'Company name',
                value: primaryApplicant?.work_income_detail?.company_name,
              },
              {
                label: 'Total income',
                value: primaryApplicant?.work_income_detail?.total_income,
              },
              {
                label: 'PF UAN',
                value: primaryApplicant?.work_income_detail?.pf_uan,
              },
              {
                label: 'No. of current loan(s)',
                value: primaryApplicant?.work_income_detail?.no_current_loan,
              },
              {
                label: 'Ongoing EMI(s)',
                value: primaryApplicant?.work_income_detail?.ongoing_emi,
              },
              {
                label: 'Working since',
                value: primaryApplicant?.work_income_detail?.working_since,
              },
              {
                label: 'Mode of salary',
                value: primaryApplicant?.work_income_detail?.mode_of_salary,
              },
              {
                label: 'Flat no/Building name',
                value: primaryApplicant?.work_income_detail?.flat_no_building_name,
              },

              {
                label: 'Street/Area/Locality',
                value: primaryApplicant?.work_income_detail?.street_area_locality,
              },
              {
                label: 'Town',
                value: primaryApplicant?.work_income_detail?.town,
              },
              {
                label: 'Landmark',
                value: primaryApplicant?.work_income_detail?.landmark,
              },
              {
                label: 'Pincode',
                value: primaryApplicant?.work_income_detail?.pincode,
              },
              {
                label: 'City',
                value: primaryApplicant?.work_income_detail?.city,
              },
              {
                label: 'State',
                value: primaryApplicant?.work_income_detail?.state,
              },
              {
                label: 'Total family members',
                value: primaryApplicant?.work_income_detail?.total_family_number,
              },
              {
                label: 'Total household income',
                value: primaryApplicant?.work_income_detail?.total_household_income,
              },
              {
                label: 'No. of dependents',
                value: primaryApplicant?.work_income_detail?.no_of_dependents,
              },
              {
                label: 'Business name',
                value: primaryApplicant?.work_income_detail?.business_name,
              },
              {
                label: 'Industries',
                value: primaryApplicant?.work_income_detail?.industries,
              },
              {
                label: 'GST Number',
                value: primaryApplicant?.work_income_detail?.gst_number,
              },
              {
                label: 'Pension amount',
                value: primaryApplicant?.work_income_detail?.pention_amount,
              },
            ]}
          />
          <Separator />

          <FormDetails
            title='QUALIFIER'
            ref={primarySelectedStep == 'qualifier' ? primarySelectedStepRef : null}
            data={[]}
            message={
              primaryApplicant?.applicant_details?.extra_params?.qualifier
                ? 'Qualifier completed'
                : 'Qualifier incomplete'
            }
          />
          <Separator />

          <FormDetails
            title='L&T CHARGES'
            ref={primarySelectedStep == 'lt_charges' ? primarySelectedStepRef : null}
            progress={null}
            data={[
              {
                label: 'Payment method',
                value: lntCharges?.airpay_verify_chmod ?? lntCharges?.method ?? '-',
              },
            ]}
            message={!lntCharges ? 'L&T charges is pending' : null}
          />
          <Separator />

          <FormDetails
            title='PROPERTY DETAILS'
            ref={primarySelectedStep == 'property_details' ? primarySelectedStepRef : null}
            progress={leadData?.property_details?.extra_params?.progress}
            data={[
              {
                label: 'Property identification',
                value: leadData?.property_details?.property_identification_is,
              },
              {
                label: 'Property estimated value',
                value: leadData?.property_details?.property_value_estimate,
              },
              {
                label: 'Owner name',
                value: leadData?.property_details?.owner_name,
              },
              {
                label: 'Plot/House/Flat no',
                value: leadData?.property_details?.plot_house_flat,
              },
              {
                label: 'Project/Society/Colony name',
                value: leadData?.property_details?.project_society_colony,
              },
              {
                label: 'Pincode',
                value: leadData?.property_details?.pincode,
              },
              {
                label: 'City',
                value: leadData?.property_details?.city,
              },
              {
                label: 'State',
                value: leadData?.property_details?.state,
              },
            ]}
          />
          <Separator />

          <FormDetails
            title='BANKING DETAILS'
            ref={primarySelectedStep == 'banking_details' ? primarySelectedStepRef : null}
            progress={primaryApplicant?.applicant_details?.extra_params?.banking_progress}
            data={bankingDetailsArr(primaryApplicant)}
          />
          <Separator />

          <FormDetails
            ref={primarySelectedStep == 'reference_details' ? primarySelectedStepRef : null}
            title='REFERENCE DETAILS'
            progress={leadData?.reference_details?.extra_params?.progress}
            data={[
              {
                subtitle: 'REFERENCE DETAIL 1',
                label: 'Reference type',
                value: leadData?.reference_details?.reference_1_type,
              },
              {
                label: 'Full name',
                value: leadData?.reference_details?.reference_1_full_name,
              },
              {
                label: 'Mobile number',
                value: leadData?.reference_details?.reference_1_phone_number,
              },
              {
                label: 'Address',
                value: leadData?.reference_details?.reference_1_address,
              },
              {
                label: 'Pincode',
                value: leadData?.reference_details?.reference_1_pincode,
              },
              {
                label: 'City',
                value: leadData?.reference_details?.reference_1_city,
              },
              {
                label: 'State',
                value: leadData?.reference_details?.reference_1_state,
              },
              {
                label: 'Email',
                value: leadData?.reference_details?.reference_1_email,
              },
              {
                subtitle: 'REFERENCE DETAIL 2',
                label: 'Reference type',
                value: leadData?.reference_details?.reference_2_type,
              },
              {
                label: 'Full name',
                value: leadData?.reference_details?.reference_2_full_name,
              },
              {
                label: 'Mobile number',
                value: leadData?.reference_details?.reference_2_phone_number,
              },
              {
                label: 'Address',
                value: leadData?.reference_details?.reference_2_address,
              },
              {
                label: 'Pincode',
                value: leadData?.reference_details?.reference_2_pincode,
              },
              {
                label: 'City',
                value: leadData?.reference_details?.reference_2_city,
              },
              {
                label: 'State',
                value: leadData?.reference_details?.reference_2_state,
              },
              {
                label: 'Email',
                value: leadData?.reference_details?.reference_2_email,
              },
            ]}
          />
          <Separator />

          <FormDetails
            ref={primarySelectedStep == 'upload_documents' ? primarySelectedStepRef : null}
            title='UPLOAD DOCUMENTS'
            progress={primaryApplicant?.applicant_details?.extra_params?.upload_progress}
            data={[
              {
                label: 'Customer photo',
                value: primaryApplicant?.applicant_details?.document_meta?.customer_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'ID Type',
                value: primaryApplicant?.personal_details?.id_type,
              },
              {
                label: 'ID proof',
                value: primaryApplicant?.applicant_details?.document_meta?.id_proof_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Address type',
                value: primaryApplicant?.personal_details?.selected_address_proof,
              },
              {
                label: 'Address proof',
                value:
                  primaryApplicant?.applicant_details?.document_meta?.address_proof_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Property papers',
                value:
                  primaryApplicant?.applicant_details?.document_meta?.property_paper_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Salary slip',
                value:
                  primaryApplicant?.applicant_details?.document_meta?.salary_slip_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Form 60',
                value: primaryApplicant?.applicant_details?.document_meta?.form_60_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Property image',
                value: primaryApplicant?.applicant_details?.document_meta?.property_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Upload selfie',
                value: primaryApplicant?.applicant_details?.document_meta?.lo_selfie?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Other documents',
                value: primaryApplicant?.applicant_details?.document_meta?.other_docs?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
            ]}
          />
          <Separator />

          {/* <FormDetails
            ref={primarySelectedStep == 'preview' ? primarySelectedStepRef : null}
            title='PREVIEW'
            data={[]}
            message={'Will fill this once Banking details is done'}
          />
          <Separator /> */}

          <FormDetails
            ref={primarySelectedStep == 'eligibility' ? primarySelectedStepRef : null}
            title='ELIGIBILITY'
            message={
              primaryApplicant?.applicant_details?.extra_params?.eligibility
                ? 'Eligibility completed'
                : 'Eligibility incomplete'
            }
          />

          <div className='h-[500px] w-full'></div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel className='h-full' value={activeTab} index={1}>
        <div className='py-3 px-4 bg-neutral-white'>
          <div className='flex flex-col'>
            <DropDown
              label='CO-APPLICANTS'
              name='coApplicants'
              options={coApplicantOptions}
              placeholder='Choose CO-APPLICANTS'
              onChange={(selection) => setCoApplicantSelectedOption(selection)}
              defaultSelected={coApplicantSelectedOption}
              labelClassName={'text-xs font-medium text-dark-grey'}
            />
            <DropDown
              label='STEPS'
              name='coApplicant_steps'
              options={CoApplicantDropdownOptions}
              placeholder='Choose STEPS'
              onChange={(selection) => setCoApplicantSelectedStep(selection)}
              defaultSelected={coApplicantSelectedStep}
              labelClassName={'text-xs font-medium text-dark-grey'}
            />
          </div>
        </div>

        <div ref={coApplicantListRef} className='h-full px-4 overflow-auto'>
          <div className='flex justify-between pb-6'>
            <div>
              <span className='not-italic font-medium text-[10px] text-light-grey'>CREATED: </span>
              <span className='not-italic font-medium text-[10px] text-dark-grey'>
                {moment(activeCoApplicant?.applicant_details?.created_at).format('DD/MM/YYYY')}
              </span>
            </div>

            <div>
              <span className='not-italic font-normal text-[12px] text-light-grey'>
                Completed:{' '}
              </span>
              <span className='text-right text-sm not-italic font-medium text-primary-red'>
                {`${leadData?.lead?.extra_params?.progress ?? 0}%`}
              </span>
            </div>
          </div>
          <FormDetails
            ref={coApplicantSelectedStep == 'applicant_details' ? coApplicantSelectedStepRef : null}
            title='APPLICANT DETAILS'
            progress={primaryApplicant?.applicant_details?.extra_params?.progress}
            data={[
              {
                label: 'Loan type',
                value: leadData?.lead?.loan_type,
              },
              {
                label: 'Required loan amount',
                value: leadData?.lead?.applied_amount,
              },
              {
                label: 'First name',
                value: activeCoApplicant?.applicant_details?.first_name,
              },
              {
                label: 'Middle name',
                value: activeCoApplicant?.applicant_details?.middle_name,
              },
              {
                label: 'Last name',
                value: activeCoApplicant?.applicant_details?.last_name,
              },
              {
                label: 'Date of birth',
                value: activeCoApplicant?.applicant_details?.date_of_birth,
              },
              {
                label: 'Purpose of loan',
                value: leadData?.lead?.purpose_of_loan,
              },
              {
                label: 'Property type',
                value: leadData?.lead?.property_type,
              },
              {
                label: 'Mobile number',
                value: activeCoApplicant?.applicant_details?.mobile_number,
              },
            ]}
          />
          <Separator />

          <FormDetails
            ref={coApplicantSelectedStep == 'personal_details' ? coApplicantSelectedStepRef : null}
            title='PERSONAL DETAILS'
            progress={primaryApplicant?.personal_details?.extra_params?.progress}
            data={[
              {
                label: 'ID Type',
                value: activeCoApplicant?.personal_details?.id_type,
              },
              {
                label: 'ID number',
                value: activeCoApplicant?.personal_details?.id_number,
              },
              {
                label: 'Address proof',
                value: activeCoApplicant?.personal_details?.selected_address_proof,
              },
              {
                label: 'Address proof number',
                value: activeCoApplicant?.personal_details?.address_proof_number,
              },
              {
                label: 'Name',
                value: activeCoApplicant?.personal_details?.first_name,
              },
              {
                label: 'Gender',
                value: activeCoApplicant?.personal_details?.gender,
              },
              {
                label: 'Date of birth',
                value: activeCoApplicant?.personal_details?.date_of_birth,
              },
              {
                label: 'Mobile number',
                value: activeCoApplicant?.personal_details?.mobile_number,
              },
              {
                label: 'Father/Husband’s name',
                value: activeCoApplicant?.personal_details?.father_name,
              },
              {
                label: 'Mother’s name',
                value: activeCoApplicant?.personal_details?.mother_name,
              },
              {
                label: 'Marital status',
                value: activeCoApplicant?.personal_details?.marital_status,
              },
              {
                label: 'Religion',
                value: activeCoApplicant?.personal_details?.religion,
              },
              {
                label: 'Preferred Language',
                value: activeCoApplicant?.personal_details?.preferred_language,
              },
              {
                label: 'Qualification',
                value: activeCoApplicant?.personal_details?.qualification,
              },
              {
                label: 'Email',
                value: activeCoApplicant?.personal_details?.email,
              },
            ]}
          />
          <Separator />

          <FormDetails
            ref={coApplicantSelectedStep == 'address_details' ? coApplicantSelectedStepRef : null}
            title='ADDRESS DETAILS'
            progress={activeCoApplicant?.address_detail?.extra_params?.progress}
            data={[
              {
                label: 'Type of residence',
                value: activeCoApplicant?.address_detail?.current_type_of_residence,
              },
              {
                label: 'Flat no/Building name',
                value: activeCoApplicant?.address_detail?.current_flat_no_building_name,
                subtitle: 'CURRENT ADDRESS',
              },
              {
                label: 'Street/Area/Locality',
                value: activeCoApplicant?.address_detail?.current_street_area_locality,
              },
              {
                label: 'Town',
                value: activeCoApplicant?.address_detail?.current_town,
              },
              {
                label: 'Landmark',
                value: activeCoApplicant?.address_detail?.current_landmark,
              },
              {
                label: 'Pincode',
                value: activeCoApplicant?.address_detail?.current_pincode,
              },
              {
                label: 'City',
                value: activeCoApplicant?.address_detail?.current_city,
              },
              {
                label: 'State',
                value: activeCoApplicant?.address_detail?.current_state,
              },
              {
                label: 'No. of years residing',
                value: activeCoApplicant?.address_detail?.current_no_of_year_residing,
              },
              {
                label: '',
                value: '',
                subtitle: 'PERMANENT ADDRESS',
                children: (
                  <div className='flex gap-2'>
                    <CheckBox
                      name=''
                      checked={
                        primaryApplicant?.address_detail?.extra_params
                          ?.permanent_address_same_as_current
                      }
                      disabled={true}
                    />
                    <p className='text-xs not-italic font-medium text-primary-black'>
                      Permanent address is same as Current address
                    </p>
                  </div>
                ),
              },

              {
                label: 'Type of residence',
                value: activeCoApplicant?.address_detail?.current_type_of_residence,
              },
              {
                label: 'Flat no/Building name',
                value: activeCoApplicant?.address_detail?.permanent_flat_no_building_name,
              },
              {
                label: 'Street/Area/Locality',
                value: activeCoApplicant?.address_detail?.permanent_street_area_locality,
              },
              {
                label: 'Town',
                value: activeCoApplicant?.address_detail?.permanent_town,
              },
              {
                label: 'Landmark',
                value: activeCoApplicant?.address_detail?.permanent_landmark,
              },
              {
                label: 'Pincode',
                value: activeCoApplicant?.address_detail?.permanent_pincode,
              },
              {
                label: 'City',
                value: activeCoApplicant?.address_detail?.permanent_city,
              },
              {
                label: 'State',
                value: activeCoApplicant?.address_detail?.permanent_state,
              },
              {
                label: 'No. of years residing',
                value: activeCoApplicant?.address_detail?.permanent_no_of_year_residing,
              },
            ]}
          />
          <Separator />

          <FormDetails
            ref={
              coApplicantSelectedStep == 'work_income_details' ? coApplicantSelectedStepRef : null
            }
            title='WORK & INCOME DETAILS'
            progress={activeCoApplicant?.work_income_detail?.extra_params?.progress}
            data={[
              {
                label: 'Profession',
                value: activeCoApplicant?.work_income_detail?.profession,
              },
              {
                label: 'Company name',
                value: activeCoApplicant?.work_income_detail?.company_name,
              },
              {
                label: 'Total income',
                value: activeCoApplicant?.work_income_detail?.total_income,
              },
              {
                label: 'PF UAN',
                value: activeCoApplicant?.work_income_detail?.pf_uan,
              },
              {
                label: 'No. of current loan(s)',
                value: activeCoApplicant?.work_income_detail?.no_current_loan,
              },
              {
                label: 'Ongoing EMI(s)',
                value: activeCoApplicant?.work_income_detail?.ongoing_emi,
              },
              {
                label: 'Working since',
                value: activeCoApplicant?.work_income_detail?.working_since,
              },
              {
                label: 'Mode of salary',
                value: activeCoApplicant?.work_income_detail?.mode_of_salary,
              },
              {
                label: 'Flat no/Building name',
                value: activeCoApplicant?.work_income_detail?.flat_no_building_name,
              },

              {
                label: 'Street/Area/Locality',
                value: activeCoApplicant?.work_income_detail?.street_area_locality,
              },
              {
                label: 'Town',
                value: activeCoApplicant?.work_income_detail?.town,
              },
              {
                label: 'Landmark',
                value: activeCoApplicant?.work_income_detail?.landmark,
              },
              {
                label: 'Pincode',
                value: activeCoApplicant?.work_income_detail?.pincode,
              },
              {
                label: 'City',
                value: activeCoApplicant?.work_income_detail?.city,
              },
              {
                label: 'State',
                value: activeCoApplicant?.work_income_detail?.state,
              },
              {
                label: 'Total family members',
                value: activeCoApplicant?.work_income_detail?.total_family_number,
              },
              {
                label: 'Total household income',
                value: activeCoApplicant?.work_income_detail?.total_household_income,
              },
              {
                label: 'No. of dependents',
                value: activeCoApplicant?.work_income_detail?.no_of_dependents,
              },
            ]}
          />

          <Separator />

          <FormDetails
            ref={coApplicantSelectedStep == 'qualifier' ? coApplicantSelectedStepRef : null}
            title='QUALIFIER'
            data={[]}
            message={
              activeCoApplicant?.applicant_details?.extra_params?.qualifier
                ? 'Qualifier completed'
                : 'Qualifier incomplete'
            }
          />
          <Separator />

          <FormDetails
            ref={coApplicantSelectedStep == 'banking_details' ? coApplicantSelectedStepRef : null}
            title='BANKING DETAILS'
            progress={activeCoApplicant?.applicant_details?.extra_params?.banking_progress}
            data={bankingDetailsArr(activeCoApplicant)}
          />
          <Separator />

          <FormDetails
            ref={coApplicantSelectedStep == 'upload_documents' ? coApplicantSelectedStepRef : null}
            title='UPLOAD DOCUMENTS'
            progress={activeCoApplicant?.applicant_details?.extra_params?.upload_progress}
            data={[
              {
                label: 'Customer photo',
                value: activeCoApplicant?.applicant_details?.document_meta?.customer_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'ID Type',
                value: activeCoApplicant?.personal_details?.id_type,
              },
              {
                label: 'ID proof',
                value: activeCoApplicant?.applicant_details?.document_meta?.id_proof_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Address type',
                value: activeCoApplicant?.personal_details?.selected_address_proof,
              },
              {
                label: 'Address proof',
                value:
                  activeCoApplicant?.applicant_details?.document_meta?.address_proof_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Property papers',
                value:
                  activeCoApplicant?.applicant_details?.document_meta?.property_paper_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Salary slip',
                value:
                  activeCoApplicant?.applicant_details?.document_meta?.salary_slip_photos?.filter(
                    (cp) => cp?.active,
                  ).length
                    ? 'Uploaded'
                    : '-',
              },
              {
                label: 'Form 60',
                value: activeCoApplicant?.applicant_details?.document_meta?.form_60_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Property image',
                value: activeCoApplicant?.applicant_details?.document_meta?.property_photos?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Upload selfie',
                value: activeCoApplicant?.applicant_details?.document_meta?.lo_selfie?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
              {
                label: 'Other documents',
                value: activeCoApplicant?.applicant_details?.document_meta?.other_docs?.filter(
                  (cp) => cp?.active,
                ).length
                  ? 'Uploaded'
                  : '-',
              },
            ]}
          />

          <div className='h-[500px] w-full'></div>
        </div>
      </CustomTabPanel>
    </div>
  );
}

const Titlebar = ({ title, id, primaryApplicant }) => {
  const { setValues, setActiveIndex } = useContext(LeadContext);
  const { setPhoneNumberList, toastMessage, setToastMessage, token } = useContext(AuthContext);

  const [totalProgress, setTotalProgress] = useState(0);
  const [leadData, setLeadData] = useState(null);
  const [sfdcPush, setSfdcPush] = useState({
    status: null,
    loader: false,
  });
  const navigate = useNavigate();

  const getLeadData = async () => {
    const data = await getDashboardLeadById(id, {
      headers: {
        Authorization: token,
      },
    });
    setLeadData(data);
    setTotalProgress(data?.lead?.extra_params?.progress);
  };

  useEffect(() => {
    getLeadData();
  }, []);

  const handleOpenForm = async (id) => {
    const data = await getDashboardLeadById(id, {
      headers: {
        Authorization: token,
      },
    });

    setPhoneNumberList((prev) => {
      return {
        ...prev,
        applicant_0: data?.applicants?.[0]?.applicant_details?.mobile_number ?? '',
        applicant_1: data?.applicants?.[1]?.applicant_details?.mobile_number ?? '',
        applicant_2: data?.applicants?.[2]?.applicant_details?.mobile_number ?? '',
        applicant_3: data?.applicants?.[3]?.applicant_details?.mobile_number ?? '',
        applicant_4: data?.applicants?.[4]?.applicant_details?.mobile_number ?? '',
        reference_1: data?.reference_details?.reference_1_phone_number ?? '',
        reference_2: data?.reference_details?.reference_2_phone_number ?? '',
      };
    });

    const newApplicants = data.applicants.map((applicant) => {
      let accounts = [];
      if (applicant?.banking_details?.length) {
        accounts = applicant?.banking_details?.filter(
          (account) => !account?.extra_params?.is_deleted,
        );
      }

      return { ...applicant, banking_details: accounts };
    });

    setValues({ ...data, applicants: newApplicants });

    let primaryIndex = newApplicants
      .map((applicant, index) => (applicant.applicant_details.is_primary ? index : -1))
      .filter((index) => index !== -1);

    setActiveIndex(primaryIndex[0] ?? 0);

    navigate('/lead/applicant-details');
  };

  const sfdcPUSH = async () => {
    setSfdcPush({ ...sfdcPush, loader: true });

    try {
      const sfdc_res = await pushToSalesforce(leadData.lead.id, {
        headers: {
          Authorization: token,
        },
      });

      if (sfdc_res) {
        setToastMessage('Data has been successfully pushed to the Salesforce');
        setSfdcPush({ ...sfdcPush, loader: false, status: sfdc_res.lead.sfdc_status });
      }
    } catch (err) {
      console.log(err);
      setToastMessage('The data push to Salesforce has failed');
      setSfdcPush({ ...sfdcPush, loader: false, status: 'Error' });
    }
  };

  useEffect(() => {
    leadData && setSfdcPush({ ...sfdcPush, status: leadData?.lead.sfdc_status });
  }, [leadData]);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        setMessage={setToastMessage}
        error={sfdcPush.status !== 'Complete' ? true : false}
      />

      <div
        id='titlebar'
        className='sticky inset-0 bg-neutral-white h-fit flex items-start px-4 py-3 border border-[#ECECEC]'
      >
        <button
          className='p-0 mr-3'
          onClick={() => navigate('/dashboard')}
          disabled={sfdcPush.loader}
        >
          {sfdcPush.loader ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              viewBox='0 0 24 24'
            >
              <g>
                <rect
                  width='24'
                  height='24'
                  fill='#FEFEFE'
                  rx='12'
                  transform='matrix(1 0 0 -1 0 24)'
                ></rect>
                <path
                  stroke='#96989A'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M15 18l-6-6 6-6'
                ></path>
              </g>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              viewBox='0 0 24 24'
            >
              <g>
                <rect
                  width='24'
                  height='24'
                  fill='#FEFEFE'
                  rx='12'
                  transform='matrix(1 0 0 -1 0 24)'
                ></rect>
                <path
                  stroke='#373435'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M15 18l-6-6 6-6'
                ></path>
              </g>
            </svg>
          )}
        </button>
        <div className='flex-1'>
          <h3 className='w-[200px] truncate'>{title}</h3>
          <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
            LEAD ID:
            <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
              {id}
            </span>
          </p>
        </div>

        {leadData && (
          <button>
            {!sfdcPush.loader &&
              leadData?.lead.sfdc_count !== 0 &&
              leadData?.lead.sfdc_count <= 4 &&
              (sfdcPush.status === 'Complete' ? (
                <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-secondary-green'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M5.843 17.372C4.273 17.372 3 16.099 3 14.529C3 12.959 4.273 11.686 5.843 11.686C5.843 8.546 8.389 6 11.529 6C13.879 6 15.895 7.426 16.762 9.46C17.051 9.394 17.349 9.351 17.658 9.351C19.873 9.351 21.668 11.146 21.668 13.361C21.668 15.576 19.873 17.371 17.658 17.371'
                      stroke='#147257'
                      strokeWidth='1.5'
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M16 14L11.1875 19L9 16.7273'
                      stroke='#147257'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              ) : (
                <div
                  onClick={() => sfdcPUSH()}
                  className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-primary-red'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M5.843 16.372C4.273 16.372 3 15.099 3 13.529C3 11.959 4.273 10.686 5.843 10.686C5.843 7.546 8.389 5 11.529 5C13.879 5 15.895 6.426 16.762 8.46C17.051 8.394 17.349 8.351 17.658 8.351C19.873 8.351 21.668 10.146 21.668 12.361C21.668 14.576 19.873 16.371 17.658 16.371'
                      stroke='#E33439'
                      strokeWidth='1.5'
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M8 15C8 12.7909 9.79086 11 12 11C14.2091 11 16 12.7909 16 15C16 17.2091 14.2091 19 12 19C10.5194 19 9.22675 18.1956 8.53513 17M8.53513 17V19M8.53513 17H10.5'
                      stroke='#E33439'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              ))}

            {sfdcPush.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}

            {leadData.lead.sfdc_count > 4 && leadData.lead.sfdc_status !== 'Complete' && (
              <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g opacity='0.6'>
                    <path
                      d='M17.658 15.371C19.873 15.371 21.668 13.576 21.668 11.361C21.668 9.146 19.873 7.351 17.658 7.351C17.349 7.351 17.051 7.393 16.762 7.46C15.896 5.426 13.879 4 11.529 4C8.389 4 5.843 6.546 5.843 9.686C4.273 9.686 3 10.959 3 12.529C3 14.099 4.273 15.372 5.843 15.372M14.355 13.022L9.368 18.009M15.387 15.516C15.387 17.4634 13.8084 19.042 11.861 19.042C9.91364 19.042 8.335 17.4634 8.335 15.516C8.335 13.5686 9.91364 11.99 11.861 11.99C13.8084 11.99 15.387 13.5686 15.387 15.516Z'
                      stroke='#96989A'
                      strokeWidth='1.5'
                      strokeMiterlimit='10'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </g>
                </svg>
              </div>
            )}

            {leadData.lead.sfdc_count > 4 && leadData.lead.sfdc_status === 'Complete' ? (
              <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-secondary-green'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M5.843 17.372C4.273 17.372 3 16.099 3 14.529C3 12.959 4.273 11.686 5.843 11.686C5.843 8.546 8.389 6 11.529 6C13.879 6 15.895 7.426 16.762 9.46C17.051 9.394 17.349 9.351 17.658 9.351C19.873 9.351 21.668 11.146 21.668 13.361C21.668 15.576 19.873 17.371 17.658 17.371'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16 14L11.1875 19L9 16.7273'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            ) : null}
          </button>
        )}

        <button
          className='ml-4 '
          onClick={() => handleOpenForm(id)}
          disabled={primaryApplicant?.applicant_details?.extra_params?.eligibility}
        >
          {primaryApplicant?.applicant_details?.extra_params?.eligibility ? (
            <EditIcon />
          ) : (
            <EditLeadEnabled />
          )}
        </button>
      </div>
    </>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index ? children : null}
    </div>
  );
}

const FormDetails = React.forwardRef(function FormDetails(
  { title, progress = 0, data, message, className },
  ref,
) {
  return (
    <div ref={ref} className={className}>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-sm not-italic font-medium text-primary-black'>{title}</h3>
        {message || progress === null ? null : <ProgressBadge progress={progress} />}
      </div>
      {message ? (
        <p className='text-xs not-italic font-normal text-dark-grey'>{message}</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {data && data.length ? (
            data.map(({ label, value, subtitle, children }, i) => (
              <div key={i} className='flex flex-col gap-4'>
                {subtitle ? (
                  <p className='text-xs not-italic font-semibold text-primary-black mt-1'>
                    {subtitle}
                  </p>
                ) : null}
                {label ? (
                  <div className='w-full flex gap-4' key={i}>
                    <p className='w-1/2 text-xs not-italic font-normal text-dark-grey'>{label}</p>
                    <p className='w-1/2 text-xs not-italic font-medium text-primary-black'>
                      {value || (value === 0 ? value : '-')}
                    </p>
                  </div>
                ) : null}
                {children ? children : null}
              </div>
            ))
          ) : (
            <p className='text-xs not-italic font-medium text-primary-black'>
              This section is not done yet
            </p>
          )}
        </div>
      )}
    </div>
  );
});

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-6 w-full'></div>;
};
