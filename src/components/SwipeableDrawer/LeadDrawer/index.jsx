import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useCallback, useContext, useState } from 'react';
import propTypes from 'prop-types';
import BottomSheetHandle from '../../BottomSheetHandle';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DrawerFooter from './DrawerFooter';
import { LeadContext } from '../../../context/LeadContextProvider';
import PrimaryApplicantTab from './PrimaryApplicantTab';
import CoApplicantTab from './CoApplicantTab';
import ToolsTab from './ToolsTab';
import DynamicDrawer from '../DynamicDrawer';
import { AuthContext } from '../../../context/AuthContextProvider';
import { editFieldsById } from '../../../global';
import { IconClose } from '../../../assets/icons';
import Button from '../../Button';

const drawerBleeding = 0;

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: propTypes.node,
  index: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function SwipeableDrawerComponent() {
  const {
    drawerOpen,
    setDrawerOpen,
    values,
    drawerTabIndex,
    setDrawerTabIndex,
    primaryIndex,
    setPrimaryIndex,
    setValues,
    setActiveIndex,
    activeCoApplicantIndex,
  } = useContext(LeadContext);

  const { token, phoneNumberList, setPhoneNumberList } = useContext(AuthContext);

  const theme = useTheme();

  const [toggle, setToggle] = useState(false);

  const [changePrimaryAlert, setChangePrimaryAlert] = useState(false);

  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleChange = (event, newValue) => {
    setDrawerTabIndex(newValue);
  };

  const handleChangeIndex = useCallback((index) => {
    setDrawerTabIndex(index);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleMakePrimary = async () => {
    setToggle(true);

    let newData = structuredClone(values);

    newData.applicants[activeCoApplicantIndex].applicant_details = {
      ...newData.applicants[activeCoApplicantIndex].applicant_details,
      is_primary: true,
      applicant_type: 'Primary Applicant',
    };

    newData.applicants[primaryIndex].applicant_details = {
      ...newData.applicants[primaryIndex].applicant_details,
      is_primary: false,
      applicant_type: 'Co Applicant',
    };

    setValues(newData);

    setToggle(false);

    await editFieldsById(
      values?.applicants[activeCoApplicantIndex]?.applicant_details?.id,
      'applicant',
      {
        is_primary: true,
        applicant_type: 'Primary Applicant',
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    await editFieldsById(
      values?.applicants[primaryIndex]?.applicant_details?.id,
      'applicant',
      {
        is_primary: false,
        applicant_type: 'Co Applicant',
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setChangePrimaryAlert(false);
  };

  const handleDelete = async () => {
    let ogData = structuredClone(values);

    let newData = structuredClone(ogData);

    newData.applicants = newData.applicants.filter((e, index) => index !== activeCoApplicantIndex);

    newData.applicants.map((e, index) => {
      if (e.applicant_details.is_primary) {
        setPrimaryIndex(index);
        setActiveIndex(index);
      }
    });

    setValues(newData);

    await editFieldsById(
      ogData?.applicants[activeCoApplicantIndex]?.applicant_details?.id,
      'applicant',
      {
        is_deleted: true,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    let newPhoneNumbers = {
      lo: phoneNumberList.lo,
      reference_1: newData?.reference_details?.reference_1_phone_number ?? '',
      reference_2: newData?.reference_details?.reference_2_phone_number ?? '',
    };
    newData.applicants.map((applicant, idx) => {
      newPhoneNumbers[`applicant_${idx}`] = applicant?.applicant_details?.mobile_number ?? '';
    });

    setPhoneNumberList(newPhoneNumbers);

    setDeleteAlert(false);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor='bottom'
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        swipeAreaWidth={drawerBleeding}
        allowSwipeInChildren={true}
        disableSwipeToOpen={false}
        disableBackdropTransition
        ModalProps={{
          keepMounted: true,
        }}
        className='swipeableDrawerSteps'
      >
        <StyledBox
          sx={{
            position: 'relative',
            marginTop: `${-drawerBleeding}px`,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
          className='rounded-t-2xl'
        >
          <div className='pt-2 flex justify-center flex-col'>
            <BottomSheetHandle />
            <div className='flex justify-between p-4 pt-2 pb-1'>
              <div className='flex gap-1'>
                <h4 className='text-base font-medium'>
                  {values?.applicants?.[primaryIndex]?.applicant_details?.first_name}
                </h4>
                <h4 className='text-base font-medium'>
                  {values?.applicants?.[primaryIndex]?.applicant_details?.middle_name}
                </h4>
                <h4 className='text-base font-medium'>
                  {values?.applicants?.[primaryIndex]?.applicant_details?.last_name}
                </h4>
              </div>
              <div className='flex flex-col items-end'>
                <span className='text-base text-[#E33439] font-medium'>
                  {values?.lead?.extra_params?.progress}%
                </span>
                <span className='text-xs text-[#727376] font-normal'>Completed</span>
              </div>
            </div>
          </div>
        </StyledBox>
        <StyledBox
          sx={{
            pb: 2,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
            }}
          >
            <Tabs
              value={drawerTabIndex}
              onChange={handleChange}
              textColor='inherit'
              variant='fullWidth'
              aria-label='full width tabs example'
              className='border-solid border bg-[#FAFAFA]'
            >
              <Tab label='Primary' {...a11yProps(0)} className='tabLabels' />
              <Tab label='Co-Applicants' {...a11yProps(1)} className='tabLabels' />
              <Tab label='Tools' {...a11yProps(2)} className='tabLabels' />
            </Tabs>

            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={drawerTabIndex}
              onChangeIndex={handleChangeIndex}
            >
              {/* Tabs start ---------------*/}
              <PrimaryApplicantTab />
              <CoApplicantTab
                toggle={toggle}
                setChangePrimaryAlert={setChangePrimaryAlert}
                setDeleteAlert={setDeleteAlert}
              />
              <ToolsTab />
              {/* Tabs end ---------------*/}
            </SwipeableViews>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
      <DrawerFooter />

      <DynamicDrawer open={changePrimaryAlert} setOpen={setChangePrimaryAlert} height='223px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to make this Co-applicant a Primary?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              Changing the primary applicant will change the primary owner of the application
            </p>
          </div>
          <div className=''>
            <button onClick={() => setChangePrimaryAlert(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={() => setChangePrimaryAlert(false)}>
            No
          </Button>
          <Button
            primary={true}
            inputClasses=' w-full h-[46px]'
            onClick={() => handleMakePrimary()}
          >
            Yes
          </Button>
        </div>
      </DynamicDrawer>

      <DynamicDrawer open={deleteAlert} setOpen={setDeleteAlert} height='223px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to remove this Co-applicant?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              The data will be lost forever
            </p>
          </div>
          <div className=''>
            <button onClick={() => setDeleteAlert(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={() => setDeleteAlert(false)}>
            No, keep
          </Button>
          <Button primary={true} inputClasses=' w-full h-[46px]' onClick={() => handleDelete()}>
            Yes, remove
          </Button>
        </div>
      </DynamicDrawer>
    </div>
  );
}
