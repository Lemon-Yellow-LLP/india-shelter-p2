import { useContext, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { useNavigate } from 'react-router-dom';
import { LeadContext } from '../../../context/LeadContextProvider';
import { LockIcon } from '../../../assets/icons';

export default function DrawerSteps({ details, steps, index }) {
  const { setCurrentStepIndex, setDrawerOpen, drawerOpen, setActiveIndex } =
    useContext(LeadContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (steps) {
      setActiveIndex(
        index,
        setDrawerOpen(false, setCurrentStepIndex(index), navigate(details.url)),
      );
    }
  };

  return (
    <div
      className='flex flex-col w-[100%] max-h-[77px] rounded-lg border p-2 justify-between'
      onClick={handleClick}
    >
      <div className='flex justify-between gap-1'>
        <details.Icon />
        <div className='flex flex-col flex-1'>
          <span className='text-[14px] font-normal'>{details.title}</span>
          {steps ? (
            <span className='text-[11px] font-normal text-[#727376]'>{details.description}</span>
          ) : null}
        </div>
        {!details.hideProgress ? (
          !details.lock && steps ? (
            <>
              {details.progress === 100 ? (
                <span className='text-[#147257] text-[10px] font-medium border border-[#147257] bg-[#D9F2CB] rounded-[12px] h-[23px] w-[81px] flex items-center justify-center'>
                  Done
                </span>
              ) : (
                <span className='text-[#065381] text-[10px] font-medium border border-[#065381] bg-[#E5F5FF] rounded-[12px] h-[23px] w-[81px] flex items-center justify-center'>
                  In Progress
                </span>
              )}
            </>
          ) : (
            <LockIcon />
          )
        ) : null}
      </div>
      {(details.progress || details.progress >= 0) && !details.lock ? (
        <ProgressBar progress={details.progress} />
      ) : null}
    </div>
  );
}
