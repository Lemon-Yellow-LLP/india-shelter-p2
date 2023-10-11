import React, { useContext, useState } from 'react';
import { IconBackBanking, IconClose } from '../../../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, ToastMessage } from '../../../../components';
import exclamation_icon from '../../../../assets/icons/exclamation_icon.svg';
import ResendButtonWithTimer from '../../../../components/ResendButtonWithTimer';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import loading from '../../../../assets/icons/loader_white.png';
import axios from 'axios';
import { LeadContext } from '../../../../context/LeadContextProvider';
const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];

export default function AccountAggregator() {
  const { values, activeIndex } = useContext(LeadContext);
  const navigate = useNavigate();
  const [mobileNo, setMobileNo] = useState('');
  const [aaInitiated, setAAInitiated] = useState(false);
  const [enableAA, setEnableAA] = useState(false);
  const [aaRunning, setAARunning] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const [referenceId, setReferenceId] = useState();
  const [loadingState, setLoadingState] = useState(false);

  const handleInitiateAA = async () => {
    setLoadingState(true);
    await axios
      .post(
        `https://lo.scotttiger.in/api/applicant/account-aggregator/initiate-by-phone-number/${values?.applicants?.[activeIndex]?.applicant_details?.id}`,
        { phone_number: mobileNo },
      )
      .then(({ data }) => {
        setReferenceId(data.account_aggregator_response_initiate_by_phone.referenceId);
        setAAInitiated(true);
        setToastMessage('Link has been sent to the entered mobile number');
        setLoadingState(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(false);
      });
  };

  const handleResend = async () => {
    await axios
      .post(
        `https://lo.scotttiger.in/api/applicant/account-aggregator/regenerate-redirection-url/${values?.applicants?.[activeIndex]?.applicant_details?.id}`,
        { referenceId: referenceId },
      )
      .then((res) => {
        setAAInitiated(true);
        setToastMessage('Link has been sent to the entered mobile number');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkStatus = async () => {
    setChecking(true);
    await axios
      .post(
        `https://lo.scotttiger.in/api/applicant/account-aggregator/tracking-status/${values?.applicants?.[activeIndex]?.applicant_details?.id}`,
        {
          referenceId: referenceId,
        },
      )
      .then(({ data }) => {
        setChecking(false);
        if (data.account_aggregator_response.status === 'COMPLETED') {
          setAAInitiated(false);
          setAARunning(false);
          navigate('/lead/banking-details');
        }
      })
      .catch((err) => {
        console.log(err);
        setChecking(false);
      });
  };

  return (
    <>
      <div className='flex flex-col h-[100dvh]'>
        <div className='h-[48px] border-b-2 flex items-center p-[12px]'>
          <button onClick={() => setConfirmation(true)}>
            <IconBackBanking />
          </button>
          <span className='text-[#373435] text-[16px] font-medium pl-[10px]'>
            Add a bank account
          </span>
        </div>
        <ToastMessage message={toastMessage} setMessage={setToastMessage} />
        <div className='flex flex-col p-[20px] flex-1'>
          <TextInput
            message={aaInitiated ? 'In Process' : null}
            name='aa_mobile_no'
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
                  defaultResendTime={45}
                  handleResend={handleResend}
                  setAARunning={setAARunning}
                />
              </div>

              <div className='flex flex-col gap-[16px]'>
                <Button
                  primary={true}
                  inputClasses='w-full h-[46px] flex gap-2 items-center'
                  // disabled={!enableAA}
                  onClick={checkStatus}
                >
                  {checking ? (
                    <>
                      <img
                        src={loading}
                        alt='loading'
                        className='animate-spin duration-300 ease-out'
                      />
                      <span>Checking status</span>
                    </>
                  ) : (
                    <span>Check status</span>
                  )}
                </Button>
                <Button
                  primary={false}
                  inputClasses='w-full h-[46px]'
                  disabled={aaRunning}
                  onClick={() => (aaRunning ? null : setConfirmation(true))}
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
              onClick={handleInitiateAA}
            >
              {loadingState ? (
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              ) : (
                'Initiate AA'
              )}
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

      <DynamicDrawer open={confirmation} setOpen={setConfirmation} height='180px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to leave?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              The data will be lost forever.
            </p>
          </div>
          <div className=''>
            <button onClick={() => setConfirmation(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={() => setConfirmation(false)}>
            Stay
          </Button>
          <Button
            primary={true}
            inputClasses=' w-full h-[46px]'
            onClick={() => {
              setAAInitiated(false);
              setAARunning(false);
              setConfirmation(false);
            }}
            link='/lead/banking-details'
          >
            Leave
          </Button>
        </div>
      </DynamicDrawer>
    </>
  );
}
