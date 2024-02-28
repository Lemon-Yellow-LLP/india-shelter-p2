import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import AdminPagination from '../../../components/AdminPagination/index.jsx';
import UserTable from '../../../components/UserTable';
import { Button, DropDown, TextInput } from '../../../components/index.jsx';
import NoUsersOnSearchIcon from '../../../assets/icons/NoUsersOnSearch.jsx';
import FormPopUp from '../../../components/FormPopUp/index.jsx';
import AdminHeader from '../../../components/Header/AdminHeader.jsx';
import moment from 'moment';
import { parseISO } from 'date-fns';
import AdminDateRangePicker from '../../../components/AdminDateRangePicker/index.jsx';
import { AuthContext } from '../../../context/AuthContextProvider.jsx';
import AdminFormImageUpload from '../../../components/ImageUpload/AdminFormImageUpload.jsx';
import {
  deleteUser,
  editUser,
  getAllDbUsers,
  getUserBranches,
  getUserDepartments,
  getUserRoles,
  getUsersList,
  uploadDoc,
} from '../../../global/index.js';
import AdminActionControl from '../../../components/AdminActionControl/index.jsx';
import { filterOptions, filterDateOptions } from '../../../utils/index.js';
import AdminToastMessage from '../../../components/ToastMessage/AdminToast.jsx';

