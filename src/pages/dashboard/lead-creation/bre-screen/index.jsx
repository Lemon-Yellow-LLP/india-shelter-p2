import InfoIcon from '../../../../assets/icons/info.svg';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components';
import loading from '../../../../assets/icons/loading.svg';
import { useEffect, useState } from 'react';
import {
  checkBre99,
  checkBureau,
  checkDedupe,
  getAllLoanOfficers,
  getCompanyNamesList,
  verifyDL,
  verifyGST,
  verifyPFUAN,
  verifyPan,
  verifyVoterID,
} from '../../../../global';
import { func } from 'prop-types';

const pan = false;
const dl = true;
const voterId = false;
const pf = false;
const gst = true;

const BRE_ONE = () => {
  const [progress, setProgress] = useState(0);
  const [personalDetailsApi, setPersonalDetailsApi] = useState({
    label: '',
    res: false,
    loader: false,
    ran: false,
  });
  const [workIncomeApi, setWorkIncomeApi] = useState({
    label: '',
    res: false,
    loader: false,
    ran: false,
  });
  const [dedupe, setDedupe] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [bre99, setBre99] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [bureauOrCrif, setBureauOrCrif] = useState({
    label: '',
    res: false,
    loader: false,
    ran: false,
  });
  // const [bre101, setBre101] = useState({
  //   res: false,
  //   loader: false,
  //   ran: false,
  // });

  useEffect(() => {
    async function bre101() {
      if (pan) {
        setPersonalDetailsApi({
          ...personalDetailsApi,
          loader: true,
          ran: true,
          label: 'PAN card',
        });
        setProgress(1);

        // try {
        //   const pan_res = await verifyPan();

        //   if (pan_res.valid) {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'PAN card',
        //       res: 'Valid Match',
        //     });
        //   } else {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'PAN card',
        //       res: 'Invalid',
        //     });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setPersonalDetailsApi({
        //     ...personalDetailsApi,
        //     loader: false,
        //     ran: true,
        //     label: 'PAN card',
        //     res: 'Error',
        //   });
        // }
      }

      if (dl) {
        setPersonalDetailsApi({
          ...personalDetailsApi,
          loader: true,
          ran: true,
          label: 'Driving license',
        });
        setProgress(1);

        // try {
        //   const dl_res = await verifyDL();

        //   if (dl_res.valid) {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'Driving license',
        //       res: 'Valid Match',
        //     });
        //   } else {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'Driving license',
        //       res: 'Invalid',
        //     });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setPersonalDetailsApi({
        //     ...personalDetailsApi,
        //     loader: false,
        //     ran: true,
        //     label: 'Driving license',
        //     res: 'Error',
        //   });
        // }
      }

      if (voterId) {
        setPersonalDetailsApi({
          ...personalDetailsApi,
          loader: true,
          ran: true,
          label: 'Voter ID',
        });
        setProgress(1);

        // try {
        //   const voterId_res = verifyVoterID();

        //   if (voterId_res.valid) {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'Voter ID',
        //       res: 'Valid Match',
        //     });
        //   } else {
        //     setPersonalDetailsApi({
        //       ...personalDetailsApi,
        //       loader: false,
        //       ran: true,
        //       label: 'Voter ID',
        //       res: 'Invalid',
        //     });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setPersonalDetailsApi({
        //     ...personalDetailsApi,
        //     loader: false,
        //     ran: true,
        //     label: 'Voter ID',
        //     res: 'Error',
        //   });
        // }
      }

      if (pf) {
        setWorkIncomeApi({ ...workIncomeApi, loader: true, ran: true, label: 'PF UAN' });
        setProgress(2);

        // try {
        //   const pf_res = verifyPFUAN();

        //   if (pf_res.valid) {
        //     setWorkIncomeApi({
        //       ...workIncomeApi,
        //       loader: false,
        //       ran: true,
        //       label: 'PF UAN',
        //       res: 'Valid Match',
        //     });
        //   } else {
        //     setWorkIncomeApi({
        //       ...workIncomeApi,
        //       loader: false,
        //       ran: true,
        //       label: 'PF UAN',
        //       res: 'Invalid',
        //     });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setWorkIncomeApi({
        //     ...workIncomeApi,
        //     loader: false,
        //     ran: true,
        //     label: 'PF UAN',
        //     res: 'Error',
        //   });
        // }
      }

      if (gst) {
        setWorkIncomeApi({ ...workIncomeApi, loader: true, ran: true, label: 'GST IN' });
        setProgress(2);

        // try {
        //   const gst_res = verifyGST();

        //   if (gst_res.valid) {
        //     setWorkIncomeApi({
        //       ...workIncomeApi,
        //       loader: false,
        //       ran: true,
        //       label: 'GST IN',
        //       res: 'Valid Match',
        //     });
        //   } else {
        //     setWorkIncomeApi({
        //       ...workIncomeApi,
        //       loader: false,
        //       ran: true,
        //       label: 'GST IN',
        //       res: 'InValid',
        //     });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setWorkIncomeApi({
        //     ...workIncomeApi,
        //     loader: false,
        //     ran: true,
        //     label: 'GST IN',
        //     res: 'Error',
        //   });
        // }
      }

      setDedupe({ ...dedupe, loader: true, ran: true });
      setProgress(3);

      // try {
      //   const dedupe_res = await checkDedupe();

      //   if (dedupe_res === 200) {
      //     setDedupe({ ...dedupe, loader: false, ran: true, res: 'Valid Match' });
      //   }
      // } catch (err) {
      //   console.log(err);
      //   setDedupe({ ...dedupe, loader: false, ran: true, res: 'Error' });
      // }

      setBre99({ ...bre99, loader: true, ran: true });
      setProgress(4);

      // try {
      //   const bre99_res = await checkBre99();

      //   if (bre99_res === 200) {
      //     setBre99({ ...bre99, loader: false, ran: true, res: 'Valid Match' });
      //   }
      // } catch (err) {
      //   console.log(err);
      //   setBre99({ ...bre99, loader: false, ran: true, res: 'Error' });
      // }

      const bre99_res = {
        value: 'Bureau',
      };

      if (bre99_res.value === 'Bureau') {
        setBureauOrCrif({ ...bureauOrCrif, loader: true, ran: true, label: 'Bureau' });
        setProgress(5);

        // try {
        //   const bureau_res = await checkBureau();

        //   if (bureau_res === 200) {
        //     setBureauOrCrif({ ...bre99, loader: false, ran: true, res: 'Valid Match', label: 'Bureau' });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setBureauOrCrif({ ...bre99, loader: false, ran: true, res: 'Error', label: 'Bureau' });
        // }
      } else {
        setBureauOrCrif({ ...bureauOrCrif, loader: true, ran: true, label: 'CRIF' });
        setProgress(5);

        // try {
        //   const bureau_res = await checkCRIF();

        //   if (crif_res === 200) {
        //     setBureauOrCrif({ ...bre99, loader: false, ran: true, res: 'Valid Match', label: 'CRIF' });
        //   }
        // } catch (err) {
        //   console.log(err);
        //   setBureauOrCrif({ ...bre99, loader: false, ran: true, res: 'Error', label: 'CRIF' });
        // }
      }
    }
    bre101();
  }, []);

  // useEffect(() => {
  //   console.log(personalDetailsApi.label);
  //   console.log(workIncomeApi.label);
  //   async function verifydetails() {
  //     await Promise.all([getCompanyNamesList(), getAllLoanOfficers()])
  //       .then((res) => {
  //         console.log(res.status);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  //   verifydetails();
  // }, [personalDetailsApi.label, workIncomeApi.label]);

  // useEffect(() => {
  //   async function verifydetails() {
  //     if (personalDetailsApi.res && workIncomeApi.res && dedupe.res) {
  //       try {
  //         const bre99_res = await checkBre99();
  //       } catch (err) {
  //         console.log(err);
  //       }

  //       try {
  //         if (bre99_res === 'CIBIL') {
  //           const bureau_res = await checkBereau();
  //         } else {
  //           // call CRIF
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }
  //   verifydetails();
  // }, [personalDetailsApi, workIncomeApi]);

  // setTimeout(() => {
  //   setBre99({ ...bre99, loader: true, ran: true });
  //   setProgress(4);

  //   if (pan) {
  //     setPersonalDetailsApi({
  //       ...personalDetailsApi,
  //       loader: false,
  //       ran: true,
  //       label: 'PAN card',
  //       res: 'Valid Match',
  //     });
  //   }
  //   if (dl) {
  //     setPersonalDetailsApi({
  //       ...personalDetailsApi,
  //       loader: false,
  //       ran: true,
  //       label: 'Driving license',
  //       res: 'Error',
  //     });
  //   }
  //   if (voterId) {
  //     setPersonalDetailsApi({
  //       ...personalDetailsApi,
  //       loader: false,
  //       ran: true,
  //       label: 'Voter ID',
  //       res: 'Valid Match',
  //     });
  //   }
  //   if (pf) {
  //     setWorkIncomeApi({
  //       ...workIncomeApi,
  //       loader: false,
  //       ran: true,
  //       label: 'PF UAN',
  //       res: 'Valid Match',
  //     });
  //   }
  //   if (gst) {
  //     setWorkIncomeApi({
  //       ...workIncomeApi,
  //       loader: false,
  //       ran: true,
  //       label: 'GST IN',
  //       res: 'Valid Match',
  //     });
  //   }

  //   setDedupe({ ...dedupe, loader: false, ran: true, res: 'Valid Match' });
  // }, 6000);

  // setTimeout(() => {
  //   setBureau({ ...bureau, loader: true, ran: true });
  //   setProgress(5);

  //   setBre99({ ...bre99, loader: false, ran: true, res: 'Valid Match' });
  // }, 12000);

  // setTimeout(() => {
  //   setBureau({ ...bureau, loader: false, ran: true, res: 'Valid Match' });
  // }, 18000);

  return (
    <div className='p-4 relative h-screen'>
      <div className='flex items-start gap-2'>
        <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
        <p className='text-xs not-italic font-normal text-dark-grey'>
          The qualifier provides information regarding the status of all the verification and lead
          eligibility.
        </p>
      </div>

      <div className='mt-4'>
        <p className='text-xs text-primary-black font-normal'>Applicant name: Santosh Yadav</p>
        <div className='flex justify-between text-primary-black font-medium'>
          <h3>Verification in progress</h3>
          <h3>{progress}/5</h3>
        </div>

        <div className='flex justify-center mt-3'>
          <svg
            width='152'
            height='78'
            viewBox='0 0 152 78'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M152 75.9875C152 55.8343 143.993 36.5066 129.74 22.2562C115.487 8.0058 96.1565 1.53945e-06 76 1.79328e-08C55.8436 -1.50359e-06 36.5127 8.0058 22.2599 22.2562C8.00713 36.5066 3.14666e-06 55.8343 1.03116e-07 75.9875H19C19 60.8726 25.0053 46.3768 35.6949 35.689C46.3845 25.0012 60.8827 18.9969 76 18.9969C91.1174 18.9969 105.616 25.0012 116.305 35.689C126.995 46.3768 133 60.8726 133 75.9875H152Z'
              fill='#3DB267'
            />
            <path
              d='M39.1918 9.50665C27.2832 16.0979 17.3636 25.7658 10.4694 37.5004C3.57531 49.2349 -0.0403256 62.6053 0.000339267 76.2145L19.0003 76.1577C18.9698 65.9508 21.6815 55.923 26.8521 47.1221C32.0227 38.3212 39.4624 31.0703 48.3939 26.1269L39.1918 9.50665Z'
              fill='#E15555'
            />
            <path
              d='M114 10.1804C102.475 3.52772 89.4056 0.0172316 76.0981 6.3276e-05C62.7905 -0.017105 49.7118 3.45965 38.17 10.0826L47.6275 26.5588C56.2838 21.5916 66.0929 18.984 76.0735 18.9969C86.0542 19.0098 95.8565 21.6427 104.5 26.6322L114 10.1804Z'
              fill='#FF9D4A'
            />
            <path
              d='M21.0002 41.536L77.589 69.9524L73.9079 76.3271L21.0002 41.536Z'
              fill='#272525'
            />
            <path
              d='M76.5428 68.9797C78.5408 70.133 79.265 72.6189 78.1603 74.532C77.0556 76.4451 74.5403 77.0609 72.5423 75.9076C70.5443 74.7542 69.8201 72.2684 70.9248 70.3553C72.0295 68.4422 74.5448 67.8263 76.5428 68.9797Z'
              fill='#272525'
            />
          </svg>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!personalDetailsApi.ran ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                  stroke='#EC7739'
                  strokeWidth='1.5'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='13'
                viewBox='0 0 18 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='#147257'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <p className='text-sm text-primary-black'>{personalDetailsApi.label}</p>
          </div>
          {personalDetailsApi.loader ? (
            <div className='ml-auto'>
              <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
            </div>
          ) : null}
          {personalDetailsApi.res && (
            <span className='text-xs font-normal text-light-grey'>{personalDetailsApi.res}</span>
          )}
        </div>

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!workIncomeApi.ran ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                  stroke='#EC7739'
                  strokeWidth='1.5'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='13'
                viewBox='0 0 18 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='#147257'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <p className='text-sm text-primary-black'>{workIncomeApi.label}</p>
          </div>
          <div>
            {workIncomeApi.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {workIncomeApi.res && (
              <span className='text-xs font-normal text-light-grey'>{workIncomeApi.res}</span>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!dedupe.ran ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                  stroke='#EC7739'
                  strokeWidth='1.5'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='13'
                viewBox='0 0 18 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='#147257'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <p className='text-sm text-primary-black'>Dedupe</p>
          </div>
          <div>
            {dedupe.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {dedupe.res && (
              <span className='text-xs font-normal text-light-grey'>{dedupe.res}</span>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!bre99.ran ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                  stroke='#EC7739'
                  strokeWidth='1.5'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='13'
                viewBox='0 0 18 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='#147257'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <p className='text-sm text-primary-black'>BRE 99</p>
          </div>
          <div>
            {bre99.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {bre99.res && <span className='text-xs font-normal text-light-grey'>{bre99.res}</span>}
          </div>
        </div>

        {bre99.res && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!bureauOrCrif.ran ? (
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                    stroke='#EC7739'
                    strokeWidth='1.5'
                  />
                </svg>
              ) : (
                <svg
                  width='24'
                  height='13'
                  viewBox='0 0 18 13'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M17 1L6 12L1 7'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}

              <p className='text-sm text-primary-black'>{bureauOrCrif.label}</p>
            </div>
            <div>
              {bureauOrCrif.loader ? (
                <div className='ml-auto'>
                  <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
                </div>
              ) : null}
              {bureauOrCrif.res && (
                <span className='text-xs font-normal text-light-grey'>{bureauOrCrif.res}</span>
              )}
            </div>
          </div>
        )}

        {/* <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!bre101.ran ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.4 15.2C17.8833 17.1777 16.4721 20 14 20L10 20C7.52786 20 6.11672 17.1777 7.6 15.2L8.65 13.8C9.45 12.7333 9.45 11.2667 8.65 10.2L7.6 8.8C6.11672 6.82229 7.52786 4 10 4L14 4C16.4721 4 17.8833 6.82229 16.4 8.8L15.35 10.2C14.55 11.2667 14.55 12.7333 15.35 13.8L16.4 15.2Z'
                  stroke='#EC7739'
                  strokeWidth='1.5'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='13'
                viewBox='0 0 18 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17 1L6 12L1 7'
                  stroke='#147257'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}

            <p className='text-sm text-primary-black'>PAN card</p>
          </div>
          <div>
            {bre101.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {gst.res && <span className='text-xs font-normal text-light-grey'>Valid Match</span>}
          </div>
        </div> */}
      </div>

      <p className='text-xs not-italic font-normal text-dark-grey mt-3 text-center'>
        Do not close the app or go back. Please wait for ID <br /> verification as it may take some
        time. We are validating these checks as per your consent
      </p>

      <div className='flex flex-col gap-[18px] absolute bottom-4 w-full p-4 left-2/4 -translate-x-2/4'>
        <div className='flex items-start gap-2'>
          <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
          <p className='text-sm not-italic font-normal text-dark-grey'>
            Eligibility can be increased by adding Co-applicant{' '}
            <Link
              className={`underline ${
                !bureauOrCrif.res ? 'text-light-grey pointer-events-none' : 'text-primary-red'
              }`}
            >
              Add now
            </Link>
          </p>
        </div>
        <Button disabled={!bureauOrCrif.res} inputClasses='w-full h-14' primary={true}>
          Next
        </Button>
      </div>
    </div>
  );
};
export default BRE_ONE;
