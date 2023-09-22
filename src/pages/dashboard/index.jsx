import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardLeadList, testLogout } from '../../global';
import { AuthContext } from '../../context/AuthContextProvider';
import { Header } from '../../components';
import BackIcon2 from '../../assets/icons/back-2';
import Fab from '@mui/material/Fab';
import AddLeadIcon from '../../assets/icons/add-lead';
import Searchbox from '../../components/Searchbox.jsx/index.jsx';
import { IconArrowRight } from '../../assets/icons';
import ArrowRightIcon2 from '../../assets/icons/arrow-right-2';
import NoLeadIllustration from '../../assets/icons/no-lead';
import NoSearchResultIllustration from '../../assets/icons/no-search-lead';
import DateRangePicker from '../../components/DateRangePicker';
import ProgressBadge from '../../components/ProgressBadge';
import moment from 'moment';
import Fuse from 'fuse.js';
import { parseISO } from 'date-fns';

const leadData = [
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  {
    title: 'Suresh Ramji Shah',
    progress: 100,
    id: 89,
    mobile: '8278101922',
    created: '14/08/23',
  },
  // {
  //   title: 'Suresh Ramji Shah',
  //   progress: 100,
  //   id: 89,
  //   mobile: '8278101922',
  //   created: '14/08/23',
  // },
  // {
  //   title: 'Suresh Ramji Shah',
  //   progress: 100,
  //   id: 89,
  //   mobile: '8278101922',
  //   created: '14/08/23',
  // },
  // {
  //   title: 'Suresh Ramji Shah',
  //   progress: 100,
  //   id: 89,
  //   mobile: '8278101922',
  //   created: '14/08/23',
  // },
];

export default function Dashboard() {
  return (
    <>
      <DashboardMainScreen />
    </>
  );
}

