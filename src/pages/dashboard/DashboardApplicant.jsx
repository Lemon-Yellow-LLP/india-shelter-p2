import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../assets/icons/edit';
import BackIcon2 from '../../assets/icons/back-2';
import { AuthContext } from '../../context/AuthContextProvider';
import { Box, Button, Tabs, Tab } from '@mui/material';
import ProgressBadge from '../../components/ProgressBadge';
import { getDashboardLeadById } from '../../global';
import { DropDown } from '../../components';

const PrimaryDropdownOptions = [
  {
    label: 'Applicant Details',
    value: 'applicant_details',
  },
  {
    label: 'Personal Details',
    value: 'personal_details',
  },
  {
    label: 'Address Details',
    value: 'address_details',
  },
  {
    label: 'Work & Income Details',
    value: 'work_income_details',
  },
  {
    label: 'Qualifier',
    value: 'qualifier',
  },
  {
    label: 'L&T Charges',
    value: 'lnt_charges',
  },
  {
    label: 'Property Details',
    value: 'property_details',
  },
  {
    label: 'Banking Details',
    value: 'banking_details',
  },
  {
    label: 'Reference Details',
    value: 'reference_details',
  },
  {
    label: 'Upload Documents',
    value: 'upload_documents',
  },
  {
    label: 'Preview',
    value: 'preview',
  },
  {
    label: 'Eligibility',
    value: 'eligibility',
  },
];

const CoApplicantDropdownOptions = [
  {
    label: 'Applicant Details',
    value: 'applicant_details',
  },
  {
    label: 'Personal Details',
    value: 'personal_details',
  },
  {
    label: 'Address Details',
    value: 'address_details',
  },
  {
    label: 'Work & Income Details',
    value: 'work_income_details',
  },

  {
    label: 'Banking Details',
    value: 'banking_details',
  },
  {
    label: 'Upload Documents',
    value: 'upload_documents',
  },
  {
    label: 'Qualifier',
    value: 'qualifier',
  },
];

