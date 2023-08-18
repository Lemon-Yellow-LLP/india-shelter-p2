import DrawerArrowUpButton from '../../assets/icons/drawerArrowUpButton.svg';
import DrawerArrowDownButton from '../../assets/icons/drawerArrowDownButton.svg';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function DrawerFooter({ drawerOpen, toggleDrawer }) {
  const { currentStepIndex, stepsProgress } = useContext(AuthContext);
  return (
    <div className='flex justify-between p-4 pt-3 rounded-t-2xl bg-white w-full border-solid border absolute bottom-0 z-[5000]'>
      <div className='flex flex-col'>
        <span style={{ fontSize: '10px', fontWeight: '500', lineHeight: '15px', color: '#E33439' }}>
          STEP: {currentStepIndex + 1}/{stepsProgress.length}
        </span>
        <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '18px' }}>
          {stepsProgress[currentStepIndex].title}
        </span>
      </div>
      <img
        className='h-8 w-8'
        src={drawerOpen ? DrawerArrowDownButton : DrawerArrowUpButton}
        onClick={toggleDrawer}
      />
    </div>
  );
}
