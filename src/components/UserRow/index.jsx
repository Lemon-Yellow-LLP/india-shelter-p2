import { useCallback, useContext, useEffect, useState } from 'react';
import { IconTick } from '../../assets/icons';
import OptionsIcon from '../../assets/icons/admin-options';
import { AuthContext } from '../../context/AuthContextProvider';
import moment from 'moment';

const UserRow = ({ user, i }) => {
  return (
    <tr
      className={`${
        i % 2 !== 0 ? 'bg-transparent' : 'bg-white'
      } text-primary-black font-normal text-sm`}
    >
      <td className='px-4 py-[11px]'>{user.employee_code}</td>
      <td className='px-4 py-[11px]'>
        {String(user.first_name + ' ' + user.middle_name + ' ' + user.last_name)}
      </td>
      <td className='px-4 py-[11px]'>{user.branch}</td>
      <td className='px-4 py-[11px]'>{user.role}</td>
      <td className='px-4 py-[11px]'>{user.mobile_number}</td>
      <td className='px-4 py-[11px]'>{moment(user.updated_at).format('do MMMM YYYY')}</td>
      <td className='px-4 py-[11px]'>
        <AdminStatus user={user} />
      </td>
      <td className='flex justify-start px-4 py-[11px]'>
        <AdminAction user={user} />
      </td>
    </tr>
  );
};

export default UserRow;

const AdminStatus = ({ user }) => {
  const options = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inActive' },
  ];

  const [popUpOpen, setPopUpOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(user.status);

  const { setUserStatus } = useContext(AuthContext);

  const handleSelect = useCallback(
    (option) => {
      setPopUpOpen(false);
      setUserStatus({ id: user.id, value: option.value });
    },
    [user],
  );

  useEffect(() => {
    setSelectedOption(user.status);
  }, [user]);

  return (
    <div className='relative'>
      <button
        onClick={() => setPopUpOpen(!popUpOpen)}
        className={`flex items-center w-24 px-3 py-1.5 justify-between ${
          selectedOption === 'active'
            ? 'bg-light-green  border-secondary-green'
            : 'bg-[#FFF1E3] border-[#EF8D32]'
        }  border-x border-y rounded-[20px]`}
      >
        {selectedOption === 'active' ? (
          <>
            <span className='text-secondary-green text-xs font-medium'>Active</span>
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4 6L8 10L12 6'
                stroke='#147257'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </>
        ) : (
          <>
            <span className='text-[#EF8D32] text-xs font-medium'>Inactive</span>
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4 6L8 10L12 6'
                stroke='#EF8D32'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </>
        )}
      </button>

      {popUpOpen && (
        <div className='w-32 rounded-lg bg-white shadow-secondary mt-2 absolute top-100 overflow-y-auto z-20 border border-stroke'>
          {options.map((option, index) => {
            let optionClasses = `py-3 px-4 flex justify-between w-full overflow-y-auto transition-colors duration-300 ease-out opacity-100
              ${index ? 'border-t border-stroke' : 'border-none'}
            `;

            if (option.value === selectedOption)
              optionClasses = `${optionClasses} text-primary-red`;
            else if (option.disabled) {
              optionClasses = `${optionClasses} pointer-events-none`;
            }

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={optionClasses}
              >
                <div className={option.disabled && 'opacity-20'}>{option.label}</div>
                {selectedOption === option.value ? (
                  <IconTick width={16} height={16} />
                ) : (
                  <div></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminAction = ({ user }) => {
  const options = [
    { label: 'Edit', value: 'Edit' },
    { label: 'Delete', value: 'Delete' },
  ];

  const [popUpOpen, setPopUpOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  const { setUserAction, setValues } = useContext(AuthContext);

  const handleSelect = useCallback(
    (option) => {
      setSelectedOption(option);
      setPopUpOpen(false);
      setUserAction({ id: user.id, value: option.value });
      const userMeta = {
        employee_code: user.employee_code,
        username: user.username,
        role: user.role,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        mobile_number: user.mobile_number,
        branch: user.branch,
        department: user.department,
        loimage: user.loimage,
      };
      setValues(userMeta);
    },
    [user],
  );

  return (
    <div className='relative'>
      <button onClick={() => setPopUpOpen(!popUpOpen)}>
        <OptionsIcon />
      </button>

      {popUpOpen && (
        <div className='w-32 rounded-lg bg-white shadow-secondary mt-2 absolute top-100 left-[-110px] overflow-y-auto z-20 border border-stroke'>
          {options.map((option, index) => {
            let optionClasses = `py-3 px-4 flex justify-between w-full overflow-y-auto transition-colors duration-300 ease-out opacity-100
              ${index ? 'border-t border-stroke' : 'border-none'}
            `;

            if (option.value === selectedOption?.value)
              optionClasses = `${optionClasses} text-primary-red`;
            else if (option.disabled) {
              optionClasses = `${optionClasses} pointer-events-none`;
            }

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={optionClasses}
              >
                <div className={option.disabled && 'opacity-20'}>{option.label}</div>
                {selectedOption?.value === option.value ? (
                  <IconTick width={16} height={16} />
                ) : (
                  <div></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
