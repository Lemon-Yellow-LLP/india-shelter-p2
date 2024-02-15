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
import { getUsersList, uploadDoc } from '../../../global/index.js';
import AdminActionControl from '../../../components/AdminActionControl/index.jsx';
import { filterOptions, filterDateOptions } from '../../../utils/index.js';

const UserManagement = () => {
  const {
    values,
    errors,
    touched,
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
    useradd,
  } = useContext(AuthContext);

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [emptyState, setEmptyState] = useState(false);

  const [leadList, setLeadList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [showActionControlPopup, setShowActionControlPopup] = useState(false);
  const [uploadPhotoLoader, setUploadPhotoLoader] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [profileUpload, setProfileUpload] = useState(null);

  const [filteredList, dispatch] = useReducer(UserReducer, []);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(false);

  const [selectionRange, setSelectionRange] = useState({
    startDate: parseISO(moment().subtract(30, 'days').format()),
    endDate: parseISO(moment().format()),
    key: 'selection',
  });

  useEffect(() => {
    async function uploadProfilePhoto() {
      console.log('running upload photo func');
      const data = new FormData();
      const filename = profilePhoto[0].name;
      data.append('employee_code', values?.employee_code);
      data.append('document_type', 'profile_photo');
      data.append('document_name', filename);
      data.append('file', profilePhoto[0]);

      let fileSize = data.get('file');

      if (fileSize.size <= 5000000) {
        const res = await uploadDoc(data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        });

        if (res) {
          setUploadPhotoLoader(false);
          setProfileUpload(res.document);
          console.log('setting profile upload', res.document);
        }
      }
    }
    profilePhoto.length > 0 && uploadProfilePhoto();
  }, [profilePhoto]);

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
      switch (value) {
        case 'Last 30 days': {
          const payload = {
            start_date: parseISO(moment().subtract(30, 'days').format()),
            end_date: parseISO(moment().format()),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload)
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log(error);
            });

          break;
        }
        case 'Today': {
          const payload = {
            start_date: parseISO(moment().format()),
            end_date: parseISO(moment().format()),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload)
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log(error);
            });

          break;
        }
        case 'Yesterday': {
          const payload = {
            start_date: parseISO(moment().subtract(1, 'days').format()),
            end_date: parseISO(moment().subtract(1, 'days').format()),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload)
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log(error);
            });

          break;
          // setLeadList();
        }
        case 'Last 7 days': {
          const payload = {
            start_date: parseISO(moment().subtract(7, 'days').format()),
            end_date: parseISO(moment().format()),
            page: 1,
            page_size: 10000000,
          };

          getUsersList(payload)
            .then((users) => {
              setLeadList(users.data);
              setCount(Math.ceil(users.data.length / 10));
            })
            .catch((error) => {
              console.log(error);
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
        start_date: selectionRange.startDate,
        end_date: moment(selectionRange.endDate).add(1, 'day'),
        page: 1,
        page_size: 10000000,
      };

      getUsersList(payload)
        .then((users) => {
          setLeadList(users.data);
          setCount(Math.ceil(users.data.length / 10));
        })
        .catch((error) => {
          console.log(error);
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
        setFieldValue(e.target.name, value);
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
      const payload = {
        start_date: selectionRange.startDate,
        end_date: selectionRange.endDate,
        page: 1,
        page_size: 10000000,
      };

      const users = await getUsersList(payload);

      setLeadList(users.data);
      setCount(Math.ceil(users.data.length / 10));
    };
    getUsers();
  }, [useradd]);

  //display users
  useEffect(() => {
    setDisplayedList(
      leadList.filter((lead, i) => {
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

  //add user
  const handleAddData = () => {
    handleSubmit();
    setUserAction('');
  };

  //call edit user if status is changed
  useEffect(() => {
    if (userStatus) {
      setShowActionControlPopup(true);
    }
  }, [userStatus]);

  const handleEditStatus = () => {
    setShow(false);
    setUserStatus('');
  };

  //call edit user if user edited or deleted
  useEffect(() => {
    if (userAction && userAction.value === 'Edit') {
      setShow(true);
    } else if (userAction) {
      setShowActionControlPopup(true);
    }
  }, [userAction]);

  const handleEditData = () => {
    if (userAction.value === 'Edit') {
      handleSubmit();
    } else {
      setShow(false);
    }
    setUserAction('');
  };

  return (
    <>
      <AdminHeader
        title='Manage users'
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
        showSearch={true}
        showButton={true}
        buttonText='Add User'
        prompt='Search for emp code, name, branch, mob number'
        handleButtonClick={() => setShow(true)}
      />

      {/* edit/ delete/ active/ inactive action popup */}
      <AdminActionControl
        title='Edit user'
        actionDescription='Would you like to save the changes?'
        showpopup={showActionControlPopup}
        setShowPopUp={setShowActionControlPopup}
        actionMsg='Yes, save'
        handleActionClick={userStatus.value ? handleEditStatus : handleEditData}
      />

      <FormPopUp
        showpopup={show}
        setShowPopUp={setShow}
        title={userAction.value ? 'Edit user' : 'Add user'}
        subTitle='Created on: Today'
        handleActionClick={userAction.value ? handleEditData : handleAddData}
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
              inputClasses='capitalize'
              divClasses='flex-1'
            />
            <TextInput
              label='Last Name'
              name='last_name'
              value={values?.last_name}
              onChange={handleTextChange}
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
              options={[
                {
                  label: 'Loan Officer',
                  value: 'loan_officer',
                },
                {
                  label: 'Admin',
                  value: 'admin',
                },
              ]}
              onChange={handleRoleChange}
              touched={touched && touched?.role}
              error={errors && errors?.role}
              onBlur={handleBlur}
              defaultSelected={values?.role}
              inputClasses='flex-1'
            />
          </div>
          <div className='flex gap-6'>
            <DropDown
              label='Branch'
              name='branch'
              required
              options={[
                {
                  label: 'Loan Officer',
                  value: 'loan_officer',
                },
                {
                  label: 'Admin',
                  value: 'admin',
                },
              ]}
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
              options={[
                {
                  label: 'Loan Officer',
                  value: 'loan_officer',
                },
                {
                  label: 'Admin',
                  value: 'admin',
                },
              ]}
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
              files={profilePhoto}
              setFile={setProfilePhoto}
              upload={profileUpload}
              setUploads={setProfileUpload}
              // setEdit={setEditProperty}
              label='Upload photo'
              required
              hint='Support: JPG, PNG'
              // setSingleFile={setPropertyPhotosFile}
              // errorMessage={
              //   preview === location.pathname &&
              //   values?.applicants?.[activeIndex]?.applicant_details?.extra_params
              //     ?.upload_required_fields_status?.property_image == false
              //     ? 'This field is mandatory'
              //     : ''
              // }
              message={uploadPhotoError}
              setMessage={setUploadPhotoError}
              loader={uploadPhotoLoader}
              setLoader={setUploadPhotoLoader}
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

      {/* {leadList.length ? ( */}
      <>
        {!emptyState ? (
          <div className='px-6 py-4 bg-medium-grey grow overflow-y-auto overflow-x-hidden'>
            <div className='flex justify-between w-full mb-4'>
              <DropDown
                label='USERS'
                options={filterOptions}
                onChange={handleUsersChange}
                defaultSelected={filterOptions[0].value}
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
        ) : (
          <div className='w-full h-screen flex justify-center items-center bg-[#FAFAFA]'>
            <NoUsersOnSearchIcon />
          </div>
        )}
      </>
      {/* ) : ( */}
      {/* <div className='w-full h-screen flex justify-center items-center bg-[#FAFAFA]'>
          <NoUsersAddedIcon />
        </div> */}
      {/* )} */}
    </>
  );
};

export default UserManagement;
