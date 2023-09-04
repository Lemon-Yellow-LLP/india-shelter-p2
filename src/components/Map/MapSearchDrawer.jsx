import { Global } from '@emotion/react';
import { CssBaseline, SwipeableDrawer } from '@mui/material';
import BottomSheetHandle from '../BottomSheetHandle';
import iconSearch from '../../assets/icons/search.svg';
import propTypes from 'prop-types';
import { useCallback, useState } from 'react';
import currentLocation from '../../assets/icons/current-location.svg';
import { IconArrowRight } from '../../assets/icons';
import addressNotFound from '../../assets/address-not-found.svg';

const SWIPE_AREA_WIDTH = 90;

const MapSearchDrawer = ({ mapContainerRef, searchDrawerOpen, setSearchDrawerOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const onCurrentLocationClick = useCallback(async () => {}, []);

  return (
    <>
      <CssBaseline />
      <Global
        styles={{
          '#map-container .MuiDrawer-root > .MuiPaper-root': {
            height: `calc(90% - ${SWIPE_AREA_WIDTH}px)`,
            overflow: 'visible',
          },
        }}
      />

      <SwipeableDrawer
        className='no-scrollbar overflow-hidden'
        anchor='bottom'
        container={() => mapContainerRef.current}
        open={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
        onOpen={() => setSearchDrawerOpen(true)}
        swipeAreaWidth={SWIPE_AREA_WIDTH}
        allowSwipeInChildren={true}
        disableSwipeToOpen={false}
        disableBackdropTransition
        disableDiscovery
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div
          role='presentation'
          onClick={() => setSearchDrawerOpen(true)}
          style={{
            marginTop: `${-SWIPE_AREA_WIDTH}px`,
          }}
          className='bg-neutral-white rounded-t-2xl left-0 right-0 relative visible'
        >
          <div className='pt-2 pb-4 flex justify-center flex-col no-scrollbar'>
            <BottomSheetHandle />
          </div>

          <div className='w-full min-h-screen bg-neutral-white px-4 flex flex-col gap-2 relative'>
            <div
              className='input-container px-4 py-3 border rounded-lg 
        				flex gap-2
        				transition-all ease-out duration-150
        				focus-within:border-secondary-blue focus-within:shadow-secondary-blue focus-within:shadow-primary border-stroke'
            >
              <img src={iconSearch} alt='Search' role='presentation' />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                placeholder='Search for area, apartment name'
                className='w-full focus:outline-none text-ellipsis text-primary-black'
              />
            </div>

            <button onClick={onCurrentLocationClick} className='flex gap-2 p-2 items-center'>
              <img src={currentLocation} alt='current location' role='presentation' />
              <span className='text-sm font-medium text-primary-red flex-1 text-left'>
                Use current location
              </span>
              <IconArrowRight />
            </button>

            <hr
              className='w-full h-px'
              style={{
                backgroundColor: '#EBEBEB',
              }}
            />

            <img
              className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'
              src={addressNotFound}
              alt='Address not found'
            />
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};

MapSearchDrawer.propTypes = {
  mapContainerRef: propTypes.object,
  searchDrawerOpen: propTypes.bool,
  setSearchDrawerOpen: propTypes.func,
};

export default MapSearchDrawer;
