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
  editFieldsById,
  getApplicantById,
} from '../../../../global';
import { Button } from '../../../../components';
import SpeedoMeterAnimation from '../../../../components/speedometer';
import LeadContextProvider, { LeadContext } from '../../../../context/LeadContextProvider';

const Qualifier = () => {
  const addApplicant = useContext(LeadContextProvider);
  const { activeIndex, values, setFieldValue } = useContext(LeadContext);

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
  const [finalApi, setFinalApi] = useState([]);

  useEffect(() => {
    async function breOne() {
      const res = await getApplicantById(values?.applicants?.[activeIndex]?.applicant_details.id);

      const bre_101_response = res.bre_101_response;

      if (bre_101_response) {
        setProgress(res.extra_params.qualifier_api_progress);
        setFinalApi(res.extra_params.qualifier_api_progress);

        setDL((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: bre_101_response.body.Display.DL_Status,
        }));

        setVoterID((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: bre_101_response.body.Display.Voter_Status,
        }));

        setPfUAN((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: bre_101_response.body.Display.UAN_Status,
        }));

        setGST((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: bre_101_response.body.Display.GST_Status,
        }));

        setPAN((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: bre_101_response.body.Display.PAN_status,
        }));

        setDedupe((prev) => ({ ...prev, ran: true }));
        setBre99((prev) => ({ ...prev, ran: true }));
        setBureau((prev) => ({ ...prev, ran: true }));

        if (bre_101_response.body.Display.red_amber_green === 'Red') {
          setBre101((prev) => ({ ...prev, red: true, res: true }));
        }
        if (bre_101_response.body.Display.red_amber_green === 'Amber') {
          setBre101((prev) => ({ ...prev, amber: true, res: true }));
        }
        if (bre_101_response.body.Display.red_amber_green === 'Green') {
          setBre101((prev) => ({ ...prev, green: true, res: true }));
        }

        return;
      }

      let final_api = [];

      if (values.applicants[activeIndex]?.personal_details.id_type === 'PAN') {
        setPAN((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));

        final_api.push(verifyPan(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      } else if (values.applicants[activeIndex]?.personal_details.id_type === 'Driving license') {
        setDL((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));

        final_api.push(verifyDL(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      } else if (values.applicants[activeIndex]?.personal_details.id_type === 'Voter ID') {
        setVoterID((prev) => ({
          ...prev,
          loader: true,
          ran: true,
        }));

        final_api.push(verifyVoterID(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      }

      if (!values.applicants[activeIndex]?.personal_details?.extra_params?.same_as_id_type) {
        if (
          values.applicants[activeIndex]?.personal_details.selected_address_proof ===
          'Driving license'
        ) {
          setDL((prev) => ({
            ...prev,
            loader: true,
            ran: true,
          }));

          final_api.push(verifyDL(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
        } else if (
          values.applicants[activeIndex]?.personal_details.selected_address_proof === 'Voter ID'
        ) {
          setVoterID((prev) => ({
            ...prev,
            loader: true,
            ran: true,
          }));

          final_api.push(
            verifyVoterID(values?.applicants?.[activeIndex]?.applicant_details.id, {}),
          );
        }
      }

      if (values.applicants[activeIndex]?.work_income_detail.pf_uan) {
        setPfUAN((prev) => ({ ...prev, loader: true, ran: true }));

        final_api.push(verifyPFUAN(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      } else if (values.applicants[activeIndex]?.work_income_detail.gst_number) {
        setGST((prev) => ({ ...prev, loader: true, ran: true }));

        final_api.push(verifyGST(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      }

      setDedupe((prev) => ({ ...prev, loader: true, ran: true }));
      final_api.push(checkDedupe(values?.applicants?.[activeIndex]?.applicant_details.id, {}));

      try {
        let response = null;

        setProgress(final_api.length);
        setFinalApi(final_api.length + 2);
        response = await Promise.allSettled([...final_api]);

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

      let callCibilOrCrif = '';

      try {
        setBre99((prev) => ({ ...prev, loader: true, ran: true }));
        setProgress(final_api.length + 1);

        const bre99_res = await checkBre99(
          values?.applicants?.[activeIndex]?.applicant_details.id,
          {},
        );

        if (bre99_res.bre_99_response.statusCode == 200) {
          setBre99((prev) => ({ ...prev, loader: false, res: 'Valid' }));
          const bre99body = bre99_res.bre_99_response.body;
          callCibilOrCrif = bre99body.find((data) => data.Rule_Name === 'Bureau_Type');
        }
      } catch (err) {
        console.log(err);
        setBre99((prev) => ({ ...prev, loader: false, res: 'Error' }));
      }

      setBureau((prev) => ({ ...prev, loader: true, ran: true }));
      setProgress(final_api.length + 2);

      if (callCibilOrCrif.Rule_Value === 'CIBIL') {
        try {
          const cibil_res = await checkCibil(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            {},
          );
          if (cibil_res.status == 200) {
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
          const crif_res = await checkCrif(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            {},
          );
          if (crif_res.status == 200) {
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
        const bre_res = await checkBre101(
          values?.applicants?.[activeIndex]?.applicant_details.id,
          {},
        );

        if (bre_res.bre_101_response.statusCode != 200) return;

        let new_data = { ...values };

        const extra_parmas = new_data.applicants[activeIndex].applicant_details.extra_params;
        const edited_extra_params = {
          ...extra_parmas,
          qualifier: true,
          qualifier_api_progress: final_api.length + 2,
        };

        await editFieldsById(values?.applicants?.[activeIndex]?.applicant_details.id, 'applicant', {
          bre_101_response: bre_res.bre_101_response,
          extra_params: edited_extra_params,
        });

        setFieldValue(`applicants[${activeIndex}].applicant_details.extra_params.qualifier`, true);

        setDL((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Display.DL_Status,
        }));

        setVoterID((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Display.Voter_Status,
        }));

        setPfUAN((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Display.UAN_Status,
        }));

        setGST((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Display.GST_Status,
        }));

        setPAN((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_101_response.body.Display.PAN_status,
        }));

        if (bre_res.bre_101_response.body.Display.red_amber_green === 'Red') {
          setBre101((prev) => ({ ...prev, red: true, res: true }));
        }
        if (bre_res.bre_101_response.body.Display.red_amber_green === 'Amber') {
          setBre101((prev) => ({ ...prev, amber: true, res: true }));
        }
        if (bre_res.bre_101_response.body.Display.red_amber_green === 'Green') {
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
        <p className='text-xs text-primary-black font-normal truncate'>
          Applicant name:
          {` ${values.applicants?.[activeIndex]?.applicant_details?.first_name} ${values.applicants?.[activeIndex]?.applicant_details?.middle_name} ${values.applicants?.[activeIndex]?.applicant_details?.last_name}`}
        </p>
        <div className='flex justify-between text-primary-black font-medium'>
          <h3>Verification in progress</h3>
          <h3>
            {progress}/{finalApi}
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
                loop
                play
                ref={SpeedoMeterAnimationRef}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        {(values.applicants[activeIndex]?.personal_details.id_type === 'PAN' ||
          values.applicants[activeIndex]?.personal_details.selected_address_proof === 'PAN') && (
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

        {(values.applicants[activeIndex]?.personal_details.id_type === 'Driving license' ||
          values.applicants[activeIndex]?.personal_details.selected_address_proof ===
            'Driving license') && (
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

        {(values.applicants[activeIndex]?.personal_details.id_type === 'Voter ID' ||
          values.applicants[activeIndex]?.personal_details.selected_address_proof ===
            'Voter ID') && (
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

        {values.applicants[activeIndex]?.work_income_detail.pf_uan && (
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

        {values.applicants[activeIndex]?.work_income_detail.gst_number && (
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
              link='/lead/applicant-details'
            >
              Add now
            </Button>
          </p>
        </div>
        <Button
          disabled={!bre101.res}
          inputClasses='w-full h-14'
          primary={true}
          link='/lead/lnt-charges'
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Qualifier;
