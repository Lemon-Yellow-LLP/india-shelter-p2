import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useCallback, useContext, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import BottomSheetHandle from '../../BottomSheetHandle';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DrawerFooter from './DrawerFooter';
import DrawerSteps from './DrawerSteps';
import { LeadContext } from '../../../context/LeadContextProvider';
import { CommingSoon, DustbinIcon, IconClose, ToolTipIcon } from '../../../assets/icons';
import { ClickAwayListener, IconButton, Tooltip } from '@mui/material';
import DropDown from '../../DropDown';
import ToggleSwitch from '../../ToggleSwitch';
import { editFieldsById } from '../../../global';
import DynamicDrawer from '../DynamicDrawer';
import Button from '../../Button';
import DrawerStepBanking from './DrawerStepBanking';
import QualifierStep from './QualifierStep';
import EligibilityStep from './EligibilityStep';
import UploadSteps from './UplodSteps';

const drawerBleeding = 0;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

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
    applicantStepsProgress,
    addApplicant,
    drawerOpen,
    setDrawerOpen,
    values,
    setActiveIndex,
    coApplicantStepsProgress,
    setValues,
  } = useContext(LeadContext);

  const theme = useTheme();

  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(false);

  const [toggle, setToggle] = useState(false);

  const [primaryIndex, setPrimaryIndex] = useState(0);

  const [activeCoApplicantIndex, setActiveCoApplicantIndex] = useState(0);

  const [coApplicants, setCoApplicants] = useState([]);

  const [changePrimaryAlert, setChangePrimaryAlert] = useState(false);

  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = useCallback((index) => {
    setValue(index);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    let newData = [];

    values.applicants.map((e, index) => {
      if (!e.applicant_details.is_primary) {
        newData.push({
          label: e.applicant_details.first_name,
          value: index,
        });
      }
    });

    setCoApplicants(newData);

    setActiveCoApplicantIndex(newData?.[0]?.value);

    values.applicants.map((e, index) => {
      if (e.applicant_details.is_primary) {
        setPrimaryIndex(index);
      }
    });
  }, [values.applicants]);

  const handleMakePrimary = async () => {
    setToggle(true);

    let newData = JSON.parse(JSON.stringify(values));

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
    );

    await editFieldsById(values?.applicants[primaryIndex]?.applicant_details?.id, 'applicant', {
      is_primary: false,
      applicant_type: 'Co Applicant',
    });

    setChangePrimaryAlert(false);
  };

  const handleDelete = async () => {
    let ogData = JSON.parse(JSON.stringify(values));

    let newData = JSON.parse(JSON.stringify(ogData));

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
    );

    setDeleteAlert(false);
  };

  return (
    <Root>
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
                <span className='text-base text-[#E33439] font-medium'>15%</span>
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
              value={value}
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
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel
                className='tabPanel'
                style={{ maxHeight: `calc(100vh - 175px)`, overflow: 'auto' }}
                value={value}
                index={0}
                dir={theme.direction}
              >
                <div className='flex flex-col gap-[16px] w-[100%] pb-[80px] p-[15px]'>
                  <DrawerSteps
                    key={0}
                    details={applicantStepsProgress[0]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={0}
                  />
                  <DrawerSteps
                    key={1}
                    details={applicantStepsProgress[1]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={1}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={2}
                    details={applicantStepsProgress[2]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={2}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={3}
                    details={applicantStepsProgress[3]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={3}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <QualifierStep
                    key={4}
                    details={applicantStepsProgress[4]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={4}
                    noProgress={true}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100 ||
                      values?.applicants?.[primaryIndex]?.personal_details?.extra_params
                        ?.progress !== 100 ||
                      values?.applicants?.[primaryIndex]?.address_detail?.extra_params?.progress !==
                        100 ||
                      values?.applicants?.[primaryIndex]?.work_income_detail?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={5}
                    details={applicantStepsProgress[5]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={5}
                    noProgress={true}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={6}
                    details={applicantStepsProgress[6]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={6}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerStepBanking
                    key={7}
                    details={applicantStepsProgress[7]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={7}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={8}
                    details={applicantStepsProgress[8]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={8}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <UploadSteps
                    key={9}
                    details={applicantStepsProgress[9]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={9}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <DrawerSteps
                    key={10}
                    details={applicantStepsProgress[10]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={10}
                    noProgress={true}
                    lock={
                      values?.applicants?.[primaryIndex]?.applicant_details?.extra_params
                        ?.progress !== 100
                    }
                  />
                  <EligibilityStep
                    key={11}
                    details={applicantStepsProgress[11]}
                    steps={true}
                    index={primaryIndex}
                    stepIndex={11}
                    noProgress={true}
                    lock={true}
                  />
                </div>
              </TabPanel>
              <TabPanel
                className='tabPanel'
                style={{ height: `calc(100vh - 175px)`, overflow: 'auto' }}
                value={value}
                index={1}
                dir={theme.direction}
              >
                <div className='flex flex-col justify-between w-[100%] h-[100%] p-[15px]'>
                  <div className='flex flex-col gap-[16px] w-[100%]'>
                    <div className='flex flex-col justify-end gap-4 mt-[5px]'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex justify-between'>
                          <div className='flex gap-2 items-center'>
                            <span className='font-medium text-[16px] leading-[24px]'>
                              Co-applicants
                            </span>
                            <ClickAwayListener onClickAway={handleTooltipClose}>
                              <div>
                                <Tooltip
                                  PopperProps={{
                                    disablePortal: true,
                                  }}
                                  onClose={handleTooltipClose}
                                  open={open}
                                  title='You can add upto 4 Co-applicants'
                                  placement='bottom-start'
                                  arrow
                                >
                                  <IconButton onClick={handleTooltipToggle}>
                                    <ToolTipIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </ClickAwayListener>

                            <span className='font-semibold text-[16px] leading-[24px] text-[#373435]'>
                              {
                                values.applicants.filter((e) => !e.applicant_details.is_primary)
                                  .length
                              }
                              <span className='text-[#96989A]'>/4</span>
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setActiveCoApplicantIndex(values?.applicants?.length);
                              addApplicant();
                            }}
                            className={
                              values?.applicants.length >= 5
                                ? 'text-[#96989A] font-medium text-[16px]'
                                : 'text-primary-red font-medium text-[16px]'
                            }
                            disabled={values?.applicants.length >= 5}
                          >
                            + Add
                          </button>
                        </div>
                        <span className='font-normal text-[12px] leading-[18px] text-[#727376]'>
                          After the qualifier is complete, co-applicants can be made primary
                        </span>
                      </div>

                      {values?.applicants && values.applicants.length >= 2 ? (
                        <div className='flex flex-col gap-4'>
                          <DropDown
                            options={coApplicants}
                            onChange={(e) => setActiveCoApplicantIndex(e)}
                            value={coApplicants?.[activeCoApplicantIndex]?.value}
                            defaultSelected={coApplicants?.[0]?.value}
                            disabledError={true}
                          />
                          <div className='flex justify-between'>
                            <div className='flex gap-1 items-center'>
                              <span className='text-[12px] font-[400] text-[#727376]'>
                                Make it primary
                              </span>
                              <ToggleSwitch
                                name='make_it_primary'
                                checked={toggle}
                                onChange={(e) => setChangePrimaryAlert(true)}
                              />
                            </div>
                            <div className='flex justify-end gap-2 items-center'>
                              <span className='text-[#727376] text-[12px] font-normal'>
                                Qualifier:
                                <span className='text-[#FF9D4A] text-[12px] font-semibold ml-[5px]'>
                                  Amber
                                </span>
                              </span>
                              <button onClick={() => setDeleteAlert(true)}>
                                <DustbinIcon />
                              </button>
                            </div>
                          </div>
                          <div className='flex flex-col gap-[16px] w-[100%] pb-[80px]'>
                            <DrawerSteps
                              key={0}
                              details={coApplicantStepsProgress[0]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={0}
                            />
                            <DrawerSteps
                              key={1}
                              details={coApplicantStepsProgress[1]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={1}
                              lock={
                                values?.applicants?.[activeCoApplicantIndex]?.applicant_details
                                  ?.extra_params?.progress !== 100
                              }
                            />
                            <DrawerSteps
                              key={2}
                              details={coApplicantStepsProgress[2]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={2}
                              lock={
                                values?.applicants?.[activeCoApplicantIndex]?.applicant_details
                                  ?.extra_params?.progress !== 100
                              }
                            />
                            <DrawerSteps
                              key={3}
                              details={coApplicantStepsProgress[3]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={3}
                              lock={
                                values?.applicants?.[activeCoApplicantIndex]?.applicant_details
                                  ?.extra_params?.progress !== 100
                              }
                            />
                            <QualifierStep
                              key={4}
                              details={coApplicantStepsProgress[4]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={4}
                              noProgress={true}
                              lock={true}
                            />
                            <DrawerStepBanking
                              key={5}
                              details={coApplicantStepsProgress[5]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={5}
                              lock={
                                values?.applicants?.[activeCoApplicantIndex]?.applicant_details
                                  ?.extra_params?.progress !== 100
                              }
                            />
                            <UploadSteps
                              key={6}
                              details={coApplicantStepsProgress[6]}
                              steps={true}
                              index={activeCoApplicantIndex}
                              stepIndex={6}
                              lock={
                                values?.applicants?.[activeCoApplicantIndex]?.applicant_details
                                  ?.extra_params?.upload_progress !== 100
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveCoApplicantIndex(values?.applicants?.length);
                            addApplicant();
                          }}
                          className='w-[100%] h-[48px] border bg-[#E33439] rounded-[4px] flex items-center justify-center text-[16px] text-[white] font-normal'
                        >
                          Add Co-applicant
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel
                className='tabPanel p-0'
                style={{ height: `calc(80vh - 65px)`, overflow: 'auto' }}
                value={value}
                index={2}
                dir={theme.direction}
              >
                <img src={CommingSoon} alt='' className='w-full' />
              </TabPanel>
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
    </Root>
  );
}
