import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardLeadList, testLogout } from '../../global';
import { AuthContext } from '../../context/AuthContextProvider';
import { Header } from '../../components';
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

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [selectionRange, setSelectionRange] = useState({
    startDate: parseISO(moment().subtract(30, 'days').format()),
    endDate: parseISO(moment().format()),
    key: 'selection',
  });
  const navigate = useNavigate();

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
        // setLoading(false);
      }
    })();
  }, [selectionRange]);

  useEffect(() => {
    const data = leadList;
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

function LeadCard({ title, progress, id, mobile, created }) {
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
    </Link>
  );
}

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-2 w-full'></div>;
};
