import { useContext, useState } from 'react';
import CaseAssignment from '../../assets/icons/caseAssignment';
import MasterManagement from '../../assets/icons/masterManagement';
import StepsConfiguration from '../../assets/icons/stepsConfiguration';
import UserManagement from '../../assets/icons/userManagement';
import indiaShelterLogo from '../../assets/logo.svg';
import DropDown from '../DropDown';
import SideBarLogout from '../../assets/icons/sideBarLogout';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import { logout } from '../../global';

const userOptions = [
  {
    label: 'Loan Officer',
    value: 'Loan Officer',
  },
  // {
  //   label: 'Admin',
  //   value: 'Admin',
  // },
];

const userTabs = [
  {
    key: 'Loan Officer',
    tabs: [
      {
        icon: (isActive) => <UserManagement isActive={isActive} />,
        label: 'User management',
        link: '/admin/user-management',
      },
      // {
      //   icon: (isActive) => <MasterManagement isActive={isActive} />,
      //   label: 'Master management',
      //   link: '/admin/master-management',
      // },
      // {
      //   icon: (isActive) => <StepsConfiguration isActive={isActive} />,
      //   label: 'Steps configuration',
      //   link: '/admin/step-configuration',
      // },
      // {
      //   icon: (isActive) => <CaseAssignment isActive={isActive} />,
      //   label: 'Case assignment',
      //   link: '/admin/case-assignment',
      // },
    ],
  },
  {
    key: 'Admin',
    tabs: [
      {
        icon: (isActive) => <UserManagement isActive={isActive} />,
        label: 'User management',
      },
      {
        icon: (isActive) => <MasterManagement isActive={isActive} />,
        label: 'Master management',
      },
    ],
  },
];

export default function SideBar() {
  const [user, setUser] = useState('Loan Officer');
  const [activeTab, setActiveTab] = useState('User management');
  const { token } = useContext(AuthContext);

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

  return (
    <nav className='h-screen flex flex-col w-full shrink-0 border-r border-lighter-grey'>
      <div className='px-6 py-4'>
        <img src={indiaShelterLogo} alt='India Shelter' style={{ height: '36px' }} />
        <p className='mt-2 text-primary-red text-sm'>iTrust & Agile admin</p>
      </div>
      <div className='px-6'>
        <div className='h-px bg-lighter-grey'></div>
      </div>
      <div className='px-6 pt-6 pb-2'>
        <DropDown
          label='CHOOSE USER'
          name='dashboardUser'
          options={userOptions}
          defaultSelected={user}
          onChange={(value) => setUser(value)}
          labelClassName={'!text-light-grey mb-2 text-xs text-[10px] font-medium'}
          disabledError
        />
      </div>

      <div className='py-4 grow text-light-grey'>
        {userTabs
          .find((userTab) => userTab.key === user)
          .tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <Link to={tab.link} key={tab.label}>
                <button
                  key={tab.label}
                  className='flex py-[14px] mb-1 items-center w-full'
                  onClick={() => setActiveTab(tab.label)}
                >
                  <div className={`w-1 rounded-sm ${isActive && 'bg-primary-red'} h-6 mr-6`}></div>
                  {tab.icon(isActive)}
                  <p className={`${isActive && 'text-primary-red'} ml-2 text-sm`}>{tab.label}</p>
                </button>
              </Link>
            );
          })}
      </div>
      <div className='px-6'>
        <div className='h-px bg-lighter-grey'></div>
      </div>
      <div className='mx-7 my-[30px] mr-auto flex items-center cursor-pointer'>
        <SideBarLogout />
        <p className='ml-2 text-light-grey text-sm' onClick={handleLogout}>
          Log out
        </p>
      </div>
    </nav>
  );
}
