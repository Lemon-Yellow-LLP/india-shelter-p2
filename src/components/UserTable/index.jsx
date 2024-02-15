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
  return (
    <div className='custom-table h-[570px]'>
      <table className='w-full'>
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
            <UserRow user={user} key={user.id} i={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserTable;
