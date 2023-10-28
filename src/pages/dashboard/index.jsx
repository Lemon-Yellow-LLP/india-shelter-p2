import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardLeadList, logout } from '../../global';
import { Button, Header } from '../../components';
import AddLeadIcon from '../../assets/icons/add-lead';
import Searchbox from '../../components/Searchbox.jsx/index.jsx';
import ArrowRightIcon2 from '../../assets/icons/arrow-right-2';
import NoLeadIllustration from '../../assets/icons/no-lead';
import NoSearchResultIllustration from '../../assets/icons/no-search-lead';
import DateRangePicker from '../../components/DateRangePicker';
import ProgressBadge from '../../components/ProgressBadge';
import moment from 'moment';
import { parseISO } from 'date-fns';
import { LeadContext } from '../../context/LeadContextProvider';
import { defaultValuesLead } from '../../context/defaultValuesLead';
import PropTypes from 'prop-types';
import LoaderDynamicText from '../../components/Loader/LoaderDynamicText';
import LogoutIcon from '../../assets/icons/logout-icon';
import DynamicDrawer from '../../components/SwipeableDrawer/DynamicDrawer';
import { IconClose } from '../../assets/icons';
import { AuthContext } from '../../context/AuthContextProvider';

LeadCard.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.number,
  id: PropTypes.any,
  mobile: PropTypes.any,
  created: PropTypes.any,
};

