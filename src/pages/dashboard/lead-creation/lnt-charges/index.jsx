/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PaymentFailureIllustration from '../../../../assets/payment-failure';
import PaymentSuccessIllustration from '../../../../assets/payment-success';
import InfoIcon from '../../../../assets/icons/info.svg';
import ScannerIcon from '../../../../assets/icons/scanner.svg';
import CashIcon from '../../../../assets/icons/cash.svg';
import LinkIcon from '../../../../assets/icons/link.svg';
import { Button, ToastMessage } from '../../../../components';
import { useContext, useEffect, useState } from 'react';
import LoaderIcon from '../../../../assets/loader';
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

const QR_TIMEOUT = 5 * 60;
const LINK_RESEND_TIME = 30;

const LnTCharges = ({ amount = 1500 }) => {
  const { values, errors, touched, handleBlur, setFieldValue } = useContext(LeadContext);

  const [toastMessage, setToastMessage] = useState('');

  const [mobile_number, setMobileNumber] = useState('');

  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');
  const [checkingStatus, setCheckingStatus] = useState('');
  const [isConfirmPaymentVisible, setConfirmPaymentVisibility] = useState(false);
  const [isConfirmSkipVisible, setConfirmSkipVisibility] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // 'success' | 'failure' | ''
  const [qrCode, setQrCode] = useState('');
  const [loadingQr, setLoadingQr] = useState(false);
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
      const resp = await getLnTChargesQRCode(values?.lead?.id);
      setQrCode(resp.DecryptedData.QRCODE_STRING);
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
        if (values?.lead?.id) {
          const resp = await checkIfLntExists(values?.lead?.id);
          console.log('----- ', resp);
          setFieldValue('lt_charges', resp);
          setPaymentStatus('success');
        }
      } catch (err) {
        const resp = await addLnTCharges(values?.lead?.id);
        setLntId(resp.id);
        await fetchQR();

        // Reset
        setHasSentOTPOnce(false);
        setShowResendLink(false);
        setActiveItem('');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // check whether LnT exists
        if (values?.lead?.id) {
          const resp = await checkIfLntExists(values?.lead?.id);
          setFieldValue('lt_charges', resp);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [paymentStatus]);

  const handleCheckingStatus = async (label = '') => {
    try {
      setCheckingStatus(label);
      const resp = await checkPaymentStatus(values?.lead?.id);
      if (resp?.airpay_response_json?.airpay_verify_transaction_status == '200') {
        setPaymentStatus('success');
      } else if (resp?.airpay_response_json?.airpay_verify_transaction_status == '400') {
        setPaymentStatus('failure');
      }
    } catch (error) {
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
    await makePaymentByCash(lntId);
    setPaymentStatus('success');
  };

  const sendPaymentLink = async () => {
    setDisablePhoneNumber(true);
    setHasSentOTPOnce(true);

    const resp = await makePaymentByLink(values?.lead?.id, {
      mobile_number: values?.lnt_mobile_number?.mobile_number,
    });
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

  const showConfirmSkip = () => setConfirmSkipVisibility(true);
  const hideConfirmSkip = () => setConfirmSkipVisibility(false);

  const handleSkipPayment = () => {
    navigate(0);
  };

  return (
    <>
      {!paymentStatus ? (
        <>
          <div className='overflow-hidden flex flex-col h-[100vh] bg-medium-grey'>
            <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />

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
                      defaultOption
                    >
                      <div className='mb-4'>
                        {activeItem == '' || activeItem == 'UPI Payment' ? (
                          <div className='flex justify-center items-center py-2'>
                            {loadingQr ? (
                              <div className='w-[180px] h-[180px] flex justify-center items-center'>
                                <LoaderIcon className='w-12 h-12' />
                              </div>
                            ) : (
                              <QRCode title='GeeksForGeeks' value={qrCode} size={180} />
                            )}
                          </div>
                        ) : null}

                        {activeItem == 'UPI Payment' ? (
                          <>
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
                          </>
                        ) : null}
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
                        error={errors?.lnt_mobile_number?.mobile_number}
                        touched={touched?.lnt_mobile_number?.mobile_number}
                        onOTPSendClick={sendPaymentLink}
                        disabledOtpButton={
                          !mobile_number ||
                          !!errors?.lnt_mobile_number?.mobile_number ||
                          hasSentOTPOnce
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
                <Button primary={true} inputClasses={'h-12 w-full'} onClick={showConfirmPayment}>
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

const PaymentSuccess = ({ amount, method }) => {
  const { values } = useContext(LeadContext);
  return (
    <div className='overflow-hidden flex flex-col h-[100vh] justify-between'>
      <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
      <div className='h-screen bg-[#EEF0DD] flex flex-col w-full'>
        <div className='flex-1 flex-col flex items-center z-0 overflow-auto'>
          {/* <div className='w-full relative z-0'> */}
          <div className='flex justify-center pointer-events-none'>
            <PaymentSuccessIllustration />
          </div>
          <div className='-translate-y-32'>
            <h4 className='text-xl font-medium leading-8 tracking-normal text-center text-primary-black mb-2'>
              Payment successful!
            </h4>
            <h3 className='text-3xl font-semibold tracking-normal text-center text-secondary-green mb-1'>
              {`₹ ${amount}/-`}
            </h3>
            <p className='text-center text-sm not-italic font-normal text-primary-black'>
              L&T charges have been paid using {method}
            </p>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      <div className='mt-auto w-full p-4 bg-[#EEF0DD]'>
        <Button primary={true} inputClasses='h-12' link='/lead/property-details'>
          Next
        </Button>
      </div>
    </div>
  );
};

const PaymentFailure = ({ back, skip }) => {
  const { values } = useContext(LeadContext);
  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
      <div className='h-screen bg-medium-grey flex flex-col w-full'>
        <div className='flex-1 flex items-center z-0'>
          <div className='w-full relative z-0'>
            <div className='flex justify-center pointer-events-none'>
              <PaymentFailureIllustration />
            </div>
            <div className='-translate-y-32'>
              <h4 className='text-center text-xl not-italic font-medium text-primary-black mb-2'>
                Payment unsuccessful!
              </h4>
              <p className='text-center text-sm not-italic font-normal text-light-grey'>
                Please try other payment options
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-auto w-full p-4 space-y-4 '>
        <Button inputClasses='h-12' primary={true} onClick={back}>
          Select other payment method
        </Button>
        <Button
          inputClasses={
            'border-none text-center text-base not-italic font-semibold underline h-12 bg-transparent'
          }
          onClick={skip}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default LnTCharges;

const AccordionItem = ({
  iconImage,
  label,
  children,
  open,
  setOpen,
  className,
  disabled,
  defaultOption,
}) => {
  return (
    <div
      className={`w-full transition-opacity ${
        disabled ? 'opacity-60 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      onClick={() => setOpen(label)}
    >
      <div className='flex w-full gap-2 py-1'>
        <img src={iconImage} className='w-6 h-6' alt='accordion-icon' />
        <label
          htmlFor={label}
          className='flex-1 text-base not-italic font-normal text-primary-black'
        >
          {label}
        </label>

        <div className=''>
          <input
            id='roundedCheckbox'
            onChange={() => setOpen(label)}
            checked={open}
            type='radio'
            name={label}
            className=' w-[24px] h-[24px] accent-primary-red rounded-full '
          />
        </div>
      </div>

      <div className={className}>{open || defaultOption ? children : null}</div>
    </div>
  );
};

const Separator = () => {
  return <div className='border-t-2 border-b-0 my-4 w-full'></div>;
};

const StatusButton = ({ disabled, isLoading = false, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={`p-2 md:py-3 text-base md:text-lg rounded md:w-64 flex justify-center items-center gap-2 h-12 w-full
       ${
         isLoading ? 'pointer-events-none' : 'pointer-events-auto'
       } bg-primary-red border border-primary-red text-white disabled:bg-[#D9D9D9] disabled:text-[#96989A] disabled:border-transparent transition-colors ease-out duration-300
       `}
      {...props}
    >
      {isLoading ? <LoaderIcon className='animate-spin' /> : null}
      <span className='text-center text-base not-italic font-semibold'>
        {isLoading && !disabled ? 'Checking Status' : 'Check Status'}
      </span>
    </button>
  );
};

LnTCharges.propTypes = {
  amount: PropTypes.number,
};

PaymentSuccess.propTypes = {
  amount: PropTypes.any,
  method: PropTypes.any,
};

PaymentFailure.propTypes = {
  back: PropTypes.any,
  skip: PropTypes.any,
};

StatusButton.propTypes = {
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

AccordionItem.propTypes = {
  iconImage: PropTypes.any,
  label: PropTypes.any,
  children: PropTypes.any,
  open: PropTypes.any,
  setOpen: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.any,
  defaultOption: PropTypes.any,
};
