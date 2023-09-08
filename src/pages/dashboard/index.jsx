import { Link } from 'react-router-dom';

const Dashboard = () => {
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
        to='/lead/address-details'
      >
        go-to-address-details-page
      </Link>
    </div>
  );
};

export default Dashboard;
