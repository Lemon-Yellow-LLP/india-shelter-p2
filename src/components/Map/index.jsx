import propTypes from 'prop-types';
import { IconClose } from '../../assets/icons';
import currentLocation from '../../assets/icons/current-location.svg';
import { useEffect, useRef, useState } from 'react';
import MapSearchDrawer from './MapSearchDrawer';

const Map = ({ setShowMap }) => {
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

      <div className='h-full bg-blue-300 w-full flex-1'></div>

      <button
        style={{
          boxShadow: '0px 0px 14px 0px rgba(163, 163, 163, 0.35)',
        }}
        className='p-3 rounded-lg border border-primary-red flex gap-2 bg-neutral-white text-primary-red w-fit fixed left-2/4 -translate-x-2/4 bottom-28 items-center justify-between text-sm'
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