const DashboardMainScreen = () => {
  const [leadList, setLeadList] = useState([]);
  const [primaryApplicantList, setPrimaryApplicantList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [query, setQuery] = useState('');
  const [selectionRange, setSelectionRange] = useState({
    startDate: parseISO(moment().startOf('month').format()),
    endDate: parseISO(moment().endOf('month').format()),
    key: 'selection',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    let value = query.trim().toLowerCase();
    setFilteredList(
      primaryApplicantList.filter(
        (applicant) =>
          String(applicant.lead_id).includes(value) ||
          String(applicant.first_name).toLowerCase().includes(value) ||
          String(applicant.middle_name).toLowerCase().includes(value) ||
          String(applicant.last_name).toLowerCase().includes(value) ||
          String(applicant.mobile_number).toLowerCase().includes(value),
      ),
    );
  };

  const handleResetSearch = () => {
    setQuery('');
    setFilteredList(primaryApplicantList);
  };

  useEffect(() => {
    (async () => {
      const data = await getDashboardLeadList({
        fromDate: selectionRange.startDate,
        toDate: selectionRange.endDate,
      });

      const formatted = data?.leads.filter((l) => l.applicants?.length > 0);
      setLeadList(formatted.map((l) => l?.applicants));
    })();
  }, [selectionRange]);

  useEffect(() => {
    const data = leadList.map((lead) => lead?.find((app) => app?.is_primary));
    setPrimaryApplicantList(data);
    setFilteredList(data);
  }, [leadList]);

  return (
    <div className='relative h-screen overflow-hidden'>
      <Header />

      {/* Dashboard Title */}
      <div className='p-4 pb-5 bg-neutral-white space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <h4 className='text-[22px] not-italic font-medium text-primary-black'>My Leads </h4>
            <span className='text-xs not-italic font-normal text-primary-black ml-[6px]'>
              {`(${filteredList.length})`}
            </span>
          </div>
          <div>
            <DateRangePicker
              selectionRange={selectionRange}
              setSelectionRange={setSelectionRange}
            />
          </div>
        </div>
        <div className=''>
          <Searchbox
            query={query}
            setQuery={setQuery}
            handleSubmit={handleSearch}
            handleReset={handleResetSearch}
          />
        </div>
      </div>

      <div
        className={`px-4 h-full bg-[#FAFAFA] ${
          leadData.length ? 'overflow-auto' : 'overflow-hidden'
        }`}
      >
        {/* List of leads */}

        {leadList.length === 0 ? (
          <div className='relative flex-1 flex h-full justify-center translate-y-20'>
            <NoLeadIllustration />
          </div>
        ) : filteredList.length ? (
          <div className='relative flex-1 flex flex-col gap-2'>
            {filteredList.map((app, i) => (
              <LeadCard
                key={i}
                id={app.lead_id}
                title={`${app.first_name} ${app.middle_name} ${app.last_name}`}
                progress={app.extra_params?.progress ?? 70}
                created={moment(app.created_at).format('DD/MM/YYYY')}
                mobile={app.mobile_number}
              />
            ))}
            <div className='h-[250px]'></div>
          </div>
        ) : (
          <div className='relative flex-1 flex h-full justify-center translate-y-20'>
            <NoSearchResultIllustration />
          </div>
        )}
      </div>
      <button className='fixed bottom-4 right-4 z-50 w-fit inline-flex items-center gap-1 p-3 bg-primary-red rounded-full'>
        <AddLeadIcon />
        <span className='text-sm not-italic font-medium text-white'>Add new lead</span>
      </button>
    </div>
  );
};

function LeadCard({ title, progress, id, mobile, created }) {
  return (
    <Link
      to={'/dashboard/' + id}
      className='rounded-lg border border-[#EBEBEB] bg-white p-3 flex flex-col gap-2'
    >
      <div className='flex justify-between'>
        <h4 className='overflow-hidden text-black text-sm not-italic font-normal'>{title}</h4>
        <ProgressBadge progress={progress} />
      </div>

      <div className='flex gap-4'>
        <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
          ID:{' '}
          <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
            {id}
          </span>
        </p>
        <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
          MOB NO:{' '}
          <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
            {mobile}
          </span>
        </p>
      </div>
      <Separator />
      <div className='flex'>
        <p className='not-italic font-medium text-[10px] leading-normal text-light-grey'>
          CREATED:{' '}
          <span className='not-italic font-medium text-[10px] leading-normal text-dark-grey'>
            {created}
          </span>
        </p>

        <div className='ml-auto'>
          <ArrowRightIcon2 />
        </div>
      </div>
    </Link>
  );
}

const DashboardTest = () => {
  const { token, setIsAuthenticated } = useContext(AuthContext);
  const [activeLoginRes, setActiveLoginRes] = useState(null);

  const handleActiveLogin = async () => {
    try {
      const res = await testLogout({
        headers: {
          Authorization: token,
        },
      });
      if (!res) return;

      setActiveLoginRes('SUCCESS, LOGGED IN');
    } catch (err) {
      console.log(err);
      setActiveLoginRes('FAILED, LOGGED OUT');
      window.location.reload();
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <h1>Dashboard</h1>
      {/* <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead'
      >
        Applicant Form Test Button
      </Link> */}

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/reference-details'
      >
        go-to-reference-details-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/personal-details'
      >
        go-to-personal-details-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/property-details'
      >
        go-to-property-details-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/applicant-details'
      >
        go-to-applicant-details-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/address-details'
      >
        go-to-address-details-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/work-income-details'
      >
        go-to-work-income-page
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/lnt-charges'
      >
        go-to-L&T-charges-page
      </Link>
      <button
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        onClick={handleActiveLogin}
      >
        Test active login
      </button>

      {activeLoginRes ? (
        <span>{activeLoginRes}</span>
      ) : (
        <span>ACTIVE LOGIN STATUS WILL BE SHOWN HERE</span>
      )}
    </div>
  );
};

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-2 w-full'></div>;
};