export default function DashboardApplicant() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  const [leadData, setLeadData] = useState([]);
  const [primaryApplicant, setPrimaryApplicant] = useState({});
  const [coApplicants, setCoApplicants] = useState({});
  const [coApplicantOptions, setCoApplicantOptions] = useState([]);

  const [primarySelectedOption, setPrimarySelectedOption] = useState(
    PrimaryDropdownOptions[0].value,
  );
  const [coApplicantSelectedOption, setCoApplicantSelectedOption] = useState(
    CoApplicantDropdownOptions[0].value,
  );

  const [activeCoApplicant, setActiveCoApplicant] = useState({});

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
      const data = await getDashboardLeadById(id);
      setLeadData(data);
      setCoApplicants(data?.applicants);
      const _primaryApplicant = data?.applicants?.find((app) => app.applicant_details?.is_primary);
      setPrimaryApplicant(_primaryApplicant);
    })();
  }, []);

  useEffect(() => {
    setActiveCoApplicant(coApplicants[0]);
  }, [leadData]);

  const listRef = useRef(null);

  return (
    <div className='relative h-screen overflow-hidden  bg-medium-grey'>
      <div className=''></div>
      <Titlebar id={id} />
      <div className='h-full'>
        <Box sx={{ width: '100%', position: 'sticky', inset: 0, background: '#FEFEFE' }}>
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
              <Tab className='w-1/2 tabLabels2' label='Co-Applicants' {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Box>
        <CustomTabPanel className='h-full px-4 ' value={activeTab} index={0}>
          <div className='py-3 sticky inset-0 bg-neutral-white'>
            <DropDown
              label='STEPS'
              name='applicant.options'
              options={PrimaryDropdownOptions}
              placeholder='Choose STEPS'
              onChange={(selection) => setPrimarySelectedOption(selection)}
              defaultSelected={primarySelectedOption}
            />
          </div>
          <div ref={listRef} className='overflow-auto h-full'>
            <div>
              <FormDetails
                title='APPLICANT DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Loan type',
                    value: leadData?.lead?.loan_type || '-',
                  },
                  {
                    label: 'Required loan amount',
                    value: leadData?.lead?.applied_amount || '-',
                  },
                  {
                    label: 'First name',
                    value: primaryApplicant?.applicant_details?.first_name || '-',
                  },
                  {
                    label: 'Middle name',
                    value: primaryApplicant?.applicant_details?.middle_name || '-',
                  },
                  {
                    label: 'Last name',
                    value: primaryApplicant?.applicant_details?.last_name || '-',
                  },
                  {
                    label: 'Date of birth',
                    value: primaryApplicant?.applicant_details?.date_of_birth || '-',
                  },
                  {
                    label: 'Purpose of loan',
                    value: leadData?.lead?.purpose_of_loan || '-',
                  },
                  {
                    label: 'Property type',
                    value: leadData?.lead?.property_type || '-',
                  },
                  {
                    label: 'Mobile number',
                    value: primaryApplicant?.applicant_details?.mobile_number || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='PERSONAL DETAILS'
                progress={90}
                data={[
                  {
                    label: 'ID Type',
                    value: primaryApplicant?.personal_details?.id_type || '-',
                  },
                  {
                    label: 'ID number',
                    value: primaryApplicant?.personal_details?.id_number || '-',
                  },
                  {
                    label: 'Address proof',
                    value: primaryApplicant?.personal_details?.selected_address_proof || '-',
                  },
                  {
                    label: 'Address proof number',
                    value: primaryApplicant?.personal_details?.address_proof_number || '-',
                  },
                  {
                    label: 'Name',
                    value: primaryApplicant?.personal_details?.first_name || '-',
                  },
                  {
                    label: 'Gender',
                    value: primaryApplicant?.personal_details?.gender || '-',
                  },
                  {
                    label: 'Date of birth',
                    value: primaryApplicant?.personal_details?.date_of_birth || '-',
                  },
                  {
                    label: 'Mobile number',
                    value: primaryApplicant?.personal_details?.mobile_number || '-',
                  },
                  {
                    label: 'Father/Husband’s name',
                    value: primaryApplicant?.personal_details?.father_husband_name || '-',
                  },
                  {
                    label: 'Mother’s name',
                    value: primaryApplicant?.personal_details?.mother_name || '-',
                  },
                  {
                    label: 'Marital status',
                    value: primaryApplicant?.personal_details?.marital_status || '-',
                  },
                  {
                    label: 'Religion',
                    value: primaryApplicant?.personal_details?.religion || '-',
                  },
                  {
                    label: 'Preferred Language',
                    value: primaryApplicant?.personal_details?.preferred_language || '-',
                  },
                  {
                    label: 'Qualification',
                    value: primaryApplicant?.personal_details?.qualification || '-',
                  },
                  {
                    label: 'Email',
                    value: primaryApplicant?.personal_details?.email || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='ADDRESS DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Type of residence',
                    value: primaryApplicant?.address_detail?.current_type_of_residence || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value: primaryApplicant?.address_detail?.current_flat_no_building_name || '-',
                    subtitle: 'CURRENT ADDRESS',
                  },
                  {
                    label: 'Street/Area/Locality',
                    value: primaryApplicant?.address_detail?.current_street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: primaryApplicant?.address_detail?.current_town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: primaryApplicant?.address_detail?.current_landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: primaryApplicant?.address_detail?.current_pincode || '-',
                  },
                  {
                    label: 'City',
                    value: primaryApplicant?.address_detail?.current_city || '-',
                  },
                  {
                    label: 'State',
                    value: primaryApplicant?.address_detail?.current_state || '-',
                  },
                  {
                    label: 'No. of years residing',
                    value: primaryApplicant?.address_detail?.current_no_of_year_residing || '-',
                  },
                  {
                    label: '',
                    value: '',
                    subtitle: 'PERMANENT ADDRESS',
                  },

                  {
                    label: 'Type of residence',
                    value: primaryApplicant?.address_detail?.current_type_of_residence || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value: primaryApplicant?.address_detail?.permanent_flat_no_building_name || '-',
                  },
                  {
                    label: 'Street/Area/Locality',
                    value: primaryApplicant?.address_detail?.permanent_street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: primaryApplicant?.address_detail?.permanent_town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: primaryApplicant?.address_detail?.permanent_landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: primaryApplicant?.address_detail?.permanent_pincode || '-',
                  },
                  {
                    label: 'City',
                    value: primaryApplicant?.address_detail?.permanent_city || '-',
                  },
                  {
                    label: 'State',
                    value: primaryApplicant?.address_detail?.permanent_state || '-',
                  },
                  {
                    label: 'No. of years residing',
                    value: primaryApplicant?.address_detail?.permanent_no_of_year_residing || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='WORK & INCOME DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Profession',
                    value: primaryApplicant?.work_income_detail?.profession || '-',
                  },
                  {
                    label: 'Company name',
                    value: primaryApplicant?.work_income_detail?.company_name || '-',
                  },
                  {
                    label: 'Total income',
                    value: primaryApplicant?.work_income_detail?.total_income || '-',
                  },
                  {
                    label: 'PF UAN',
                    value: primaryApplicant?.work_income_detail?.pf_uan || '-',
                  },
                  {
                    label: 'No. of current loan(s)',
                    value: primaryApplicant?.work_income_detail?.no_current_loan || '-',
                  },
                  {
                    label: 'Ongoing EMI(s)',
                    value: primaryApplicant?.work_income_detail?.ongoing_emi || '-',
                  },
                  {
                    label: 'Working since',
                    value: primaryApplicant?.work_income_detail?.working_since || '-',
                  },
                  {
                    label: 'Mode of salary',
                    value: primaryApplicant?.work_income_detail?.mode_of_salary || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value: primaryApplicant?.work_income_detail?.flat_no_building_name || '-',
                  },

                  {
                    label: 'Street/Area/Locality',
                    value: primaryApplicant?.work_income_detail?.street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: primaryApplicant?.work_income_detail?.town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: primaryApplicant?.work_income_detail?.landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: primaryApplicant?.work_income_detail?.pincode || '-',
                  },
                  {
                    label: 'City',
                    value: primaryApplicant?.work_income_detail?.city || '-',
                  },
                  {
                    label: 'State',
                    value: primaryApplicant?.work_income_detail?.state || '-',
                  },
                  {
                    label: 'Total family members',
                    value: primaryApplicant?.work_income_detail?.total_family_number || '-',
                  },
                  {
                    label: 'Total household income',
                    value: primaryApplicant?.work_income_detail?.total_household_income || '-',
                  },
                  {
                    label: 'No. of dependents',
                    value: primaryApplicant?.work_income_detail?.no_of_dependents || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails title='QUALIFIER' progress={90} data={[]} />
              <Separator />

              <FormDetails title='L&T CHARGES' progress={90} data={[]} />
              <Separator />

              <FormDetails
                title='PROPERTY DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Property identification',
                    value: '',
                  },
                  {
                    label: 'Property estimated value',
                    value: '',
                  },
                  {
                    label: 'Owner name',
                    value: '',
                  },
                  {
                    label: 'Plot/House/Flat no',
                    value: '',
                  },
                  {
                    label: 'Project/Society/Colony name',
                    value: '',
                  },
                  {
                    label: 'Pincode',
                    value: '',
                  },
                  {
                    label: 'City',
                    value: '',
                  },
                  {
                    label: 'State',
                    value: '',
                  },
                ]}
              />
              <Separator />

              <FormDetails title='BANKING DETAILS' progress={90} data={[]} />
              <Separator />

              <FormDetails
                title='REFERENCE DETAILS'
                progress={90}
                data={[
                  {
                    subtitle: 'REFERENCE DETAIL 1',
                    label: 'Reference type',
                    value: '',
                  },
                  {
                    label: 'Full name',
                    value: '',
                  },
                  {
                    label: 'Mobile number',
                    value: '',
                  },
                  {
                    label: 'Address',
                    value: '',
                  },
                  {
                    label: 'Pincode',
                    value: '',
                  },
                  {
                    label: 'City',
                    value: '',
                  },
                  {
                    label: 'State',
                    value: '',
                  },
                  {
                    label: 'Email',
                    value: '',
                  },
                  {
                    subtitle: 'REFERENCE DETAIL 2',
                    label: 'Reference type',
                    value: '',
                  },
                  {
                    label: 'Full name',
                    value: '',
                  },
                  {
                    label: 'Mobile number',
                    value: '',
                  },
                  {
                    label: 'Address',
                    value: '',
                  },
                  {
                    label: 'Pincode',
                    value: '',
                  },
                  {
                    label: 'City',
                    value: '',
                  },
                  {
                    label: 'State',
                    value: '',
                  },
                  {
                    label: 'Email',
                    value: '',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='UPLOAD DOCUMENTS'
                progress={90}
                data={[]}
                message={'Will fill this once Banking details is done'}
              />
              <Separator />

              <FormDetails
                title='PREVIEW'
                progress={90}
                data={[]}
                message={'Will fill this once Banking details is done'}
              />
              <Separator />

              <FormDetails
                title='ELIGIBILITY'
                progress={90}
                data={[]}
                message={'Will fill this once Banking details is done'}
              />

              <div className='h-[500px] w-full'></div>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel className='h-full px-4 ' value={activeTab} index={1}>
          <div className='py-3 sticky inset-0 bg-neutral-white'>
            <div className='flex flex-col'>
              <DropDown
                label='CO-APPLICANTS'
                name='coApplicants'
                options={CoApplicantDropdownOptions}
                placeholder='Choose CO-APPLICANTS'
                onChange={(selection) => setActiveCoApplicant(selection)}
                defaultSelected={coApplicantSelectedOption}
              />
              <DropDown
                label='STEPS'
                name='coApplicant.options'
                options={CoApplicantDropdownOptions}
                placeholder='Choose STEPS'
                onChange={(selection) => setCoApplicantSelectedOption(selection)}
                defaultSelected={coApplicantSelectedOption}
              />
            </div>
          </div>

          <div ref={listRef} className='overflow-auto h-full'>
            <div>
              <FormDetails
                title='APPLICANT DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Loan type',
                    value: leadData?.lead?.loan_type || '-',
                  },
                  {
                    label: 'Required loan amount',
                    value: leadData?.lead?.applied_amount || '-',
                  },
                  {
                    label: 'First name',
                    value: activeCoApplicant?.applicant_details?.first_name || '-',
                  },
                  {
                    label: 'Middle name',
                    value: activeCoApplicant?.applicant_details?.middle_name || '-',
                  },
                  {
                    label: 'Last name',
                    value: activeCoApplicant?.applicant_details?.last_name || '-',
                  },
                  {
                    label: 'Date of birth',
                    value: activeCoApplicant?.applicant_details?.date_of_birth || '-',
                  },
                  {
                    label: 'Purpose of loan',
                    value: leadData?.lead?.purpose_of_loan || '-',
                  },
                  {
                    label: 'Property type',
                    value: leadData?.lead?.property_type || '-',
                  },
                  {
                    label: 'Mobile number',
                    value: activeCoApplicant?.applicant_details?.mobile_number || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='PERSONAL DETAILS'
                progress={90}
                data={[
                  {
                    label: 'ID Type',
                    value: activeCoApplicant?.personal_details?.id_type || '-',
                  },
                  {
                    label: 'ID number',
                    value: activeCoApplicant?.personal_details?.id_number || '-',
                  },
                  {
                    label: 'Address proof',
                    value: activeCoApplicant?.personal_details?.selected_address_proof || '-',
                  },
                  {
                    label: 'Address proof number',
                    value: activeCoApplicant?.personal_details?.address_proof_number || '-',
                  },
                  {
                    label: 'Name',
                    value: activeCoApplicant?.personal_details?.first_name || '-',
                  },
                  {
                    label: 'Gender',
                    value: activeCoApplicant?.personal_details?.gender || '-',
                  },
                  {
                    label: 'Date of birth',
                    value: activeCoApplicant?.personal_details?.date_of_birth || '-',
                  },
                  {
                    label: 'Mobile number',
                    value: activeCoApplicant?.personal_details?.mobile_number || '-',
                  },
                  {
                    label: 'Father/Husband’s name',
                    value: activeCoApplicant?.personal_details?.father_husband_name || '-',
                  },
                  {
                    label: 'Mother’s name',
                    value: activeCoApplicant?.personal_details?.mother_name || '-',
                  },
                  {
                    label: 'Marital status',
                    value: activeCoApplicant?.personal_details?.marital_status || '-',
                  },
                  {
                    label: 'Religion',
                    value: activeCoApplicant?.personal_details?.religion || '-',
                  },
                  {
                    label: 'Preferred Language',
                    value: activeCoApplicant?.personal_details?.preferred_language || '-',
                  },
                  {
                    label: 'Qualification',
                    value: activeCoApplicant?.personal_details?.qualification || '-',
                  },
                  {
                    label: 'Email',
                    value: activeCoApplicant?.personal_details?.email || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='ADDRESS DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Type of residence',
                    value: activeCoApplicant?.address_detail?.current_type_of_residence || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value: activeCoApplicant?.address_detail?.current_flat_no_building_name || '-',
                    subtitle: 'CURRENT ADDRESS',
                  },
                  {
                    label: 'Street/Area/Locality',
                    value: activeCoApplicant?.address_detail?.current_street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: activeCoApplicant?.address_detail?.current_town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: activeCoApplicant?.address_detail?.current_landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: activeCoApplicant?.address_detail?.current_pincode || '-',
                  },
                  {
                    label: 'City',
                    value: activeCoApplicant?.address_detail?.current_city || '-',
                  },
                  {
                    label: 'State',
                    value: activeCoApplicant?.address_detail?.current_state || '-',
                  },
                  {
                    label: 'No. of years residing',
                    value: activeCoApplicant?.address_detail?.current_no_of_year_residing || '-',
                  },
                  {
                    label: '',
                    value: '',
                    subtitle: 'PERMANENT ADDRESS',
                  },

                  {
                    label: 'Type of residence',
                    value: activeCoApplicant?.address_detail?.current_type_of_residence || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value:
                      activeCoApplicant?.address_detail?.permanent_flat_no_building_name || '-',
                  },
                  {
                    label: 'Street/Area/Locality',
                    value: activeCoApplicant?.address_detail?.permanent_street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: activeCoApplicant?.address_detail?.permanent_town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: activeCoApplicant?.address_detail?.permanent_landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: activeCoApplicant?.address_detail?.permanent_pincode || '-',
                  },
                  {
                    label: 'City',
                    value: activeCoApplicant?.address_detail?.permanent_city || '-',
                  },
                  {
                    label: 'State',
                    value: activeCoApplicant?.address_detail?.permanent_state || '-',
                  },
                  {
                    label: 'No. of years residing',
                    value: activeCoApplicant?.address_detail?.permanent_no_of_year_residing || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails
                title='WORK & INCOME DETAILS'
                progress={90}
                data={[
                  {
                    label: 'Profession',
                    value: activeCoApplicant?.work_income_detail?.profession || '-',
                  },
                  {
                    label: 'Company name',
                    value: activeCoApplicant?.work_income_detail?.company_name || '-',
                  },
                  {
                    label: 'Total income',
                    value: activeCoApplicant?.work_income_detail?.total_income || '-',
                  },
                  {
                    label: 'PF UAN',
                    value: activeCoApplicant?.work_income_detail?.pf_uan || '-',
                  },
                  {
                    label: 'No. of current loan(s)',
                    value: activeCoApplicant?.work_income_detail?.no_current_loan || '-',
                  },
                  {
                    label: 'Ongoing EMI(s)',
                    value: activeCoApplicant?.work_income_detail?.ongoing_emi || '-',
                  },
                  {
                    label: 'Working since',
                    value: activeCoApplicant?.work_income_detail?.working_since || '-',
                  },
                  {
                    label: 'Mode of salary',
                    value: activeCoApplicant?.work_income_detail?.mode_of_salary || '-',
                  },
                  {
                    label: 'Flat no/Building name',
                    value: activeCoApplicant?.work_income_detail?.flat_no_building_name || '-',
                  },

                  {
                    label: 'Street/Area/Locality',
                    value: activeCoApplicant?.work_income_detail?.street_area_locality || '-',
                  },
                  {
                    label: 'Town',
                    value: activeCoApplicant?.work_income_detail?.town || '-',
                  },
                  {
                    label: 'Landmark',
                    value: activeCoApplicant?.work_income_detail?.landmark || '-',
                  },
                  {
                    label: 'Pincode',
                    value: activeCoApplicant?.work_income_detail?.pincode || '-',
                  },
                  {
                    label: 'City',
                    value: activeCoApplicant?.work_income_detail?.city || '-',
                  },
                  {
                    label: 'State',
                    value: activeCoApplicant?.work_income_detail?.state || '-',
                  },
                  {
                    label: 'Total family members',
                    value: activeCoApplicant?.work_income_detail?.total_family_number || '-',
                  },
                  {
                    label: 'Total household income',
                    value: activeCoApplicant?.work_income_detail?.total_household_income || '-',
                  },
                  {
                    label: 'No. of dependents',
                    value: activeCoApplicant?.work_income_detail?.no_of_dependents || '-',
                  },
                ]}
              />
              <Separator />

              <FormDetails title='BANKING DETAILS' progress={90} data={[]} />
              <Separator />

              <FormDetails
                title='UPLOAD DOCUMENTS'
                progress={90}
                data={[]}
                message={'Will fill this once Banking details is done'}
              />
              <Separator />

              <FormDetails title='QUALIFIER' progress={90} data={[]} />

              <div className='h-[500px] w-full'></div>
            </div>
          </div>
        </CustomTabPanel>
      </div>
    </div>
  );
}

const Titlebar = ({ id }) => {
  const navigate = useNavigate();
  return (
    <div className='sticky inset-0 bg-neutral-white h-fit flex items-start px-4 py-3 border border-[#ECECEC]'>
      <button classes={{ padding: '0' }} onClick={() => navigate('/')} className='mr-3'>
        <BackIcon2 />
      </button>
      <div className='flex-1'>
        <h3>Suresh Ramji Shah</h3>
        <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
          ID:{' '}
          <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
            {id}
          </span>
        </p>
      </div>
      <button className='ml-4 '>
        <EditIcon />
      </button>
    </div>
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

function FormDetails({ title, progress, children, data, message }) {
  return (
    <div>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-sm not-italic font-medium text-primary-black'>{title}</h3>
        {message ? null : <ProgressBadge progress={progress} />}
      </div>
      {message ? (
        <p className='text-xs not-italic font-normal text-dark-grey'>{message}</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {data && data.length ? (
            data.map(({ label, value, subtitle }, i) => (
              <div key={i} className='flex flex-col gap-4'>
                {subtitle ? (
                  <p className='text-xs not-italic font-semibold text-primary-black mt-1'>
                    {subtitle}
                  </p>
                ) : null}
                <div className='w-full flex gap-4' key={i}>
                  <p className='w-1/2 text-xs not-italic font-normal text-dark-grey'>{label}</p>
                  <p className='w-1/2 text-xs not-italic font-medium text-primary-black'>{value}</p>
                </div>
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
}
const Separator = () => {
  return <div className='border-t-2 border-b-0 my-6 w-full'></div>;
};
