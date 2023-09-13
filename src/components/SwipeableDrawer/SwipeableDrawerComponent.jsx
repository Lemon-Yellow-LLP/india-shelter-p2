import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useCallback, useContext, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import BottomSheetHandle from '../BottomSheetHandle';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DrawerFooter from './DrawerFooter';
import DrawerSteps from './DrawerSteps';

import CustomizedTimeline from './CustomizedTimeline';
import WarningCircle from '../../assets/icons/WarningCircle.svg';
import { LeadContext } from '../../context/LeadContextProvider';

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
  const { stepsProgress, updateProgress, applicants, addApplicant, drawerOpen, setDrawerOpen } =
    useContext(LeadContext);

  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = useCallback((index) => {
    setValue(index);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
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
            <div className='flex justify-between p-4'>
              <h4 className='text-base font-medium'>Suresh Ramji Shah</h4>
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
              <Tab label='Steps' {...a11yProps(0)} className='tabLabels' />
              <Tab label='Applicants' {...a11yProps(1)} className='tabLabels' />
              <Tab label='Tools' {...a11yProps(2)} className='tabLabels' />
            </Tabs>

            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel
                className='tabPanel'
                style={{ maxHeight: `calc(80vh - 65px)`, overflow: 'auto' }}
                value={value}
                index={0}
                dir={theme.direction}
              >
                {/* <CustomizedTimeline /> */}

                <div className='flex flex-col gap-[16px] w-[100%]'>
                  {stepsProgress &&
                    stepsProgress.map((e, index) => (
                      <DrawerSteps key={index} details={e} steps={true} index={index} />
                    ))}
                </div>
              </TabPanel>
              <TabPanel
                className='tabPanel'
                style={{ height: `calc(80vh - 65px)`, overflow: 'auto' }}
                value={value}
                index={1}
                dir={theme.direction}
              >
                <div className='flex flex-col justify-between w-[100%] h-[100%]'>
                  <div className='flex flex-col gap-[16px] w-[100%]'>
                    {applicants &&
                      applicants.map((e, index) => (
                        <DrawerSteps
                          key={index}
                          details={e}
                          toggleDrawer={toggleDrawer}
                          index={index}
                        />
                      ))}
                  </div>

                  <div className='flex flex-col justify-end'>
                    {applicants.length < 4 ? (
                      <>
                        <button
                          onClick={addApplicant}
                          className='w-[100%] h-[48px] border border-[#E33439] rounded-[4px] flex items-center justify-center text-[16px] text-[#E33439] font-normal'
                        >
                          Add Co-applicant
                        </button>
                        <span className='text-[12px] text-[#727376] font-normal'>
                          *You can add upto 4 co-applicants
                        </span>
                      </>
                    ) : (
                      <div className='flex'>
                        <img src={WarningCircle} />
                        <span className='text-[12px] text-[#E33439] font-normal ml-1'>
                          You have reached the limit of adding co-applicant
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel
                className='tabPanel'
                style={{ height: `calc(80vh - 65px)`, overflow: 'auto' }}
                value={value}
                index={2}
                dir={theme.direction}
              >
                Item Three
              </TabPanel>
            </SwipeableViews>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
      <DrawerFooter />
    </Root>
  );
}

SwipeableDrawerComponent.propTypes = {};