const UserManagement = () => {
  const {
    values,
    initialValues,
    setValues,
    errors,
    setErrors,
    touched,
    setTouched,
    setFieldValue,
    handleBlur,
    token,
    userStatus,
    userAction,
    setUserStatus,
    setUserAction,
    handleSubmit,
    show,
    setShow,
    showActionControlPopup,
    setShowActionControlPopup,
    useradd,
    setUseradd,
    userToastMessage,
    setUserToastMessage,
    toastType,
    setToastType,
    loData,
  } = useContext(AuthContext);

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [emptyState, setEmptyState] = useState(false);

  const [allDbUsers, setAllDbUsers] = useState([]);
  const [leadList, setLeadList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [uploadPhotoLoader, setUploadPhotoLoader] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState('');

  const [filteredList, dispatch] = useReducer(UserReducer, []);

  const [dateState, setDateState] = useState(filterDateOptions[0].value);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(false);

  const [selectionRange, setSelectionRange] = useState({
    startDate: parseISO(moment().subtract(30, 'days').format('YYYY-MM-DD')),
    endDate: parseISO(moment().add(1, 'day').format('YYYY-MM-DD')),
    key: 'selection',
  });

  const [userDropDownData, setUserDropDownData] = useState({
    roles: [],
    branches: [],
    departments: [],
  });

  function UserReducer(state, action) {
    switch (action.type) {
      case 'All users': {
        return leadList;
      }
      case 'active': {
        return leadList.filter((lead) => lead.status == action.payload);
      }
      case 'inActive': {
        return leadList.filter(
          (lead) => lead.status === action.payload || lead.status !== 'active',
        );
      }
      case 'Search': {
        const searchedList = allDbUsers.filter((lead) => {
          let value = query.trim();
          return (
            lead.employee_code?.toLowerCase().includes(value) ||
            lead.employee_code?.includes(value) ||
            lead.branch?.toLowerCase().includes(value) ||
            lead.branch?.includes(value) ||
            lead.role?.toLowerCase().includes(value) ||
            lead.role?.includes(value) ||
            lead.mobile_number?.includes(value)
          );
        });

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

  //pagination filter
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

  //search filter
  const handleSearch = (e) => {
    e.preventDefault();

    setEmptyState(false);
    setCurrentPage(1);

    dispatch({ type: 'Search', payload: 'Search' });
  };

  //reset search filter
  const handleResetSearch = () => {
    setQuery('');
    dispatch({ type: 'All users', payload: 'All users' });
    setCurrentPage(1);
    setEmptyState(false);
  };

  //active Inactive filter
  const handleUsersChange = useCallback(
    (value) => {
      dispatch({ type: value, payload: value });
    },
    [displayedList],
  );

  //date filter
  const handleDateChange = useCallback(
    (value) => {
      setDateState(value);

      switch (value) {
        case 'Last 30 days': {
          const payload = {
            start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            end_date: moment().add(1, 'day').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Today': {
          const payload = {
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().add(1, 'days').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Yesterday': {
          const payload = {
            start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
            yesterday: true,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Last 7 days': {
          const payload = {
            start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            end_date: moment().add(1, 'day').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Range': {
          setOpen(true);
          setRange(true);
          break;
        }
        default:
          return value;
      }
    },
    [displayedList],
  );

  useEffect(() => {
    if (range) {
      const payload = {
        start_date: moment(selectionRange.startDate).format('YYYY-MM-DD'),
        end_date: moment(selectionRange.endDate).add(1, 'day').format('YYYY-MM-DD'),
        page: 1,
        page_size: 10000000,
      };

      getUsersList(payload, {
        headers: {
          Authorization: token,
        },
      })
        .then((users) => {
          setLeadList(users.data);
          setCount(Math.ceil(users.data.length / 10));
        })
        .catch((error) => {
          console.log('GET_USERLIST_ERROR', error);
        });
    }
  }, [selectionRange]);

  //form handlers
  const handleEmpCodeChange = useCallback(
    (e) => {
      let value = e.target.value;
      value = value.trimStart().replace(/\s\s+/g, ' ');
      // emp code should take either of alphabets or digits (max char limit 10)
      const pattern = /^[a-zA-Z0-9]*$/;
      if (pattern.exec(value)) {
        setFieldValue(e.target.name, value.toUpperCase());
      }
    },
    [setFieldValue, values?.employee_code],
  );

  const handleFirstNameChange = useCallback(
    (e) => {
      let first_name = e.target.value;
      first_name = first_name.trimStart().replace(/\s\s+/g, ' ');
      // emp code should take either of alphabets or digits (max char limit 10)
      const pattern = /^[a-zA-Z]*$/;
      if (pattern.exec(first_name)) {
        setFieldValue(e.target.name, first_name.charAt(0).toUpperCase() + first_name.slice(1));
      }
    },
    [setFieldValue, values?.first_name],
  );

  const handleTextChange = useCallback(
    (e) => {
      let value = e.target.value;
      value = value.trimStart().replace(/\s\s+/g, ' ');
      const pattern = /^[a-zA-Z]*$/;
      if (pattern.exec(value)) {
        setFieldValue(e.target.name, value.charAt(0).toUpperCase() + value.slice(1));
      }
    },
    [setFieldValue],
  );

  const handleMobileNumberChange = useCallback(
    (e) => {
      const value = e.target.value;
      const phoneNumber = value.trimStart().replace(/\s\s+/g, ' ');
      const pattern = /[^\d]/g;
      if (pattern.test(phoneNumber)) {
        e.preventDefault();
        return;
      }

      if (phoneNumber < 0) {
        e.preventDefault();
        return;
      }

      if (phoneNumber.length > 10) {
        return;
      }

      if (
        phoneNumber.charAt(0) === '0' ||
        phoneNumber.charAt(0) === '1' ||
        phoneNumber.charAt(0) === '2' ||
        phoneNumber.charAt(0) === '3' ||
        phoneNumber.charAt(0) === '4' ||
        phoneNumber.charAt(0) === '5'
      ) {
        e.preventDefault();
        return;
      }

      setFieldValue(`mobile_number`, phoneNumber);
      setFieldValue(`username`, phoneNumber);
    },
    [values?.mobile_number],
  );

  const handleRoleChange = useCallback((value) => setFieldValue('role', value), [values?.role]);

  const handleBranchChange = useCallback(
    (value) => setFieldValue('branch', value),
    [values?.branch],
  );

  const handleDepartmentChange = useCallback(
    (value) => setFieldValue('department', value),
    [values?.department],
  );

  //fetch users
  useEffect(() => {
    const getUsers = async () => {
      switch (dateState) {
        case 'Last 30 days': {
          const payload = {
            start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            end_date: moment().add(1, 'day').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          try {
            const users = await getUsersList(payload, {
              headers: {
                Authorization: token,
              },
            });
            setLeadList(users.data);
            setCount(Math.ceil(users.data.length / 10));
          } catch (error) {
            console.log('GET_USERLIST_ERROR', error);
          }

          break;
        }
        case 'Today': {
          const payload = {
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().add(1, 'days').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Yesterday': {
          const payload = {
            start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
            yesterday: true,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Last 7 days': {
          const payload = {
            start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
            end_date: moment().add(1, 'day').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        case 'Range': {
          const payload = {
            start_date: moment(selectionRange.startDate).format('YYYY-MM-DD'),
            end_date: moment(selectionRange.endDate).add(1, 'day').format('YYYY-MM-DD'),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload, {
            headers: {
              Authorization: token,
            },
          })
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log('GET_USERLIST_ERROR', error);
            });

          break;
        }
        default: {
        }
      }
    };
    getUsers();
  }, [useradd]);

  //fetch roles, branches, departments
  useEffect(() => {
    Promise.all([
      getUserRoles({
        headers: {
          Authorization: token,
        },
      }),
      getUserBranches({
        headers: {
          Authorization: token,
        },
      }),
      getUserDepartments({
        headers: {
          Authorization: token,
        },
      }),
      getAllDbUsers({
        headers: {
          Authorization: token,
        },
      }),
    ])
      .then((data) => {
        const roles = data[0].map((obj) => {
          if (loData?.user.role !== obj.role) return { label: obj.role, value: obj.role };
        });
        const branches = data[1].map((obj) => {
          return { label: obj.branch, value: obj.branch };
        });
        const departments = data[2].map((obj) => {
          return { label: obj.department, value: obj.department };
        });
        setAllDbUsers(data[3]);

        setUserDropDownData({
          roles: roles,
          branches: branches,
          departments: departments,
        });
      })
      .catch((error) => console.log('GET_DROPDOWN_DATA_ERR', error));
  }, []);

  //display users
  useEffect(() => {
    dispatch({ type: 'All users', payload: 'All users' });
    setDisplayedList(
      leadList.filter((_, i) => {
        return i < 10;
      }),
    );
  }, [leadList]);

  //set filtered users
  useEffect(() => {
    setCount(Math.ceil(filteredList.length / 10));
    setDisplayedList(filteredList.filter((_, i) => i < 10));
    setCurrentPage(1);
  }, [filteredList]);

  //set empty state if no leads found in search
  useEffect(() => {
    if (!displayedList.length && query) {
      setEmptyState(!emptyState);
    }
  }, [displayedList]);

  //open confirmation pop up on basis of status change
  useEffect(() => {
    if (userStatus) {
      setShowActionControlPopup(true);
    }
  }, [userStatus]);

  //open form popup if action is edit or else open confirmation pop up if action is delete
  useEffect(() => {
    if (userAction && userAction?.value === 'Edit') {
      setShow(true);
    } else if (userAction && userAction?.value === 'Delete') {
      setShowActionControlPopup(true);
    }
  }, [userAction]);

  //call api's on basis of user action confirmation
  const handleDataChange = () => {
    if (userStatus) {
      const isactive = userStatus.value === 'active' ? true : false;

      editUser(
        userStatus.id,
        { status: userStatus.value, is_active: isactive },
        {
          headers: {
            Authorization: token,
          },
        },
      )
        .then((editedUser) => {
          setToastType('success');
          setUserToastMessage('Changes saved successfully!');
          setUseradd(editedUser);
        })
        .catch((error) => {
          console.log('EDIT_USER_ERROR', error);
          setToastType('error');
          setUserToastMessage(`Changes couldn't be saved!`);
        });

      setUserStatus(null);
      setShowActionControlPopup(false);
    } else if (userAction.value === 'Edit') {
      handleSubmit();
    } else {
      deleteUser(userAction.id, {
        headers: {
          Authorization: token,
        },
      })
        .then((data) => {
          setToastType('success');
          setUserToastMessage('User deleted successfully!');
          setUseradd(data);
          setValues(initialValues);
        })
        .catch((error) => {
          console.log('DELETE_USER_ERROR', error);
          setToastType('error');
          setUserToastMessage(`User couldn't be deleted!`);
          setValues(initialValues);
        });

      setUserAction(null);
      setShowActionControlPopup(false);
    }
  };

  // console.log(leadList);
  // console.log(resetDate);
  // console.log(resetFilter);
  // console.log(userDropDownData);
  // console.log(toastType);
  // console.log(values);
  // console.log(errors);
  // console.log(token);
  // console.log(userDropDownData.roles);
  // console.log(loData);
  // console.log('open', open);
  // console.log('range', range);
  // console.log('dropdown-state', dateState);
  // console.log(allDbUsers);

  return (
    <>
      <AdminToastMessage
        message={userToastMessage}
        setMessage={setUserToastMessage}
        state={toastType}
      />

      <AdminHeader
        title='Manage users'
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
        showSearch={true}
        showButton={true}
        buttonText='Add User'
        prompt='Search for emp code, role, branch, mob number'
        handleButtonClick={() => setShow(true)}
      />

      {/* edit/ delete/ active/ inactive action popup */}
      <AdminActionControl
        title={
          userStatus
            ? userStatus?.value === 'active'
              ? 'Activate user'
              : 'Inactivate user'
            : userAction?.value === 'Edit'
            ? 'Edit user'
            : 'Delete user'
        }
        subtitle={
          userStatus
            ? userStatus?.value === 'active'
              ? 'Would you like to activate this user?'
              : 'Would you like to inactivate this user?'
            : userAction?.value === 'Edit'
            ? 'Would you like to save the changes?'
            : 'Would you like to delete this user?'
        }
        actionMsg={
          userStatus
            ? userStatus?.value === 'active'
              ? 'Yes, activate'
              : 'Yes, inactivate'
            : userAction?.value === 'Edit'
            ? 'Yes, save'
            : 'Yes, delete'
        }
        showpopup={showActionControlPopup}
        setShowPopUp={setShowActionControlPopup}
        handleActionClick={handleDataChange}
        handleResetAction={
          userStatus
            ? () => setUserStatus(null)
            : () => {
                setUserAction(null);
                setValues(initialValues);
                setErrors(null);
                // reset touched for all fields
                const newTouched = {};
                Object.keys(initialValues).forEach((key) => {
                  newTouched[key] = false;
                });
                setTouched(newTouched);
              }
        }
      />

      <FormPopUp
        title={userAction ? 'Edit user' : 'Add user'}
        subTitle='Created on: Today'
        actionMsg={userAction ? 'Save' : 'Confirm'}
        showpopup={show}
        setShowPopUp={setShow}
        handleActionClick={
          userAction
            ? () => {
                if (!Object.keys(errors).length) {
                  setShowActionControlPopup(true);
                  setShow(false);
                }
              }
            : handleSubmit
        }
        handleResetAction={() => {
          setValues(initialValues);
          // reset all errors
          setErrors(null);
          // reset touched for all fields
          const newTouched = {};
          Object.keys(initialValues).forEach((key) => {
            newTouched[key] = false;
          });
          setTouched(newTouched);
          setUserAction(null);
        }}
      >
        <div className='p-6 overflow-y-scroll overflow-x-hidden flex flex-col gap-y-4'>
          <div className='flex gap-6'>
            <TextInput
              label='Emp code'
              required
              name='employee_code'
              value={values?.employee_code}
              onChange={handleEmpCodeChange}
              error={errors?.employee_code}
              touched={touched?.employee_code}
              onBlur={handleBlur}
              disabled={!!userAction}
              divClasses='flex-1'
            />
            <TextInput
              label='First Name'
              required
              name='first_name'
              value={values?.first_name}
              error={errors?.first_name}
              touched={touched?.first_name}
              onBlur={handleBlur}
              onChange={handleFirstNameChange}
              inputClasses='capitalize'
              divClasses='flex-1'
            />
          </div>
          <div className='flex gap-6'>
            <TextInput
              label='Middle Name'
              name='middle_name'
              value={values?.middle_name}
              onChange={handleTextChange}
              error={errors?.middle_name}
              touched={touched?.middle_name}
              onBlur={handleBlur}
              inputClasses='capitalize'
              divClasses='flex-1'
            />
            <TextInput
              label='Last Name'
              name='last_name'
              value={values?.last_name}
              onChange={handleTextChange}
              error={errors?.last_name}
              touched={touched?.last_name}
              onBlur={handleBlur}
              inputClasses='capitalize'
              divClasses='flex-1'
            />
          </div>
          <div className='flex gap-6'>
            <TextInput
              label='Mobile number'
              required
              type='tel'
              name='mobile_number'
              value={values?.mobile_number}
              onChange={handleMobileNumberChange}
              error={errors?.mobile_number}
              touched={touched?.mobile_number}
              onBlur={handleBlur}
              divClasses='flex-1'
            />
            <DropDown
              label='Role'
              name='role'
              required
              options={userDropDownData.roles}
              onChange={handleRoleChange}
              touched={touched && touched?.role}
              error={errors && errors?.role}
              onBlur={handleBlur}
              defaultSelected={values?.role}
              inputClasses='flex-1'
              disabled={!!userAction}
            />
          </div>
          <div className='flex gap-6'>
            <DropDown
              label='Branch'
              name='branch'
              required
              options={userDropDownData.branches}
              onChange={handleBranchChange}
              touched={touched && touched?.branch}
              error={errors && errors?.branch}
              onBlur={handleBlur}
              defaultSelected={values?.branch}
              inputClasses='flex-1'
            />
            <DropDown
              label='Department'
              name='department'
              required
              options={userDropDownData.departments}
              onChange={handleDepartmentChange}
              touched={touched && touched?.department}
              error={errors && errors?.department}
              onBlur={handleBlur}
              defaultSelected={values?.department}
              inputClasses='flex-1'
            />
          </div>
          <div>
            <AdminFormImageUpload
              upload={values.loimage}
              label='Upload photo'
              required
              hint='Support: JPG, PNG'
              errorMessage={errors && errors?.loimage ? 'This field is mandatory' : ''}
              onBlur={handleBlur}
              touched={touched && touched.loimage}
              message={uploadPhotoError}
              setMessage={setUploadPhotoError}
              loader={uploadPhotoLoader}
              setLoader={setUploadPhotoLoader}
              edit={!!userAction}
            />
          </div>
        </div>
      </FormPopUp>

      {open ? (
        <div className='fixed inset-0 w-full bg-black bg-opacity-50' style={{ zIndex: 99 }}>
          <AdminDateRangePicker
            selectionRange={selectionRange}
            setSelectionRange={setSelectionRange}
            open={open}
            setOpen={setOpen}
          />
        </div>
      ) : null}

      <>
        <div
          className={`px-6 py-4 bg-medium-grey grow overflow-y-auto overflow-x-hidden ${
            emptyState && 'hidden'
          }`}
        >
          <div className='flex justify-between w-full mb-4'>
            <DropDown
              label='USERS'
              options={filterOptions}
              onChange={handleUsersChange}
              defaultSelected={filterOptions[0].value}
              resetDefaultSelected={!query ? query : null}
              inputClasses='w-[170px] h-14'
              labelClassName='text-xs font-medium !text-dark-grey'
              styles='h-8 items-center text-xs px-3 py-2 rounded-[4px]'
            />

            <DropDown
              label='DATE'
              options={filterDateOptions}
              onChange={handleDateChange}
              defaultSelected={filterDateOptions[0].value}
              inputClasses='w-[170px] h-14'
              labelClassName='text-xs font-medium !text-dark-grey'
              styles='h-8 items-center text-xs px-3 py-2 rounded-[4px]'
              optionsMaxHeight='220'
            />
          </div>

          <UserTable userslist={displayedList} />

          <AdminPagination
            count={count}
            currentPage={currentPage}
            handlePageChangeCb={handleChange}
            inputClasses=' flex justify-end mt-3'
          />
        </div>

        {emptyState ? (
          <div className='w-full h-screen flex justify-center items-center bg-[#FAFAFA] grow overflow-y-auto overflow-x-hidden'>
            <NoUsersOnSearchIcon />
          </div>
        ) : null}
      </>
    </>
  );
};

export default UserManagement;
