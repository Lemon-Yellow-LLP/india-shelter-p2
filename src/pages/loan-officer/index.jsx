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
  const { setValues, setActiveIndex, handleReset } = useContext(LeadContext);
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
        const data = await getDashboardLeadList(
          {
            fromDate: selectionRange.startDate,
            toDate: moment(selectionRange.endDate).add(1, 'day'),
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );
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
            disabled={loading}
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
        <div className='absolute flex items-center w-full dashBoardLoaderHeight bg-white'>
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
          handleReset();
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

      {lead.sfdc_count !== 0 && lead.sfdc_count <= 4 ? (
        <div className='flex justify-between items-center'>
          <p className='text-[10px] leading-4 text-primary-black font-light'>
            Salesforce ID: {lead?.sfdc_submit_pwa?.Application_Id}
          </p>

          {lead.sfdc_status === 'Complete' ? (
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
            <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-[#EF8D32]'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M5.843 16.372C4.273 16.372 3 15.099 3 13.529C3 11.959 4.273 10.686 5.843 10.686C5.843 7.546 8.389 5 11.529 5C13.879 5 15.895 6.426 16.762 8.46C17.051 8.394 17.349 8.351 17.658 8.351C19.873 8.351 21.668 10.146 21.668 12.361C21.668 14.576 19.873 16.371 17.658 16.371'
                  stroke='#EF8D32'
                  strokeMiterlimit='10'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M8 15C8 12.7909 9.79086 11 12 11C14.2091 11 16 12.7909 16 15C16 17.2091 14.2091 19 12 19C10.5194 19 9.22675 18.1956 8.53513 17M8.53513 17V19M8.53513 17H10.5'
                  stroke='#EF8D32'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              RETRY SALESFORCE PUSH
            </div>
          )}
        </div>
      ) : null}

      {lead.sfdc_count > 4 && lead.sfdc_status !== 'Complete' && (
        <div className='flex gap-1 items-center justify-end text-[10px] font-medium leading-4 text-[#96989A]'>
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
          DATA PUSH IS UNSUCCESSFUL
        </div>
      )}

      {lead.sfdc_count > 4 && lead.sfdc_status === 'Complete' ? (
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
      ) : null}
    </Link>
  );
}

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-2 w-full'></div>;
};
