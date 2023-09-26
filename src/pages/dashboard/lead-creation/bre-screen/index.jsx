import { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { create } from '@lottiefiles/lottie-interactivity';

import InfoIcon from '../../../../assets/icons/info.svg';
import loading from '../../../../assets/icons/loading.svg';
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
  checkBre101,
} from '../../../../global';
import { Button } from '../../../../components';
import SpeedoMeterAnimation from '../../../../components/speedometer';
import LeadContextProvider from '../../../../context/LeadContextProvider';

const pan = true;
const dl = false;
const voterId = true;
const pf = false;
const gst = true;
// values.applicants[activeIndex]?.personal_details.id_type === 'PAN'
// values.applicants[activeIndex]?.personal_details.id_type === 'DL'
// values.applicants[activeIndex]?.personal_details.id_type === 'VoterID'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'PAN'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'DL'
// values.applicants[activeIndex]?.personal_details.selected_address_proof === 'VoterID'
// values.applicants[activeIndex]?.work_income_details.pf_uan
// values.applicants[activeIndex]?.work_income_details.gst_number

const BRE_ONE = () => {
  const addApplicant = useContext(LeadContextProvider);
  const SpeedoMeterAnimationRef = useRef(null);
  const [progress, setProgress] = useState(0);
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
  const [bre101, setBre101] = useState({
    res: false,
    red: false,
    amber: false,
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
      }

      if (dl) {
        setDL((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));
        setProgress(2);
      }

      if (voterId) {
        setVoterID((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));
        setProgress(2);
      }

      if (pf) {
        setPfUAN((prev) => ({ ...prev, loader: true, ran: true }));
        setProgress(dl || voterId ? 3 : 2);
      }

      if (gst) {
        setGST((prev) => ({ ...prev, loader: true, ran: true }));
        setProgress(dl || voterId ? 3 : 2);
      }

      setDedupe((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(dl || voterId ? 4 : 3);

      try {
        let response = null;

        if (dl && gst) {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyDL(293, {}),
            verifyGST(293, {}),
            checkDedupe(293, {}),
          ]);
        } else if (dl && pf) {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyDL(293, {}),
            verifyPFUAN(293, {}),
            checkDedupe(293, {}),
          ]);
        } else if (voterId && gst) {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyVoterID(293, {}),
            verifyGST(293, {}),
            checkDedupe(293, {}),
          ]);
        } else if (voterId && pf) {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyVoterID(293, {}),
            verifyPFUAN(293, {}),
            checkDedupe(293, {}),
          ]);
        } else if (pf) {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyPFUAN(293, {}),
            checkDedupe(293, {}),
          ]);
        } else {
          response = await Promise.allSettled([
            verifyPan(293, {}),
            verifyGST(293, {}),
            checkDedupe(293, {}),
          ]);
        }

        const filtered_dedupe_res = response.find((res) => {
          return res.value.status == 200;
        });

        if (!filtered_dedupe_res) {
          setDedupe((prev) => ({ ...prev, loader: false, res: 'Error' }));
        } else {
          setDedupe((prev) => ({ ...prev, loader: false, res: 'Valid' }));
        }
      } catch (err) {
        console.log('error occured');
      }

      setBre99((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(dl || voterId ? 5 : 4);

      let callCibilOrCrif = '';

      try {
        const bre99_res = await checkBre99(293, {});

        if (bre99_res.bre_99_response.statusCode === 200) {
          setBre99((prev) => ({ ...prev, loader: false, res: 'Valid' }));
          const bre99body = bre99_res.bre_99_response.body;
          callCibilOrCrif = bre99body.find((data) => data.Rule_Name === 'Bureau_Type');
        }
      } catch (err) {
        console.log(err);
        setBre99((prev) => ({ ...prev, loader: false, res: 'Error' }));
      }

      setBureau((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(dl || voterId ? 6 : 5);

      if (callCibilOrCrif.Rule_Value === 'CIBIL') {
        try {
          const cibil_res = await checkCibil(293, {});
          if (cibil_res.status === 200) {
            setBureau((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid',
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
        try {
          const crif_res = await checkCrif(293, {});
          if (crif_res.status === 200) {
            setBureau((prev) => ({
              ...prev,
              loader: false,
              res: 'Valid',
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

      try {
        const bre_res = await checkBre101(89, {});

        if (bre_res.bre_101_response.statusCode !== '200') return;

        setDL((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.DL_Status,
        }));

        setVoterID((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Voter_Status,
        }));

        setPfUAN((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.UAN_Status,
        }));

        setGST((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.GST_Status,
        }));

        setPAN((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.PAN_status,
        }));

        if (bre_res.bre_101_response.body.red_amber_green === 'Red') {
          setBre101((prev) => ({ ...prev, red: true, res: true }));
        }
        if (bre_res.bre_101_response.body.red_amber_green === 'Amber') {
          setBre101((prev) => ({ ...prev, amber: true, res: true }));
        }
        if (bre_res.bre_101_response.body.red_amber_green === 'Green') {
          setBre101((prev) => ({ ...prev, green: true, res: true }));
        }
      } catch (err) {
        console.log(err);
      }
    }

    breOne();
  }, []);

  function checkELigibilty() {
    if (bre101.red) {
      return [1, 3];
    }
    if (bre101.amber) {
      return [1, 42.5];
    }
    if (bre101.green) {
      return [1, 30];
    } else {
      [];
    }
  }

  useEffect(() => {
    if (SpeedoMeterAnimationRef.current && bre101.res);
    create({
      player: SpeedoMeterAnimationRef.current,
      mode: 'chain',
      actions: [
        {
          state: 'autoplay',
          frames: bre101.res && checkELigibilty(),
          repeat: 1,
        },
      ],
    });
  }, [bre101]);

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
          <h3>
            {progress}/{voterId || dl ? 6 : 5}
          </h3>
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
            <Button
              className={`underline ${
                !bre101.res ? 'text-light-grey pointer-events-none' : 'text-primary-red'
              }`}
              onClick={() => addApplicant()}
            >
              Add now
            </Button>
          </p>
        </div>
        <Button disabled={!bre101.res} inputClasses='w-full h-14' primary={true}>
          Next
        </Button>
      </div>
    </div>
  );
};
export default BRE_ONE;
