import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import AdminPagination from '../../../components/AdminPagination/index.jsx';
import UserTable from '../../../components/UserTable';
import { LeadContext } from '../../../context/LeadContextProvider.jsx';
import Searchbox from '../../../components/Searchbox.jsx';
import { DropDown } from '../../../components/index.jsx';
import NoUsersOnSearchIcon from '../../../assets/icons/NoUsersOnSearch.jsx';
import FormPopUp from '../../../components/FormPopUp/index.jsx';
import AdminHeader from '../../../components/Header/AdminHeader.jsx';

const userslist = [
  {
    employee_code: 'ISFC0913',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0914',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0915',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0916',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0917',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0918',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0919',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0920',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0921',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0922',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0923',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0924',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0925',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0926',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0927',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0928',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0929',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0930',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0931',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0932',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0933',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0934',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0935',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },

  {
    employee_code: 'ISFC0936',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0937',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0938',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0939',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0940',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0941',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0942',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0943',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0944',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0945',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'Active',
  },
  {
    employee_code: 'ISFC0946',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
  {
    employee_code: 'ISFC0947',
    employee_name: 'Suresh Ramji',
    branch: 'Gurugram',
    role: 'Branch Officer',
    mobile_number: '9238329132',
    created_on: '09/11/2023',
    status: 'InActive',
  },
];

const filterOptions = [
  { label: 'All users', value: 'All users' },
  { label: 'Active users', value: 'Active' },
  { label: 'Inactive users', value: 'InActive' },
];

const UserManagement = () => {
  const { userStatus, userAction, setUserStatus, setUserAction } = useContext(LeadContext);

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadList, setLeadList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [query, setQuery] = useState('');

  const [filteredList, dispatch] = useReducer(UserReducer, []);

  const [emptyState, setEmptyState] = useState(false);

  function UserReducer(state, action) {
    switch (action.type) {
      case 'All users': {
        return leadList;
      }
      case 'Active': {
        return leadList.filter((lead) => lead.status == action.payload);
      }
      case 'InActive': {
        return leadList.filter((lead) => lead.status === action.payload);
      }
      case 'Search': {
        const searchedList = leadList.filter(
          (lead) =>
            lead.employee_code.toLowerCase().includes(query) || lead.employee_code.includes(query),
        );

        if (searchedList.length) {
          return searchedList;
        } else {
          return [];
        }
      }
      default:
        return state;
    }
  }

  const handleChange = (event, value) => {
    setCurrentPage(value);
    // Assuming each page contains a fixed number of items, let's say 10 items per page
    const itemsPerPage = 10;

    // Calculate the start and end count based on the current page
    const startCount = (value - 1) * itemsPerPage;
    const endCount = value * itemsPerPage - 1;

    if (filteredList.length) {
      setDisplayedList(
        filteredList.filter((lead, i) => {
          return i >= startCount && i <= endCount;
        }),
      );
    } else {
      setDisplayedList(
        leadList.filter((lead, i) => {
          return i >= startCount && i <= endCount;
        }),
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setEmptyState(false);
    setCurrentPage(1);

    dispatch({ type: 'Search', payload: 'Search' });

    // const searchedList = leadList.filter((lead) => {
    //   return lead.employee_code.toLowerCase().includes(query) || lead.employee_code.includes(query);
    // });

    // setSearchedList(searchedList);

    // setCount(Math.ceil(searchedList.length / 10));

    // setDisplayedList(
    //   searchedList.filter((lead, i) => {
    //     return i < 10;
    //   }),
    // );
  };

  const handleResetSearch = () => {
    setQuery('');
    dispatch({ type: 'All users', payload: 'All users' });
    setCurrentPage(1);
    setEmptyState(false);
    // setCount(Math.ceil(leadList.length / 10));
    // setSearchedList([]);

    // setDisplayedList(
    //   leadList.filter((lead, i) => {
    //     return i < 10;
    //   }),
    // );
  };

  const handleUsersChange = useCallback(
    (value) => {
      if (value === 'All users') {
        dispatch({ type: value, payload: value });
      } else {
        dispatch({ type: value, payload: value });
      }
    },
    [displayedList],
  );

  useEffect(() => {
    setTimeout(() => {
      setLeadList(userslist);
      setCount(Math.ceil(userslist.length / 10));
    }, 2000);
  }, []);

  useEffect(() => {
    setDisplayedList(
      leadList.filter((lead, i) => {
        return i < 10;
      }),
    );
  }, [leadList]);

  // Need to use while api integration
  // useEffect(() => {
  //   if (userStatus) {
  //     console.log('call status change api');
  //     setUserStatus('');
  //   }
  // }, [userStatus]);

  // useEffect(() => {
  //   if (userAction) {
  //     console.log('call action change api');
  //     setUserAction('');
  //   }
  // }, [userAction]);

  useEffect(() => {
    setCount(Math.ceil(filteredList.length / 10));
    setDisplayedList(filteredList.filter((_, i) => i < 10));
    setCurrentPage(1);
  }, [filteredList]);

  useEffect(() => {
    if (!displayedList.length) {
      setEmptyState(!emptyState);
    }
  }, [displayedList]);

  // console.log(filteredList);
  console.log(displayedList);
  // console.log(userStatus);
  // console.log(userAction);
  // console.log(currentPage);

  const [show, setShow] = useState(false);

  return (
    <>
      <AdminHeader title='Manage users' showSearch={true} showButton={true} buttonText='Add User' />

      <FormPopUp showpopup={show} setShowPopUp={setShow} title='Terms and Conditions'>
        hi
      </FormPopUp>
      {leadList.length ? (
        <>
          <Searchbox
            query={query}
            setQuery={setQuery}
            handleSubmit={handleSearch}
            handleReset={handleResetSearch}
          />
          {!emptyState ? (
            <>
              <DropDown
                label='USERS'
                options={filterOptions}
                onChange={handleUsersChange}
                defaultSelected={filterOptions[0].value}
                inputClasses='mt-2'
              />
              <UserTable userslist={displayedList} />
              <AdminPagination
                currentPage={currentPage}
                count={count}
                handlePageChangeCb={handleChange}
              />
            </>
          ) : (
            <div className='w-full h-screen flex justify-center items-center bg-[#FAFAFA]'>
              <NoUsersOnSearchIcon />
            </div>
          )}
        </>
      ) : (
        'loading'
      )}
    </>
  );
};

export default UserManagement;
