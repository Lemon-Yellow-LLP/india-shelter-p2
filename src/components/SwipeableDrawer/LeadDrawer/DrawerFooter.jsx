import DrawerArrowUpButton from '../../../assets/icons/drawerArrowUpButton.svg';
import DrawerArrowDownButton from '../../../assets/icons/drawerArrowDownButton.svg';
import { useContext } from 'react';
import { LeadContext } from '../../../context/LeadContextProvider';

export default function DrawerFooter() {
  const {
    currentStepIndex,
    applicantStepsProgress,
    drawerOpen,
    setDrawerOpen,
    activeIndex,
    values,
    coApplicantStepsProgress,
  } = useContext(LeadContext);

  return (
    <div className='flex justify-between p-4 pt-3 rounded-t-2xl bg-white w-full border-solid border relative z-[1000]'>
      <div className='flex flex-col'>
        <span style={{ fontSize: '10px', fontWeight: '500', lineHeight: '15px', color: '#E33439' }}>
          {!values.applicants?.[activeIndex]?.applicant_details?.is_primary ? 'CO-APPLICANT' : null}{' '}
          STEP: {currentStepIndex + 1}/
          {values.applicants?.[activeIndex]?.applicant_details?.is_primary
            ? applicantStepsProgress.length
            : coApplicantStepsProgress.length}
        </span>
        <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '18px' }}>
          {applicantStepsProgress[currentStepIndex].title}
        </span>
      </div>
      <img
        className='h-8 w-8'
        src={drawerOpen ? DrawerArrowDownButton : DrawerArrowUpButton}
        onClick={() => setDrawerOpen((prev) => !prev)}
      />
    </div>
  );
}
