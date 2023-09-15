import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { testLogout } from '../../global';
import { AuthContext } from '../../context/AuthContextProvider';

const Dashboard = () => {
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

export default Dashboard;
