import React, { useContext } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import OpenAccordian from '../../../../assets/icons/OpenAccordian';
import DummyBankLogo from '../../../../assets/dummyBankLogo.png';
import ToggleSwitch from '../../../../components/ToggleSwitch';

export default function Accounts({ data, handlePrimaryChange }) {
  const { values, activeIndex } = useContext(LeadContext);

  function maskAccountNumber(accountNumber) {
    // Check if the account number is a valid string
    if (typeof accountNumber !== 'string') {
      return 'Invalid account number';
    }

    // Determine the number of characters to mask (all except the last 4)
    const numToMask = accountNumber.length - 4;

    // Create a mask with the same length as the characters to mask
    const mask = '*'.repeat(numToMask);

    // Concatenate the mask with the last 4 characters of the account number
    const maskedNumber = mask + accountNumber.slice(-4);

    return maskedNumber;
  }

  return (
    <div>
      <Accordion style={{ borderRadius: '8px' }} TransitionProps={{ unmountOnExit: true }}>
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
                <span className='text-[16px] font-normal leading-[24px]'>{data.bank_name}</span>
                {data.is_primary ? (
                  <span className='text-[#065381] text-[10px] font-medium border border-[#065381] bg-[#E5F5FF] rounded-[12px] h-[19px] w-[56px] flex items-center justify-center'>
                    Primary
                  </span>
                ) : null}
              </div>
              <span className='text-[12px] text-[#707070] font-normal leading-[18px]'>
                {maskAccountNumber(data.account_number)}
              </span>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails style={{ height: '114px' }}>
          <hr className='border border-[#D9D9D9] w-100' />
          <div className='flex flex-col justify-between h-full mt-1'>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>IFSC code:</span>
              <span className='text-[12px] font-normal text-[#000000]'>{data.ifsc_code}</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Branch:</span>
              <span className='text-[12px] font-normal text-[#000000]'>{data.branch_name}</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Account type:</span>
              <span className='text-[12px] font-normal text-[#000000]'> {data.account_type}</span>
            </div>
            <div className='flex gap-[4px]'>
              <span className='text-[12px] font-normal text-[#727376]'>Make it primary</span>
              <ToggleSwitch
                name='make_it_primary'
                checked={data.is_primary}
                onChange={(e) => handlePrimaryChange(data.id, e.currentTarget.checked)}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
