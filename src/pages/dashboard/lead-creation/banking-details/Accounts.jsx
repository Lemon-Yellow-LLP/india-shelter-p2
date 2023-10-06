import React, { useContext } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import OpenAccordian from '../../../../assets/icons/OpenAccordian';
import DummyBankLogo from '../../../../assets/dummyBankLogo.png';
import ToggleSwitch from '../../../../components/ToggleSwitch';

export default function Accounts() {
  const { values, activeIndex } = useContext(LeadContext);
  return (
    <div>
      <Accordion style={{ borderRadius: '8px' }}>
        <AccordionSummary
          expandIcon={<OpenAccordian />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          style={{ padding: '15px', height: '70px' }}
        >
          <div className='flex flex-row items-center h-[46px]'>
            <img src={DummyBankLogo} alt='' className='mr-4 h-[32px] w-[32px]' />
            <div className='flex flex-col gap-[4px]'>
              <div className='flex gap-[8px] items-center'>
                <span className='text-[16px] font-normal leading-[24px]'>SBI Bank</span>
                <span className='text-[#065381] text-[10px] font-medium border border-[#065381] bg-[#E5F5FF] rounded-[12px] h-[19px] w-[56px] flex items-center justify-center'>
                  Primary
                </span>
              </div>
              <span className='text-[12px] text-[#707070] font-normal leading-[18px]'>
                XXXXXXX1234
              </span>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails style={{ height: '114px' }}>
          <hr className='border border-[#D9D9D9] w-100' />
          <div className='flex flex-col justify-between h-full mt-1'>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>IFSC code:</span>
              <span className='text-[12px] font-normal text-[#000000]'>SBI0001234</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Branch:</span>
              <span className='text-[12px] font-normal text-[#000000]'>Nashik</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Account type:</span>
              <span className='text-[12px] font-normal text-[#000000]'>Saving</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Make it primary</span>
              <ToggleSwitch name='make_it_primary' onChange={(e) => setChangePrimaryAlert(true)} />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
