import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../assets/icons/edit';
import BackIcon2 from '../../assets/icons/back-2';
import { AuthContext } from '../../context/AuthContextProvider';
import { Box, Button, Tabs, Tab } from '@mui/material';
import ProgressBadge from '../../components/ProgressBadge';
import { getDashboardLeadById } from '../../global';

const applicant_details = [
  {
    label: 'Loan type',
    value: '',
  },
  {
    label: 'Required loan amount',
    value: '',
  },
  {
    label: 'First name',
    value: '',
  },
  {
    label: 'Middle name',
    value: '',
  },
  {
    label: 'Last name',
    value: '',
  },
  {
    label: 'Date of birth',
    value: '',
  },
  {
    label: 'Purpose of loan',
    value: '',
  },
  {
    label: 'Property type',
    value: '',
  },
  {
    label: 'Mobile number',
    value: '',
  },
];

const address_details = [
  {
    label: 'Type of residence',
    value: '',
  },
  {
    subtitle: 'CURRENT ADDRESS',
    label: 'Flat no/Building name',
    value: '',
  },
  {
    label: 'Street/Area/Locality',
    value: '',
  },
  {
    label: 'Town',
    value: '',
  },
  {
    label: 'Landmark',
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
    label: 'No. of years residing',
    value: '',
  },
  {
    label: '',
    value: '',
  },
  {
    label: '',
    value: '',
  },
  {
    label: '',
    value: '',
  },
];

export default function DashboardApplicant() {
  const { id } = useParams();
  const {
    inputDisabled,
    values,
    currentLeadId,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldError,
    setFieldValue,
    updateProgress,
  } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [applicants, setApplicants] = useState([]);
  const [primaryApplicant, setPrimaryApplicant] = useState({});

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    (async () => {
      const data = await getDashboardLeadById(id);
      setApplicants(data?.applicants);
    })();
  }, []);

  useEffect(() => {
    const data = applicants?.filter((app) => app.applicant_details?.is_primary);
    if (data) setPrimaryApplicant(data.at(0));
  }, [applicants]);

  return (
    <div>
      <Titlebar id={id} />
      <div className=''>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleChangeTab} aria-label='basic tabs example'>
              <Tab className='w-1/2' label='Primary Applicant' {...a11yProps(0)} />
              <Tab className='w-1/2' label='Co-Applicants' {...a11yProps(1)} disabled />
            </Tabs>
          </Box>
        </Box>
        <CustomTabPanel value={activeTab} index={0}></CustomTabPanel>
        <CustomTabPanel value={activeTab} index={1}>
          Item Two
        </CustomTabPanel>
      </div>
    </div>
  );
}

const Titlebar = ({ id }) => {
  const navigate = useNavigate();
  return (
    <div className='flex items-start px-4 py-3 border border-[#ECECEC]'>
      <Button classes={{ padding: '0' }} onClick={() => navigate(-1)} className='mr-3'>
        <BackIcon2 />
      </Button>
      <div className='flex-1'>
        <h3>Suresh Ramji Shah</h3>
        <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
          ID:{' '}
          <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
            {id}
          </span>
        </p>
      </div>
      <Button className='ml-4 '>
        <EditIcon />
      </Button>
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

function FormDetails({ title, progress, children, data }) {
  return (
    <div>
      <div className=''>
        <h3 className='text-sm not-italic font-medium bg-primary-black'>{title}</h3>
        <ProgressBadge progress={progress} />
      </div>
      <div>
        {data?.map(({ label, value }, i) => (
          <div className='w-full' key={i}>
            <p className='w-1/2 text-xs not-italic font-normal text-dark-grey'>{label}</p>
            <p className='w-1/2 text-xs not-italic font-medium text-primary-black'>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
