import InfoIcon from '../../../../assets/icons/info.svg';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components';
import loading from '../../../../assets/icons/loading.svg';
import { useEffect, useRef, useState } from 'react';
import {
  checkBre99,
  checkCibil,
  checkCrif,
  checkDedupe,
  verifyDL,
  verifyGST,
  verifyPFUAN,
  verifyPan,
  verifyVoterID,
} from '../../../../global';
import { array, func } from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from '@lottiefiles/lottie-interactivity';
import SpeedoMeterAnimation from '../../../../components/speedometer';

const pan = false;
const dl = true;
const voterId = false;
const pf = true;
const gst = false;
// values.applicants[activeIndex]?.personal_details.id_type === 'PAN'
// values.applicants[activeIndex]?.personal_details.id_type === 'DL'
// values.applicants[activeIndex]?.personal_details.id_type === 'VoterID'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'PAN'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'DL'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'VoterID'
// values.applicants[activeIndex]?.work_income_details.pf_uan
// values.applicants[activeIndex]?.work_income_details.gst_number

const BRE_ONE = () => {
  const SpeedoMeterAnimationRef = useRef(null);
  const [progress, setProgress] = useState(0);
  // const [personalDetailsApi, setPersonalDetailsApi] = useState({
  //   label: '',
  //   res: false,
  //   loader: false,
  //   ran: false,
  // });
  const [PAN, setPAN] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [DL, setDL] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [voterID, setVoterID] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [pfUAN, setPfUAN] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [GST, setGST] = useState({
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
  const [bureau, setBureau] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [bre101, setBre101] = useState(false);
  const [breres, setBreres] = useState({
    res: false,
    red: false,
    orange: false,
    green: false,
  });

  useEffect(() => {
    async function breOne() {
      if (pan) {
        setPAN((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));
        setProgress(1);

        try {
          const pan_res = await verifyPan(1, {});

          if (pan_res.pan_response.status === 'Valid') {
            setPAN((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          } else {
            setPAN((prev) => ({
              ...prev,
              loader: false,
              res: 'Invalid',
            }));
          }
        } catch (err) {
          console.log(err);
          setPAN((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      if (dl) {
        setDL((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));
        setProgress(1);

        try {
          const dl_res = await verifyDL(1, {});

          if (dl_res.dl_response.result && dl_res.dl_response.statusCode === 101) {
            setDL((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          } else {
            setDL((prev) => ({
              ...prev,
              loader: false,
              res: 'Invalid',
            }));
          }
        } catch (err) {
          console.log(err);
          setDL((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      if (voterId) {
        setVoterID((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));
        setProgress(1);

        try {
          const voterId_res = await verifyVoterID(1, {});

          if (voterId_res.voter_response.result && voterId_res.voter_response.statusCode === 101) {
            setVoterID((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          } else {
            setVoterID((prev) => ({
              ...prev,
              loader: false,
              res: 'Invalid',
            }));
          }
        } catch (err) {
          console.log(err);
          setVoterID((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      if (pf) {
        setPfUAN((prev) => ({ ...prev, loader: true, ran: true }));
        setProgress(2);

        try {
          const pf_res = await verifyPFUAN(1, {});

          if (pf_res.uan_response.result && pf_res.uan_response.statusCode === 101) {
            setPfUAN((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          } else {
            setPfUAN((prev) => ({
              ...prev,
              loader: false,
              res: 'Invalid',
            }));
          }
        } catch (err) {
          console.log('error in pf');
          console.log(err);
          setPfUAN((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      if (gst) {
        setGST((prev) => ({ ...prev, loader: true, ran: true }));
        setProgress(2);

        try {
          const gst_res = await verifyGST(1, {});

          if (gst_res.gst_response.result && gst_res.gst_response.statusCode === 101) {
            setGST((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          } else {
            setGST((prev) => ({
              ...prev,
              loader: false,
              res: 'InValid',
            }));
          }
        } catch (err) {
          console.log(err);
          setGST((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      // try {
      //   const array = await Promise.allSettled([
      //     pan ? verifyPan(1, {}) : null,
      //     dl ? verifyDL(1, {}) : null,
      //     voterID ? verifyVoterID(1, {}) : null,
      //   ]);

      //   const fulfilled_arr = array.map((api) => {
      //     return api.status === 'fulfilled';
      //   });

      //   const rejected_arr = array.map((api) => {
      //     return api.status === 'rejected';
      //   });

      //   console.log(fulfilled_arr);
      //   console.log(rejected_arr);

      //   if (array[0].status === 'fulfilled') {
      //     setPAN((prev) => ({
      //       ...prev,
      //       loader: false,
      //       res: array[0].value === 'yes' ? 'Valid Match' : 'Invalid',
      //     }));
      //   } else {
      //     setPAN((prev) => ({ ...prev, loader: false, res: 'Error' }));
      //   }

      //   if (array[1].status === 'fulfilled') {
      //     setPAN((prev) => ({
      //       ...prev,
      //       loader: false,
      //       res: array[1].value === 'yes' ? 'Valid Match' : 'Invalid',
      //     }));
      //   } else {
      //     setPAN((prev) => ({ ...prev, loader: false, res: 'Error' }));
      //   }

      //   if (array[2].status === 'fulfilled') {
      //     setPAN((prev) => ({
      //       ...prev,
      //       loader: false,
      //       res: array[2].value === 'yes' ? 'Valid Match' : 'Invalid',
      //     }));
      //   } else {
      //     setPAN((prev) => ({ ...prev, loader: false, res: 'Error' }));
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      setDedupe((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(3);

      try {
        const dedupe_res = await checkDedupe(1, {});

        if (dedupe_res.status === 200) {
          setDedupe((prev) => ({ ...prev, loader: false, res: 'Valid Match' }));
        }
      } catch (err) {
        console.log(err);
        setDedupe((prev) => ({ ...prev, loader: false, res: 'Error' }));
      }

      setBre99((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(4);

      let callCibilOrCrif = '';

      try {
        const bre99_res = await checkBre99(1, {});

        console.log(bre99_res);

        if (bre99_res.bre_99_response.statusCode === 200) {
          setBre99((prev) => ({ ...prev, loader: false, res: 'Valid Match' }));

          const bre99body = bre99_res.bre_99_response.body;
          callCibilOrCrif = bre99body.find((data) => data.Rule_Name === 'Bureau_Type');
        }
      } catch (err) {
        console.log(err);
        setBre99((prev) => ({ ...prev, loader: false, res: 'Error' }));
      }

      setBureau((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(5);

      if (callCibilOrCrif.Rule_Value === 'CIBIL') {
        console.log('cibil');
        try {
          const cibil_res = await checkCibil(1, {});

          if (cibil_res.status === 200) {
            setBureau((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          }
        } catch (err) {
          console.log(err);
          setBureau((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      } else {
        console.log('crif');
        try {
          const crif_res = await checkCrif(1, {});

          if (crif_res.status === 200) {
            setBureau((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid Match',
            }));
          }
        } catch (err) {
          console.log(err);
          setBureau((prev) => ({
            ...prev,
            loader: false,
            res: 'Error',
          }));
        }
      }

      // setTimeout(() => {
      //   setBreres((prev) => ({ ...prev, green: true, res: true }));
      // }, 3000);
    }
    breOne();
  }, []);

  function checkELigibilty() {
    if (breres.red) {
      return [1, 3];
    }
    if (breres.orange) {
      return [1, 42.5];
    }
    if (breres.green) {
      return [1, 30];
    } else {
      [];
    }
  }

  // console.log(breres.res);

  useEffect(() => {
    if (SpeedoMeterAnimationRef.current && breres.res);
    create({
      player: SpeedoMeterAnimationRef.current,
      mode: 'chain',
      actions: [
        {
          state: 'autoplay',
          frames: breres && checkELigibilty(),
          repeat: 1,
        },
      ],
    });
  }, [breres]);

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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transitionDuration: 2 }}
              exit={{ opacity: 0 }}
            >
              <SpeedoMeterAnimation
                id='speedo-meter-animation'
                className='w-[152px]'
                // className={`absolute h-[78px] top-0 md:top-auto md:bottom-0 left-0 w-full max-h-[600px]`}
                loop
                play
                ref={SpeedoMeterAnimationRef}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        {pan && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!PAN.ran ? (
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
            {PAN.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {PAN.res && <span className='text-xs font-normal text-light-grey'>{PAN.res}</span>}
          </div>
        )}

        {dl && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!DL.ran ? (
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

              <p className='text-sm text-primary-black'>Driving license</p>
            </div>
            {DL.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {DL.res && <span className='text-xs font-normal text-light-grey'>{DL.res}</span>}
          </div>
        )}

        {voterId && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!voterID.ran ? (
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

              <p className='text-sm text-primary-black'>Voter ID</p>
            </div>
            {voterID.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {voterID.res && (
              <span className='text-xs font-normal text-light-grey'>{voterID.res}</span>
            )}
          </div>
        )}

        {pf && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!pfUAN.ran ? (
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

              <p className='text-sm text-primary-black'>PF UAN</p>
            </div>
            <div>
              {pfUAN.loader ? (
                <div className='ml-auto'>
                  <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
                </div>
              ) : null}
              {pfUAN.res && (
                <span className='text-xs font-normal text-light-grey'>{pfUAN.res}</span>
              )}
            </div>
          </div>
        )}

        {gst && (
          <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {!GST.ran ? (
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

              <p className='text-sm text-primary-black'>GST</p>
            </div>
            <div>
              {GST.loader ? (
                <div className='ml-auto'>
                  <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
                </div>
              ) : null}
              {GST.res && <span className='text-xs font-normal text-light-grey'>{GST.res}</span>}
            </div>
          </div>
        )}

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

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!bureau.ran ? (
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

            <p className='text-sm text-primary-black'>Bureau</p>
          </div>
          <div>
            {bureau.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {bureau.res && (
              <span className='text-xs font-normal text-light-grey'>{bureau.res}</span>
            )}
          </div>
        </div>
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
                !bureau.res ? 'text-light-grey pointer-events-none' : 'text-primary-red'
              }`}
            >
              Add now
            </Link>
          </p>
        </div>
        <Button disabled={!bureau.res} inputClasses='w-full h-14' primary={true}>
          Next
        </Button>
      </div>
    </div>
  );
};
export default BRE_ONE;
