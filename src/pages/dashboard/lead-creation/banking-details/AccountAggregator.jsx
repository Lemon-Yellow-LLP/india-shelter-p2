import React, { useState } from 'react';
import { IconBackBanking } from '../../../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput } from '../../../../components';
import { ToolTipIcon } from '../../../../assets/icons';
import exclamation_icon from '../../../../assets/icons/exclamation_icon.svg';
import ResendButtonWithTimer from '../../../../components/ResendButtonWithTimer';

const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

export default function AccountAggregator() {
  const navigate = useNavigate();
  const [mobileNo, setMobileNo] = useState('');
  const [aaInitiated, setAAInitiated] = useState(false);
  const [enableAA, setEnableAA] = useState(false);
  const [aaRunning, setAARunning] = useState(false);

  const handleResend = () => {};

  return (
    <div className='flex flex-col h-[100dvh]'>
      <div className='h-[48px] border-b-2 flex items-center p-[12px]'>
        <button onClick={() => navigate('/lead/banking-details')}>
          <IconBackBanking />
        </button>
        <span className='text-[#373435] text-[16px] font-medium pl-[10px]'>Add a bank account</span>
      </div>

      <div className='flex flex-col p-[20px] flex-1'>
        <TextInput
          message={aaInitiated ? 'In Process' : null}
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
          <>
            <div className='pb-4 pt-2'>
              <ResendButtonWithTimer
                startTimer={aaInitiated}
                defaultResendTime={2}
                handleResend={handleResend}
                setAARunning={setAARunning}
              />
            </div>

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
                onClick={() => {
                  console.log('skip');
                }}
              >
                Skip
              </Button>
              <div className='flex items-start gap-2'>
                <img src={exclamation_icon} alt='' />

                <span className='font-normal text-[#727376] text-[12px]'>
                  You can Skip or Resend the link only when the timer gets over
                </span>
              </div>
            </div>
          </>
        ) : (
          <Button
            primary={true}
            inputClasses='w-full h-[46px] mt-[10px]'
            disabled={!enableAA}
            onClick={() => {
              setAAInitiated(true);
            }}
          >
            Initiate AA
          </Button>
        )}
      </div>
      <div className='flex justify-center gap-1 pb-5'>
        {aaInitiated ? (
          <>
            <span className='font-normal text-[14px] text-[#727376]'>Didn’t receive link?</span>
            <button
              className='text-[#E33439] text-[14px] font-medium underline'
              onClick={() => {
                setAAInitiated(false);
                setAARunning(false);
              }}
            >
              Change mobile number
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
