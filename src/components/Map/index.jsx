import propTypes from 'prop-types';
import { IconClose } from '../../assets/icons';
import currentLocation from '../../assets/icons/current-location.svg';
import { useEffect, useRef, useState } from 'react';
import MapSearchDrawer from './MapSearchDrawer';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB_VgPtaHSDn21sTi9b6f9Ga15cjvZ6-Sk';

const Map = ({ setShowMap }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // if (!isLoaded) return 'loading';

  const mapContainerRef = useRef(null);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      id='map-container'
      ref={mapContainerRef}
      className='fixed inset-0 h-screen w-full bg-white flex flex-col no-scrollbar overflow-hidden'
    >
      <div className='flex flex-row p-3 px-4 justify-between items-center'>
        <span className='text-base font-medium'>Choose location</span>
        <button onClick={() => setShowMap(false)} type='button' title='Close map'>
          <IconClose />
        </button>
      </div>

      {/* <div className='h-full bg-blue-300 w-full flex-1'>

      </div> */}

      <div>
        <GoogleMap></GoogleMap>
      </div>

      <button
        style={{
          boxShadow: '0px 0px 14px 0px rgba(163, 163, 163, 0.35)',
        }}
        className='p-3 rounded-lg border border-primary-red flex gap-2 bg-neutral-white text-primary-red w-48 fixed left-2/4 -translate-x-2/4 bottom-28 items-center justify-between text-sm'
        type='button'
        title='Use current location'
      >
        <img src={currentLocation} alt='current location' role='presentation' />
        <span className='whitespace-nowrap'>Use current location</span>
      </button>
      <MapSearchDrawer
        mapContainerRef={mapContainerRef}
        searchDrawerOpen={searchDrawerOpen}
        setSearchDrawerOpen={setSearchDrawerOpen}
      />
    </div>
  );
};

export default Map;

Map.propTypes = {
  setShowMap: propTypes.func,
};
