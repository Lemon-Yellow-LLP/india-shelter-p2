import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import AdminPagination from '../../../components/AdminPagination/index.jsx';
import UserTable from '../../../components/UserTable';
import { LeadContext } from '../../../context/LeadContextProvider.jsx';
import { DropDown, TextInput } from '../../../components/index.jsx';
import NoUsersOnSearchIcon from '../../../assets/icons/NoUsersOnSearch.jsx';
import FormPopUp from '../../../components/FormPopUp/index.jsx';
import AdminHeader from '../../../components/Header/AdminHeader.jsx';
import moment from 'moment';
import { parseISO } from 'date-fns';
import AdminDateRangePicker from '../../../components/AdminDateRangePicker/index.jsx';
import NoUsersAddedIcon from '../../../assets/icons/no-users-added.jsx';
import { AuthContext } from '../../../context/AuthContextProvider.jsx';
import AdminFormImageUpload from '../../../components/ImageUpload/AdminFormImageUpload.jsx';
import { uploadDoc } from '../../../global/index.js';
import AdminActionControl from '../../../components/AdminActionControl/index.jsx';

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

const filterDateOptions = [
  { label: 'Last 30 days', value: 'Last 30 days' },
  { label: 'Today', value: 'Today' },
  { label: 'Yesterday', value: 'Yesterday' },
  { label: 'Last 7 days', value: 'Last 7 days' },
  { label: 'Range', value: 'Range' },
];

const UserManagement = () => {
  const { userStatus, userAction, setUserStatus, setUserAction } = useContext(LeadContext);
  const { values, errors, touched, setFieldValue, handleBlur, token } = useContext(AuthContext);

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
  const [show, setShow] = useState(false);
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
      dispatch({ type: value, payload: value });
      // if (value === 'All users') {
      //   dispatch({ type: value, payload: value });
      // } else {
      //   dispatch({ type: value, payload: value });
      // }
    },
    [displayedList],
  );

  const handleDateChange = useCallback(
    (value) => {
      switch (value) {
        case 'Last 30 days': {
          // setLeadList();
          break;
        }
        case 'Today': {
          // setLeadList();
          break;
        }
        case 'Yesterday': {
          console.log(value);
          break;
          // setLeadList();
        }
        case 'Last 7 days': {
          // setLeadList();
          break;
        }
        case 'Range': {
          setOpen(true);
          // setLeadList();
          break;
        }
        default:
          return value;
      }
    },
    [displayedList],
  );

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
  // console.log(displayedList);
  // console.log(userStatus);
  // console.log(userAction);
  // console.log(currentPage);
  // console.log(selectionRange);

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
        handleActionClick={() => alert('set action func')}
      />
      <FormPopUp
        showpopup={show}
        setShowPopUp={setShow}
        title='Add user'
        subTitle='Created on: Today'
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

      {leadList.length ? (
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
      ) : (
        <div className='w-full h-screen flex justify-center items-center bg-[#FAFAFA]'>
          <NoUsersAddedIcon />
        </div>
      )}
    </>
  );
};

export default UserManagement;
