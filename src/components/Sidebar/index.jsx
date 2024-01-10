import { useState } from 'react';
import CaseAssignment from '../../assets/icons/caseAssignment';
import MasterManagement from '../../assets/icons/masterManagement';
import StepsConfiguration from '../../assets/icons/stepsConfiguration';
import UserManagement from '../../assets/icons/userManagement';
import indiaShelterLogo from '../../assets/logo.svg';
import DropDown from '../DropDown';
import SideBarLogout from '../../assets/icons/sideBarLogout';

const userOptions = [
  {
    label: 'Loan Officer',
    value: 'loan officer',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
];

const userTabs = [
  {
    key: 'loan officer',
    tabs: [
      {
        icon: (isActive) => <UserManagement isActive={isActive} />,
        label: 'User management',
      },
      {
        icon: (isActive) => <MasterManagement isActive={isActive} />,
        label: 'Master management',
      },
      {
        icon: (isActive) => <StepsConfiguration isActive={isActive} />,
        label: 'Steps configuration',
      },
      {
        icon: (isActive) => <CaseAssignment isActive={isActive} />,
        label: 'Case assignment',
      },
    ],
  },
  {
    key: 'admin',
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
  const [user, setUser] = useState('loan officer');
  const [activeTab, setActiveTab] = useState(null);

  return (
    <nav className='h-screen flex flex-col w-[252px] border-r border-lighter-grey'>
      <div className='px-6 py-4'>
        <img src={indiaShelterLogo} alt='India Shelter' style={{ height: '36px' }} />
        <p className='mt-2 text-primary-red text-sm'>iTrust & Agile admin</p>
      </div>
      <div className='px-6'>
        <div className='h-px bg-lighter-grey'></div>
      </div>
      <div className='px-6 pt-6 pb-4'>
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
      <div className='px-6'>
        <div className='h-px bg-lighter-grey'></div>
      </div>
      <div className='py-4 grow text-light-grey'>
        {userTabs
          .filter((userTab) => userTab.key === user)[0]
          .tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                className='flex py-[14px] mb-1 items-center w-full'
                onClick={() => setActiveTab(tab.label)}
              >
                <div className={`w-1 rounded-sm ${isActive && 'bg-primary-red'} h-6 mr-6`}></div>
                {tab.icon(isActive)}
                <p className={`${isActive && 'text-primary-red '} ml-2 text-sm`}>{tab.label}</p>
              </button>
            );
          })}
      </div>
      <div className='px-6'>
        <div className='h-px bg-lighter-grey'></div>
      </div>
      <div className='mx-7 my-[30px] mr-auto flex items-center cursor-pointer'>
        <SideBarLogout />
        <p className='ml-2 text-light-grey text-sm'>Log out</p>
      </div>
    </nav>
  );
}
