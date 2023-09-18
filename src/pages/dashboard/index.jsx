import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { testLogout } from '../../global';
import { AuthContext } from '../../context/AuthContextProvider';
import { Header } from '../../components';

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className='px-4'>
        <DashboardTitle />
        {/* List of leads */}
        <div className=''>
          <LeadCard />
        </div>
      </div>
    </>
  );
}

function DashboardTitle() {
  return (
    <div className='pb-[19px] bg-neutral-white'>
      <div className='flex items-center'>
        <h4 className='text-[22px] not-italic font-medium text-primary-black'>My Leads </h4>
        <span className='text-xs not-italic font-normal text-primary-black ml-[6px]'>(260)</span>
      </div>
      {/* date picker */}
      <div>date range picker</div>
      <div className=''>{/* Search box */}</div>
    </div>
  );
}

function LeadCard() {
  return (
    <div className='rounded-lg border border-[#EBEBEB] bg-white p-3 items-start'>
      <div className=''>
        <h4 className='overflow-hidden text-black text-sm not-italic font-normal'>
          Suresh Ramji Shah
        </h4>
        <div className=''>100%</div>
      </div>

      <div className=''>
        <p>
          ID: <span>1234KHA1</span>
        </p>
        <p>
          MOB NO: <span>8278101922</span>
        </p>
      </div>
    </div>
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
