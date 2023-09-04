import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Dashboard</h1>
      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead'
      >
        Applicant Form Test Button
      </Link>

      <Link
        style={{ borderRadius: '10px', border: '1px solid gray', padding: '20px', width: '300px' }}
        to='/lead/reference-details'
      >
        go-to-reference-details-page
      </Link>
    </div>
  );
};

export default Dashboard;
