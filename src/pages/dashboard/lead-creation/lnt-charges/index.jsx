/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import InfoIcon from '../../../../assets/icons/info.svg';
import ScannerIcon from '../../../../assets/icons/scanner.svg';
import CashIcon from '../../../../assets/icons/cash.svg';
import LinkIcon from '../../../../assets/icons/link.svg';
import { Button, ToastMessage } from '../../../../components';
import { useContext, useEffect, useState } from 'react';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import { IconClose } from '../../../../assets/icons';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInputWithSendOtp from '../../../../components/TextInput/TextInputWithSendOtp';
import QRCode from 'react-qr-code';
import {
  addLnTCharges,
  checkIfLntExists,
  checkPaymentStatus,
  getLnTChargesQRCode,
  makePaymentByCash,
  makePaymentByLink,
} from '../../../../global';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../../../components/Topbar';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../../../context/AuthContextProvider';
import PaymentSuccess from './payment-success';
import PaymentFailure from './payment-failed';
import Separator from './separator';
import StatusButton from './status-button';
import AccordionItem from './accordion-item';
import LoaderDynamicText from '../../../../components/Loader/LoaderDynamicText';

const QR_TIMEOUT = 5 * 60;
const LINK_RESEND_TIME = 30;

const LnTCharges = () => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    setCurrentStepIndex,
    updateCompleteFormProgress,
    activeIndex,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const { phoneNumberList } = useContext(AuthContext);
  const amount =
    values?.applicants?.[activeIndex]?.applicant_details?.bre_101_response?.body?.Display?.[
      'L&T_Charges'
    ] ?? 1500;

  const [toastMessage, setToastMessage] = useState('');

  const [mobile_number, setMobileNumber] = useState('');

  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('UPI Payment');
  const [checkingStatus, setCheckingStatus] = useState('');
  const [isConfirmPaymentVisible, setConfirmPaymentVisibility] = useState(false);
  const [isConfirmSkipVisible, setConfirmSkipVisibility] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // 'success' | 'failure' | ''
  const [qrCode, setQrCode] = useState('');
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(false);
  const [lntId, setLntId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('UPI Payment');
  const [hasSentOTPOnce, setHasSentOTPOnce] = useState(false);
  const [disablePhoneNumber, setDisablePhoneNumber] = useState(false);
  const [sendLinkTime, setSendLinkTime] = useState(0);
  const [showResendLink, setShowResendLink] = useState(false);

  const [qrTime, setQrTime] = useState(QR_TIMEOUT);

  const handleClick = (label = 'UPI Payment') => {
    setActiveItem(label);
    setPaymentMethod(label);
  };

  const fetchQR = async () => {
    try {
      setLoadingQr(true);
      const resp = await getLnTChargesQRCode(values?.lead?.id, {
        headers: {
          Authorization: token,
        },
      });
      if (resp.DecryptedData?.QRCODE_STRING) setQrCode(resp.DecryptedData.QRCODE_STRING);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // check whether LnT exists
        setLoadingPaymentStatus(true);
        if (values?.lead?.id) {
          const resp = await checkIfLntExists(values?.lead?.id, {
            headers: {
              Authorization: token,
            },
          });
          setFieldValue('lt_charges', resp);
          setPaymentStatus('success');
        }

        updateCompleteFormProgress();
      } catch (err) {
        setLoadingPaymentStatus(false);
        const resp = await addLnTCharges(values?.lead?.id, {
          headers: {
            Authorization: token,
          },
        });
        setLntId(resp.id);
        await fetchQR();

        // Reset
        setHasSentOTPOnce(false);
        setShowResendLink(false);
        setActiveItem('UPI Payment');

        updateCompleteFormProgress();
      } finally {
        setLoadingPaymentStatus(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // check whether LnT exists
        if (values?.lead?.id) {
          const resp = await checkIfLntExists(values?.lead?.id, {
            headers: {
              Authorization: token,
            },
          });
          setFieldValue('lt_charges', resp);
        }
        updateCompleteFormProgress();
      } catch (err) {
        console.error(err);
      }
    })();
  }, [paymentStatus]);

  const handleCheckingStatus = async (label = '') => {
    try {
      setCheckingStatus(label);
      const resp = await checkPaymentStatus(values?.lead?.id, {
        headers: {
          Authorization: token,
        },
      });
      if (resp?.airpay_response_json?.airpay_verify_transaction_status == '200') {
        setPaymentStatus('success');
      } else if (resp?.airpay_response_json?.airpay_verify_transaction_status == '400') {
        setPaymentStatus('failure');
      }
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') {
        console.log('canceled check status');
        return;
      }
      setPaymentStatus('failure');
      console.log(error);
    } finally {
      setCheckingStatus('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (paymentStatus !== '') {
        clearInterval(interval);
        return;
      }
      setQrTime((prev) => {
        if (prev === 0) {
          fetchQR();
          return QR_TIMEOUT;
        }
        if (loadingQr) return prev;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loadingQr, paymentStatus]);

  function secondsToMinSecFormat(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const handleOnPhoneNumberChange = async (e) => {
    const phoneNumber = e.currentTarget.value;

    const pattern = /^\d+$/;
    if (!pattern.test(phoneNumber) && phoneNumber.length > 0) {
      return;
    }

    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }
    if (phoneNumber.length > 10) {
      return;
    }
    if (
      phoneNumber.charAt(0) === '0' ||
      phoneNumber.charAt(0) === '1' ||
      phoneNumber.charAt(0) === '2' ||
      phoneNumber.charAt(0) === '3' ||
      phoneNumber.charAt(0) === '4' ||
      phoneNumber.charAt(0) === '5'
    ) {
      e.preventDefault();
      return;
    }

    setMobileNumber(phoneNumber);
    setFieldValue('lnt_mobile_number.mobile_number', phoneNumber);

    if (phoneNumber.length === 10) {
      setHasSentOTPOnce(false);
    }
  };

  const handlePaymentByCash = async () => {
    await makePaymentByCash(lntId, {
      headers: {
        Authorization: token,
      },
    });
    setPaymentStatus('success');
  };

  const sendPaymentLink = async () => {
    setDisablePhoneNumber(true);
    setHasSentOTPOnce(true);

    const resp = await makePaymentByLink(
      values?.lead?.id,
      {
        mobile_number: values?.lnt_mobile_number?.mobile_number,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    if (resp) {
      setToastMessage('Link has been sent to the entered mobile number');
    }
    setShowResendLink(false);
    setSendLinkTime(LINK_RESEND_TIME);
    const interval = setInterval(() => {
      setSendLinkTime((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setDisablePhoneNumber(false);
          setShowResendLink(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const showConfirmPayment = () => setConfirmPaymentVisibility(true);
  const hideConfirmPayment = () => setConfirmPaymentVisibility(false);

  const showConfirmSkip = () => {
    setConfirmSkipVisibility(true);
    setCurrentStepIndex(6);
  };
  const hideConfirmSkip = () => setConfirmSkipVisibility(false);

  const handleSkipPayment = () => {
    navigate(0);
  };

  return (
    <>
      {!paymentStatus ? (
        <>
          <div className='overflow-hidden flex flex-col h-[100vh] bg-medium-grey'>
            <Topbar title='L&T Charges' id={values?.lead?.id} showClose={true} />

            {loadingPaymentStatus ? (
              <div className='absolute flex items-center w-full dashBoardLoaderHeight bg-white'>
                <LoaderDynamicText text='Loading...' textColor='black' height='60%' />
              </div>
            ) : (
              <>
                <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[150px] flex-1'>
                  <div className='flex flex-col'>
                    {/* Label */}
                    <div className='flex items-start gap-2 mb-6'>
                      <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
                      <p className='text-xs not-italic font-normal text-dark-grey'>
                        L&T charges for this application is
                        <span className='text-xs not-italic font-semibold text-primary-black'>{` Rs. ${amount}/-`}</span>
                      </p>
                    </div>

                    {/* Select Payment */}
                    <div>
                      <p className='text-base not-italic font-medium text-dark-grey mb-3'>
                        Select payment method
                      </p>

                      {/* Accordion */}
                      <div className='bg-white rounded-lg flex p-3 flex-col items-center'>
                        <AccordionItem
                          label={'UPI Payment'}
                          iconImage={ScannerIcon}
                          open={activeItem == 'UPI Payment'}
                          setOpen={handleClick}
                          disabled={checkingStatus && checkingStatus !== 'UPI Payment'}
                        >
                          <div className='mb-4'>
                            <div className='flex justify-center items-center py-2'>
                              {loadingQr || qrCode == '' ? (
                                <div className='w-[180px] h-[180px] flex justify-center items-center'>
                                  <CircularProgress color='error' />
                                </div>
                              ) : (
                                <QRCode title='lnt-charges' value={qrCode} size={180} />
                              )}
                            </div>

                            <p className='text-black text-center text-sm not-italic font-normal mb-4'>
                              QR code will get changed in
                              <span className='text-black text-sm not-italic font-semibold'>
                                {` ${secondsToMinSecFormat(qrTime)}s`}
                              </span>
                            </p>

                            <StatusButton
                              onClick={() => handleCheckingStatus('UPI Payment')}
                              isLoading={checkingStatus === 'UPI Payment'}
                            />
                          </div>
                        </AccordionItem>
                        <Separator />
                        <AccordionItem
                          label={'Cash'}
                          iconImage={CashIcon}
                          open={activeItem == 'Cash'}
                          setOpen={handleClick}
                          disabled={checkingStatus && checkingStatus !== 'Cash'}
                        ></AccordionItem>
                        <Separator />
                        <AccordionItem
                          label={'Pay via Link'}
                          iconImage={LinkIcon}
                          open={activeItem == 'Pay via Link'}
                          setOpen={handleClick}
                          disabled={checkingStatus && checkingStatus !== 'Pay via Link'}
                          className='space-y-4'
                        >
                          <TextInputWithSendOtp
                            type='tel'
                            inputClasses='hidearrow'
                            label='Mobile Number'
                            placeholder='Eg: 1234567890'
                            required
                            name='lnt_mobile_number.mobile_number'
                            value={mobile_number}
                            onChange={handleOnPhoneNumberChange}
                            error={
                              errors?.lnt_mobile_number?.mobile_number ||
                              (phoneNumberList?.lo && phoneNumberList.lo == mobile_number
                                ? 'Mobile number cannot be same as Lo number'
                                : '')
                            }
                            touched={touched?.lnt_mobile_number?.mobile_number}
                            onOTPSendClick={sendPaymentLink}
                            disabledOtpButton={
                              !mobile_number ||
                              !!errors?.lnt_mobile_number?.mobile_number ||
                              hasSentOTPOnce ||
                              phoneNumberList?.lo == mobile_number
                            }
                            hideOTPButton={hasSentOTPOnce}
                            disabled={disablePhoneNumber}
                            buttonLabel='Send Link'
                            onBlur={(e) => {
                              handleBlur(e);
                            }}
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
                            // onInput={(e) => {
                            //   if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
                            // }}
                          />
                          <div className='flex items-center'>
                            {sendLinkTime && sendLinkTime > 0 ? (
                              <span className='mr-auto text-primary-red cursor-pointer'>
                                {`${secondsToMinSecFormat(sendLinkTime)}s`}
                              </span>
                            ) : null}

                            {showResendLink ? (
                              <button
                                type='button'
                                className='text-primary-red cursor-pointer font-semibold ml-auto'
                                onClick={sendPaymentLink}
                              >
                                <span>Resend Link</span>
                              </button>
                            ) : null}
                          </div>

                          <StatusButton
                            disabled={!mobile_number || !!errors.lnt_mobile_number?.mobile_number}
                            onClick={() => handleCheckingStatus('Pay via Link')}
                            isLoading={checkingStatus === 'Pay via Link'}
                          />
                        </AccordionItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pl-[20px] pr-[20px] mt-auto w-full space-y-4 bg-transparent flex flex-col items-center'>
                  {activeItem === 'Cash' ? (
                    <Button
                      primary={true}
                      inputClasses={'h-12 w-full'}
                      onClick={showConfirmPayment}
                    >
                      Confirm Payment
                    </Button>
                  ) : null}
                  <span
                    className='border-none text-center text-base not-italic font-semibold underline h-12 bg-transparent text-primary-red'
                    onClick={showConfirmSkip}
                  >
                    Skip for now
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Confirm payment by cash */}
          <DynamicDrawer
            open={isConfirmPaymentVisible}
            setOpen={setConfirmPaymentVisibility}
            height='202px'
          >
            <span className='text-black text-center text-sm not-italic font-normal'>
              Confirm if you received the payment in cash of
            </span>
            <h3 className=' mt-2 text-center text-[22px] not-italic font-medium text-secondary-green'>
              {`₹ ${amount}/-`}
            </h3>
            <div className='w-full flex gap-4 mt-6'>
              <Button inputClasses='w-full h-[46px]' onClick={hideConfirmPayment}>
                Cancel
              </Button>
              <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handlePaymentByCash}>
                Confirm
              </Button>
            </div>
          </DynamicDrawer>
        </>
      ) : null}
      {paymentStatus === 'success' ? (
        <PaymentSuccess amount={amount} back={() => setPaymentStatus('')} method={paymentMethod} />
      ) : null}
      {paymentStatus === 'failure' ? (
        <PaymentFailure
          amount={amount}
          back={() => {
            setPaymentStatus('');
          }}
          next={() => console.log('Goto next page')}
          skip={showConfirmSkip}
        />
      ) : null}

      {/* Confirm skip for now */}
      <DynamicDrawer open={isConfirmSkipVisible} setOpen={setConfirmSkipVisibility} height='223px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to skip and go to the next step?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              Don’t worry. You can pay L&T charges later.
            </p>
          </div>
          <div className=''>
            <button onClick={hideConfirmSkip}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={hideConfirmSkip}>
            Stay
          </Button>
          <Button
            primary={true}
            inputClasses=' w-full h-[46px]'
            onClick={() => {
              hideConfirmSkip();
              setCurrentStepIndex(6);
            }}
            link='/lead/property-details'
          >
            Yes, skip
          </Button>
        </div>
      </DynamicDrawer>

      <ToastMessage message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};

export default LnTCharges;

LnTCharges.propTypes = {
  amount: PropTypes.number,
};
