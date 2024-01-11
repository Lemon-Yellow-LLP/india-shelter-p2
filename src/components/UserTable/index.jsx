import UserRow from '../UserRow';

const TableHeaderList = [
  'EMPLOYEE CODE',
  'EMPLOYEE NAME',
  'BRANCH',
  'ROLE',
  'MOBILE NUMBER',
  'CREATED ON',
  'STATUS',
  'ACTION',
];

const UserTable = ({ userslist }) => {
  return (
    <div className='w-full'>
      <table>
        <thead>
          <tr>
            {TableHeaderList.map((heading, i) => (
              <th className='text-dark-grey font-medium text-xs leading-5 p-4' key={i}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userslist.map((user, i) => (
            <UserRow user={user} key={user.employee_code} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserTable;
