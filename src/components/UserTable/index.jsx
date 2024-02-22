import { useEffect, useState } from 'react';
import NoUsersOnSearchIcon from '../../assets/icons/NoUsersOnSearch';
import UserRow from '../UserRow';

const TableHeaderList = [
  'EMPLOYEE CODE',
  'EMPLOYEE NAME',
  'BRANCH',
  'ROLE',
  'MOBILE NUMBER',
  'LAST MODIFIED',
  'STATUS',
  'ACTION',
];

const UserTable = ({ userslist }) => {
  const [adminStatusPopupId, setAdminStatusPopupId] = useState(null);
  const [adminActionPopupId, setAdminActionPopupId] = useState(null);

  const handleAdminStatusPopupId = (index) => {
    setAdminActionPopupId(null);
    if (adminStatusPopupId === index) {
      setAdminStatusPopupId(null);
    } else {
      setAdminStatusPopupId(index);
    }
  };

  const handleAdminActionPopupId = (index) => {
    setAdminStatusPopupId(null);
    if (adminActionPopupId === index) {
      setAdminActionPopupId(null);
    } else {
      setAdminActionPopupId(index);
    }
  };

  return (
    <div className='custom-table h-[570px]'>
      {!userslist.length ? (
        <div className='flex justify-center items-center h-full'>
          <NoUsersOnSearchIcon />
        </div>
      ) : (
        <table className=' w-full'>
          <thead>
            <tr>
              {TableHeaderList.map((heading, i) => (
                <th
                  className='text-dark-grey font-medium text-xs leading-5 p-4 bg-white text-left'
                  key={i}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {userslist.map((user, i) => (
              <UserRow
                user={user}
                key={user.id}
                i={i}
                isAdminStatusPopupOpen={adminStatusPopupId === i}
                handleAdminStatusPopupId={handleAdminStatusPopupId}
                setAdminStatusPopupId={setAdminStatusPopupId}
                isAdminActionPopupId={adminActionPopupId === i}
                handleAdminActionPopupId={handleAdminActionPopupId}
                setAdminActionPopupId={setAdminActionPopupId}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default UserTable;