export default function Dashboard() {
  const { setValues, setActiveIndex } = useContext(LeadContext);
  const [leadList, setLeadList] = useState([]);
  const [primaryApplicantList, setPrimaryApplicantList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showLogout, setShowLogout] = useState();

  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [selectionRange, setSelectionRange] = useState({
    startDate: parseISO(moment().subtract(30, 'days').format()),
    endDate: parseISO(moment().format()),
    key: 'selection',
  });
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    let value = query.replace(/ /g, '').toLowerCase();
    setFilteredList(
      primaryApplicantList.filter((lead) => {
        const applicant = lead?.applicants?.find((applicant) => applicant?.is_primary);
        const fullName = String(applicant.first_name + applicant.middle_name + applicant.last_name);
        return (
          String(applicant.lead_id).includes(value) ||
          fullName.toLowerCase().includes(value) ||
          String(applicant.mobile_number).toLowerCase().includes(value)
        );
      }),
    );
  };

  const handleResetSearch = () => {
    setQuery('');
    setFilteredList(primaryApplicantList);
  };

  const handleLogout = async () => {
    try {
      await logout(
        {
          status: 'no',
          logout_via: 'New Login',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      window.location.replace('/');
    } catch (err) {
      window.location.replace('/');
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardLeadList({
          fromDate: selectionRange.startDate,
          toDate: moment(selectionRange.endDate).add(1, 'day'),
        });
        const formatted = data?.leads.filter((l) => l.applicants?.length > 0);
        setLeadList(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectionRange]);

  useEffect(() => {
    if (leadList.length === 0) return;
    setLoading(true);
    const data = leadList;
    setPrimaryApplicantList(data);
    setFilteredList(data);
    setLoading(false);
  }, [leadList]);

  return (
    <div className='relative h-screen overflow-hidden'>
      <Header>
        <button onClick={() => setShowLogout(true)} className='ml-auto'>
          <LogoutIcon />
        </button>
      </Header>

      {/* Dashboard Title */}
      <div className='p-4 pb-5 bg-neutral-white space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <h4 className='text-[22px] not-italic font-medium text-primary-black'>My Leads </h4>
            <span className='text-xs not-italic font-normal text-primary-black ml-[6px]'>
              {`(${filteredList?.length || 0})`}
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
      {!loading ? (
        <div className='px-4 h-full bg-[#FAFAFA] overflow-auto'>
          {/* List of leads */}
          {leadList?.applicants?.length === 0 ? (
            <div className='relative flex-1 flex h-full justify-center translate-y-20'>
              <NoLeadIllustration />
            </div>
          ) : filteredList?.length ? (
            <div className='relative flex-1 flex flex-col gap-2'>
              {filteredList.map((lead, i) => {
                const applicant = lead?.applicants?.find((applicant) => applicant?.is_primary);
                return (
                  <LeadCard
                    key={i}
                    id={applicant?.lead_id ?? '-'}
                    title={`${
                      applicant
                        ? applicant.first_name +
                          ' ' +
                          applicant?.middle_name +
                          ' ' +
                          applicant?.last_name
                        : '-'
                    }`}
                    progress={lead?.extra_params?.progress ?? 0}
                    created={moment(applicant?.created_at).format('DD/MM/YYYY')}
                    mobile={applicant?.mobile_number ?? '-'}
                    lead={lead}
                  />
                );
              })}
              <div className='h-[250px]'></div>
            </div>
          ) : (
            <div className='relative flex-1 flex h-full justify-center translate-y-20'>
              <NoSearchResultIllustration />
            </div>
          )}
        </div>
      ) : (
        <div className='absolute flex items-center w-full h-[60%] bg-white'>
          <LoaderDynamicText text='Loading...' textColor='black' height='60%' />
        </div>
      )}

      {/* Confirm skip for now */}
      <DynamicDrawer open={showLogout} setOpen={setShowLogout} height='182px'>
        <div className='flex gap-1 w-full'>
          <div className=' w-full'>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to log out?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              You can login back to access your content
            </p>
          </div>
          <div className='mb-auto'>
            <button onClick={() => setShowLogout(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={() => setShowLogout(false)}>
            Cancel
          </Button>
          <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </DynamicDrawer>

      <button
        onClick={() => {
          let newDefaultValues = structuredClone(defaultValuesLead);
          setValues(newDefaultValues);
          setActiveIndex(0);
          navigate('/lead/applicant-details');
        }}
        className='fixed bottom-4 right-6 z-50 w-fit inline-flex items-center gap-1 p-3 bg-primary-red rounded-full'
      >
        <AddLeadIcon />
        <span className='text-sm not-italic font-medium text-white'>Add new lead</span>
      </button>
    </div>
  );
}

function LeadCard({ title, progress, id, mobile, created, lead }) {
  return (
    <Link
      to={'/dashboard/' + id}
      className='rounded-lg border border-[#EBEBEB] bg-white p-3 flex flex-col gap-2 active:opacity-90'
    >
      <div className='flex justify-between'>
        <h4 className='overflow-hidden text-black text-sm not-italic font-normal'>
          {title || '-'}
        </h4>
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
            {mobile || '-'}
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

      {lead.sfdc_count !== 0 &&
        (lead.sfdc_status === 'Complete' ? (
          <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-secondary-green'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.843 16.372C3.273 16.372 2 15.099 2 13.529C2 11.959 3.273 10.686 4.843 10.686C4.843 7.546 7.389 5 10.529 5C12.879 5 14.895 6.426 15.762 8.46C16.051 8.394 16.349 8.351 16.658 8.351C18.873 8.351 20.668 10.146 20.668 12.361C20.668 14.576 18.873 16.371 16.658 16.371'
                stroke='#147257'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M15 13L10.1875 18L8 15.7273'
                stroke='#147257'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            DATA PUSH IS SUCCESSFUL
          </div>
        ) : (
          <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-primary-red'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.843 16.372C3.273 16.372 2 15.099 2 13.529C2 11.959 3.273 10.686 4.843 10.686C4.843 7.546 7.389 5 10.529 5C12.879 5 14.895 6.426 15.762 8.46C16.051 8.394 16.349 8.351 16.658 8.351C18.873 8.351 20.668 10.146 20.668 12.361C20.668 14.576 18.873 16.371 16.658 16.371'
                stroke='#E33439'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M7 15C7 12.7909 8.79086 11 11 11C13.2091 11 15 12.7909 15 15C15 17.2091 13.2091 19 11 19C9.51944 19 8.22675 18.1956 7.53513 17M7.53513 17V19M7.53513 17H9.5'
                stroke='#E33439'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            RETRY SALESFORCE PUSH
          </div>
        ))}
    </Link>
  );
}

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-2 w-full'></div>;
};
