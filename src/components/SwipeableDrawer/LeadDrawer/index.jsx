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
import { CommingSoon, DustbinIcon, ToolTipIcon } from '../../../assets/icons';
import { ClickAwayListener, IconButton, Tooltip } from '@mui/material';
import DropDown from '../../DropDown';
import ToggleSwitch from '../../ToggleSwitch';

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
    updateProgress,
    addApplicant,
    drawerOpen,
    setDrawerOpen,
    values,
    setActiveIndex,
    coApplicantStepsProgress,
  } = useContext(LeadContext);

  const theme = useTheme();

  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(false);

  const [primaryIndex, setPrimaryIndex] = useState(0);

  const [activeCoApplicantIndex, setActiveCoApplicantIndex] = useState(0);

  const [coApplicants, setCoApplicants] = useState([]);

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
                  {applicantStepsProgress &&
                    applicantStepsProgress.map((e, index) => (
                      <DrawerSteps key={index} details={e} steps={true} index={primaryIndex} />
                    ))}
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
                            onClick={addApplicant}
                            className='text-primary-red font-medium text-[16px]'
                          >
                            + Add
                          </button>
                        </div>
                        <span className='font-normal text-[12px] leading-[18px] text-[#727376]'>
                          After the qualifier is complete, co-applicants can be made primary
                        </span>
                      </div>

                      {values?.applicants && values.applicants.length > 1 ? (
                        <div className='flex flex-col gap-4'>
                          <DropDown
                            options={coApplicants}
                            onChange={(e) => setActiveCoApplicantIndex(e)}
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
                                onChange={(e) => console.log(e.target.name)}
                              />
                            </div>
                            <div className='flex justify-end gap-2 items-center'>
                              <span className='text-[#727376] text-[12px] font-normal'>
                                Qualifier:
                                <span className='text-[#FF9D4A] text-[12px] font-semibold ml-[5px]'>
                                  Amber
                                </span>
                              </span>
                              <button onClick={() => console.log(activeCoApplicantIndex)}>
                                <DustbinIcon />
                              </button>
                            </div>
                          </div>
                          <div className='flex flex-col gap-[16px] w-[100%] pb-[80px]'>
                            {coApplicantStepsProgress &&
                              coApplicantStepsProgress.map((e, index) => (
                                <DrawerSteps
                                  key={index}
                                  details={e}
                                  steps={true}
                                  index={activeCoApplicantIndex}
                                />
                              ))}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={addApplicant}
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
    </Root>
  );
}
