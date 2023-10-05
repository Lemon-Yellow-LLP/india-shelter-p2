import React, { useState } from 'react';
import { IconBackBanking } from '../../../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput } from '../../../../components';

const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

export default function AccountAggregator() {
  const navigate = useNavigate();
  const [mobileNo, setMobileNo] = useState('');
  const [aaInitiated, setAAInitiated] = useState(false);
  const [enableAA, setEnableAA] = useState(false);
  const [aaRunning, setAARunning] = useState(false);

  return (
    <div>
      <div className='h-[48px] border-b-2 flex items-center p-[12px]'>
        <button onClick={() => navigate('/lead/banking-details')}>
          <IconBackBanking />
        </button>
        <span className='text-[#373435] text-[16px] font-medium pl-[10px]'>Add a bank account</span>
      </div>

      <div className='p-[20px]'>
        <TextInput
          label='Mobile number'
          placeholder='Eg: 123456789'
          required
          type='tel'
          value={mobileNo}
          pattern='\d*'
          onFocus={(e) =>
            e.target.addEventListener(
              'wheel',
              function (e) {
                e.preventDefault();
              },
              { passive: false },
            )
          }
          min='0'
          onInput={(e) => {
            if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
          }}
          onChange={(e) => {
            const phoneNumber = e.currentTarget.value;
            if (phoneNumber < 0) {
              e.preventDefault();
              return;
            }
            if (phoneNumber.length > 10) {
              return;
            }
            if (DISALLOW_NUM.includes(phoneNumber)) {
              e.preventDefault();
              return;
            }

            if (phoneNumber.length < 10) {
              setEnableAA(false);
            }

            if (phoneNumber.length === 10) {
              setEnableAA(true);
            }

            setMobileNo(phoneNumber);
          }}
          disabled={aaInitiated}
          inputClasses='hidearrow'
        />

        {aaInitiated ? (
          <div className='flex flex-col gap-[16px]'>
            <Button
              primary={true}
              inputClasses='w-full h-[46px]'
              // disabled={!enableAA}
              onClick={() => console.log('checkStatus')}
            >
              Check status
            </Button>
            <Button
              primary={false}
              inputClasses='w-full h-[46px]'
              disabled={aaRunning}
              onClick={() => console.log('skip')}
            >
              Skip
            </Button>
          </div>
        ) : (
          <Button
            primary={true}
            inputClasses='w-full h-[46px] mt-[10px]'
            disabled={!enableAA}
            onClick={() => {
              setAAInitiated(true);
              setAARunning(true);
            }}
          >
            Initiate AA
          </Button>
        )}
      </div>
    </div>
  );
}
