import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useCallback, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import BottomSheetHandle from '../BottomSheetHandle';
import { Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DrawerArrowUpButton from '../../assets/icons/drawerArrowUpButton.svg';
import DrawerArrowDownButton from '../../assets/icons/drawerArrowDownButton.svg';
import LinearProgress from '@mui/material/LinearProgress';

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

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: propTypes.number.isRequired,
};

export default function SwipeableDrawerComponent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(0);

  //For testing progress bar
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = useCallback((index) => {
    setValue(index);
  }, []);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(100% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />

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
            overflow: 'auto',
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
              className='border-solid border'
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
              <TabPanel value={value} index={0} dir={theme.direction}>
                Item One
                <LinearProgressWithLabel variant='determinate' value={progress} />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                Item Two
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Item Three
              </TabPanel>
            </SwipeableViews>
          </Box>
        </StyledBox>
      </SwipeableDrawer>
      <div className='flex justify-between p-4 pt-3 rounded-t-2xl bg-white w-full border-solid border absolute bottom-0 z-[5000]'>
        <div className='flex flex-col'>
          <span
            style={{ fontSize: '10px', fontWeight: '500', lineHeight: '15px', color: '#E33439' }}
          >
            STEP: 1/8
          </span>
          <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '18px' }}>
            Applicant details
          </span>
        </div>
        <img
          className='h-8 w-8'
          src={drawerOpen ? DrawerArrowDownButton : DrawerArrowUpButton}
          onClick={toggleDrawer}
        />
      </div>
    </Root>
  );
}

SwipeableDrawerComponent.propTypes = {};
