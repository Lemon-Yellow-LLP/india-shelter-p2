import { useContext, useEffect, useRef, useState } from 'react';

import InfoIcon from '../../../../assets/icons/info.svg';
import loading from '../../../../assets/icons/loading.svg';
import {
  checkBre99,
  checkCibil,
  checkCrif,
  verifyDL,
  verifyGST,
  verifyPFUAN,
  verifyPan,
  verifyVoterID,
  checkBre101,
  editFieldsById,
  getApplicantById,
  checkBre201,
  pushToSalesforce,
  getLeadById,
} from '../../../../global';
import { Button, ToastMessage } from '../../../../components';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { AuthContext } from '../../../../context/AuthContextProvider';

const Eligibility = () => {
  const { activeIndex, values, setFieldValue } = useContext(LeadContext);
  const { toastMessage, setToastMessage } = useContext(AuthContext);

  const [progress, setProgress] = useState(0);
  const [finalApi, setFinalApi] = useState(0);

  const [PAN, setPAN] = useState({
    res: false,
    loader: false,
    ran: false,
    status: null,
  });
  const [DL, setDL] = useState({
    res: false,
    loader: false,
    ran: false,
    status: null,
  });
  const [voterID, setVoterID] = useState({
    res: false,
    loader: false,
    ran: false,
    status: null,
  });
  const [pfUAN, setPfUAN] = useState({
    res: false,
    loader: false,
    ran: false,
    status: null,
  });
  const [GST, setGST] = useState({
    res: false,
    loader: false,
    ran: false,
    status: null,
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
  const [faceMatch, setFaceMatch] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [upiName, setUpiName] = useState({
    res: false,
    loader: false,
    ran: false,
  });
  const [display, setDisplay] = useState(false);
  const [bre201, setBre201] = useState(false);

  useEffect(() => {
    async function breTwo() {
      const lead = await getLeadById(values?.applicants?.[activeIndex]?.applicant_details.lead_id);
      const res = await getApplicantById(values?.applicants?.[activeIndex]?.applicant_details.id);

      if (lead.bre_101_response && lead.bre_201_response) {
        setProgress(
          values?.applicants?.[activeIndex]?.applicant_details.extra_params
            .eligibility_api_progress,
        );
        setFinalApi(
          values?.applicants?.[activeIndex]?.applicant_details.extra_params
            .eligibility_api_progress,
        );

        setDL((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: values?.applicants?.[activeIndex]?.applicant_details.extra_params.DL_Status,
          status: values?.applicants?.[activeIndex]?.applicant_details.extra_params.DL_Status,
        }));

        setVoterID((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: values?.applicants?.[activeIndex]?.applicant_details.extra_params.Voter_Status,
          status: values?.applicants?.[activeIndex]?.applicant_details.extra_params.Voter_Status,
        }));

        setPfUAN((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: values?.applicants?.[activeIndex]?.applicant_details.extra_params.UAN_Status,
          status: values?.applicants?.[activeIndex]?.applicant_details.extra_params.UAN_Status,
        }));

        setGST((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: values?.applicants?.[activeIndex]?.applicant_details.extra_params.GST_Status,
          status: values?.applicants?.[activeIndex]?.applicant_details.extra_params.GST_Status,
        }));

        setPAN((prev) => ({
          ...prev,
          loader: false,
          ran: true,
          res: values?.applicants?.[activeIndex]?.applicant_details.extra_params.PAN_status,
          status: values?.applicants?.[activeIndex]?.applicant_details.extra_params.PAN_status,
        }));

        setFaceMatch((prev) => ({ ...prev, ran: true }));

        setUpiName((prev) => ({ ...prev, ran: true }));

        setBre201(true);

        // setFaceMatch((prev) => ({ ...prev, ran: true, res: res.bre_101_response.body.Display }));
        // setUpiName((prev) => ({ ...prev, ran: true, res: res.bre_101_response.body.Display }));
        // setBre99((prev) => ({ ...prev, ran: true, res: res.bre_101_response.body.Display }));
        // setBureau((prev) => ({ ...prev, ran: true, res: res.bre_101_response.body.Display }));

        if (
          values?.applicants?.[activeIndex]?.applicant_details.extra_params.PAN_status !==
            'Valid' ||
          values?.applicants?.[activeIndex]?.applicant_details.extra_params.DL_Status !== 'Valid' ||
          values?.applicants?.[activeIndex]?.applicant_details.extra_params.Voter_Status !==
            'Valid' ||
          values?.applicants?.[activeIndex]?.applicant_details.extra_params.UAN_Status !==
            'Valid' ||
          values?.applicants?.[activeIndex]?.applicant_details.extra_params.GST_Status !== 'Valid'
        ) {
          setDisplay(true);
          setBre99((prev) => ({
            ...prev,
            ran: true,
            res: res.bre_101_response.body.Display.Bre99_Status,
          }));
          setBureau((prev) => ({
            ...prev,
            ran: true,
            res: res.bre_101_response.body.Display.Bureau_Status,
          }));
        }

        return;
      }

      setFaceMatch((prev) => ({ ...prev, loader: true, ran: true }));
      setUpiName((prev) => ({ ...prev, loader: true, ran: true }));

      setProgress(2);
      setFinalApi(2);

      let final_api = [];
      let edited_bre = null;

      if (res.bre_101_response.body.Display.PAN_status === 'Error') {
        setPAN((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.PAN_status,
        }));

        final_api.push(
          verifyPan(values?.applicants?.[activeIndex]?.applicant_details.id, { type: 'id' }, {}),
        );
      } else if (
        res.bre_101_response.body.Display.PAN_status === 'In-Valid' ||
        res.bre_101_response.body.Display.PAN_status === 'Valid No Match'
      ) {
        if (values?.applicants?.[activeIndex]?.personal_details?.id_type === 'PAN') {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.id_number !==
            res.extra_params.previous_id_number
          ) {
            setPAN((prev) => ({
              ...prev,
              loader: true,
              ran: true,
              status: res.bre_101_response.body.Display.PAN_status,
            }));

            final_api.push(
              verifyPan(
                values?.applicants?.[activeIndex]?.applicant_details.id,
                { type: 'id' },
                {},
              ),
            );
          }
        }
      }

      if (res.bre_101_response.body.Display.DL_Status === 'Error') {
        setDL((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.DL_Status,
        }));

        let type = null;

        if (values.applicants[activeIndex]?.personal_details.id_type === 'Driving license') {
          type = 'id';
        } else {
          type = 'address';
        }

        final_api.push(
          verifyDL(values?.applicants?.[activeIndex]?.applicant_details.id, { type: type }, {}),
        );
      } else if (
        res.bre_101_response.body.Display.DL_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.DL_Status === 'Valid No Match'
      ) {
        if (values?.applicants?.[activeIndex]?.personal_details?.id_type === 'Driving license') {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.id_number !==
            res.extra_params.previous_id_number
          ) {
            setDL((prev) => ({
              ...prev,
              loader: true,
              ran: true,
              status: res.bre_101_response.body.Display.DL_Status,
            }));

            final_api.push(
              verifyDL(values?.applicants?.[activeIndex]?.applicant_details.id, { type: 'id' }, {}),
            );
          }
        } else {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.address_proof_number !==
            res.extra_params.previous_address_proof_number
          ) {
            setDL((prev) => ({
              ...prev,
              loader: true,
              ran: true,
              status: res.bre_101_response.body.Display.DL_Status,
            }));

            final_api.push(
              verifyDL(
                values?.applicants?.[activeIndex]?.applicant_details.id,
                { type: 'address' },
                {},
              ),
            );
          }
        }
      }

      if (res.bre_101_response.body.Display.Voter_Status === 'Error') {
        setVoterID((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.Voter_Status,
        }));

        let type = null;

        if (values.applicants[activeIndex]?.personal_details.id_type === 'Voter ID') {
          type = 'id';
        } else {
          type = 'address';
        }

        final_api.push(
          verifyVoterID(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            { type: type },
            {},
          ),
        );
      } else if (
        res.bre_101_response.body.Display.Voter_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.Voter_Status === 'Valid No Match'
      ) {
        if (values?.applicants?.[activeIndex]?.personal_details?.id_type === 'Voter ID') {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.id_number !==
            res.extra_params.previous_id_number
          ) {
            setVoterID((prev) => ({
              ...prev,
              loader: true,
              ran: true,
              status: res.bre_101_response.body.Display.Voter_Status,
            }));

            final_api.push(
              verifyVoterID(
                values?.applicants?.[activeIndex]?.applicant_details.id,
                { type: 'id' },
                {},
              ),
            );
          }
        } else {
          if (
            values?.applicants?.[activeIndex]?.personal_details?.address_proof_number !==
            res.extra_params.previous_address_proof_number
          ) {
            setVoterID((prev) => ({
              ...prev,
              loader: true,
              ran: true,
              status: res.bre_101_response.body.Display.Voter_Status,
            }));

            final_api.push(
              verifyVoterID(
                values?.applicants?.[activeIndex]?.applicant_details.id,
                { type: 'address' },
                {},
              ),
            );
          }
        }
      }

      if (res.bre_101_response.body.Display.UAN_Status === 'Error') {
        setPfUAN((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.UAN_Status,
        }));

        final_api.push(verifyPFUAN(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      } else if (
        res.bre_101_response.body.Display.UAN_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.UAN_Status === 'Valid No Match'
      ) {
        if (
          values?.applicants?.[activeIndex]?.work_income_detail?.pf_uan !==
          res.extra_params.previous_pf_uan
        ) {
          setPfUAN((prev) => ({
            ...prev,
            loader: true,
            ran: true,
            status: res.bre_101_response.body.Display.UAN_Status,
          }));

          final_api.push(verifyPFUAN(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
        }
      }

      if (res.bre_101_response.body.Display.GST_Status === 'Error') {
        setGST((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.GST_Status,
        }));

        final_api.push(verifyGST(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
      } else if (
        res.bre_101_response.body.Display.GST_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.GST_Status === 'Valid No Match'
      ) {
        if (
          values?.applicants?.[activeIndex]?.work_income_detail?.gst_number !==
          res.extra_params.previous_gst_number
        ) {
          setGST((prev) => ({
            ...prev,
            loader: true,
            ran: true,
            status: res.bre_101_response.body.Display.GST_Status,
          }));

          final_api.push(verifyGST(values?.applicants?.[activeIndex]?.applicant_details.id, {}));
        }
      }

      if (final_api.length !== 0) {
        setDisplay(true);

        try {
          setProgress(final_api.length + 2);
          setFinalApi(final_api.length + 4);

          await Promise.allSettled([...final_api]);
        } catch (err) {
          console.log(err);
        }

        let callCibilOrCrif = '';

        try {
          setBre99((prev) => ({ ...prev, loader: true, ran: true }));
          setProgress(final_api.length + 3);

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
        setProgress(final_api.length + 4);

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
            PAN_status: bre_res.bre_101_response.body.Display.PAN_status,
            DL_Status: bre_res.bre_101_response.body.Display.DL_Status,
            Voter_Status: bre_res.bre_101_response.body.Display.Voter_Status,
            UAN_Status: bre_res.bre_101_response.body.Display.UAN_Status,
            GST_Status: bre_res.bre_101_response.body.Display.GST_Status,
          };

          edited_bre = await editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            'applicant',
            {
              bre_101_response: bre_res.bre_101_response,
              extra_params: edited_extra_params,
            },
          );

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
        } catch (err) {
          console.log(err);
        }
      }

      console.log(edited_bre);

      try {
        const bre_res = await checkBre201(
          values?.applicants?.[activeIndex]?.applicant_details.lead_id,
          {},
        );

        if (bre_res.bre_201_response.statusCode != 200) return;

        setBre201(true);

        setFaceMatch((prev) => ({ ...prev, loader: false }));

        setUpiName((prev) => ({ ...prev, loader: false }));

        if (edited_bre) {
          const extra_parmas = edited_bre.extra_params;

          const edited_extra_params = {
            ...extra_parmas,
            eligibility: true,
            eligibility_api_progress: final_api.length !== 0 ? final_api.length + 4 : 2,
          };

          await editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            'applicant',
            {
              extra_params: edited_extra_params,
            },
          );
        } else {
          let new_data = { ...values };

          const extra_parmas = new_data.applicants[activeIndex].applicant_details.extra_params;

          const edited_extra_params = {
            ...extra_parmas,
            eligibility: true,
            eligibility_api_progress: final_api.length !== 0 ? final_api.length + 4 : 2,
          };

          await editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            'applicant',
            {
              extra_params: edited_extra_params,
            },
          );
        }
      } catch (err) {
        console.log(err);
      }

      // try {
      //   const bre_res = await pushToSalesforce(
      //     values?.applicants?.[activeIndex]?.applicant_details.lead_id,
      //     {},
      //   );
      //   if (bre_res.bre_201_response.statusCode != 200) return;
      // } catch (err) {
      //   console.log(err);
      // }

      // setTimeout(() => {
      //   setToastMessage('Data has been successfully pushed to the Salesforce');
      // }, 7000);
    }

    breTwo();
  }, []);

  return (
    <div className='p-4 h-screen'>
      <ToastMessage message={toastMessage} setMessage={setToastMessage} />

      <div className='flex items-start gap-2'>
        <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
        <p className='text-xs not-italic font-normal text-dark-grey'>
          The eligibilty provides information regarding the status of all the verification and lead
          eligibility.
        </p>
      </div>

      <div className='mt-4'>
        <p className='text-xs text-primary-black font-normal'>
          Applicant name:
          {' ' +
            values?.applicants?.[activeIndex]?.applicant_details.first_name +
            ' ' +
            values?.applicants?.[activeIndex]?.applicant_details.middle_name +
            ' ' +
            values?.applicants?.[activeIndex]?.applicant_details.last_name}
        </p>
        <p className='text-xs text-primary-black font-normal mt-0.5'>Salesforce ID: 1234567</p>
        <div className='flex justify-between text-primary-black font-medium mt-1'>
          {!bre201 ? <h3>Verification in progress</h3> : <h3>Application submitted</h3>}
          <h3>
            {progress}/{finalApi}
          </h3>
        </div>

        <div className='mt-3 bg-primary-black rounded-lg p-4'>
          {!bre201 ? (
            <div className='flex justify-center items-center gap-3'>
              <div className='ml-auto'>
                <img
                  src={loading}
                  alt='loading'
                  className='h-8 w-12 animate-spin duration-300 ease-out'
                />
              </div>

              <p className='text-white text-xs'>
                Thank you for your patience while the verification process is completed.
              </p>
            </div>
          ) : (
            <p className='text-white text-xs'>
              Lorem ipsum <br /> Lorem ipsum <br /> Lorem ipsum
            </p>
          )}
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2 h-[265px] overflow-auto'>
        {PAN.status === 'Error' || PAN.status === 'In-Valid' || PAN.status === 'Valid No Match' ? (
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
        ) : null}

        {DL.status === 'Error' || DL.status === 'In-Valid' || DL.status === 'Valid No Match' ? (
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
        ) : null}

        {voterID.status === 'Error' ||
        voterID.status === 'In-Valid' ||
        voterID.status === 'Valid No Match' ? (
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
        ) : null}

        {pfUAN.status === 'Error' ||
        pfUAN.status === 'In-Valid' ||
        pfUAN.status === 'Valid No Match' ? (
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
        ) : null}

        {GST.status === 'Error' || GST.status === 'In-Valid' || GST.status === 'Valid No Match' ? (
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
        ) : null}

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!faceMatch.ran ? (
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

            <p className='text-sm text-primary-black'>Face Match</p>
          </div>
          <div>
            {faceMatch.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {faceMatch.res && (
              <span className='text-xs font-normal text-light-grey'>{faceMatch.res}</span>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center rounded-lg border-stroke border-x border-y px-2 py-1.5'>
          <div className='flex items-center gap-1'>
            {!upiName.ran ? (
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

            <p className='text-sm text-primary-black'>UPI Name</p>
          </div>
          <div>
            {upiName.loader ? (
              <div className='ml-auto'>
                <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
              </div>
            ) : null}
            {upiName.res && (
              <span className='text-xs font-normal text-light-grey'>{upiName.res}</span>
            )}
          </div>
        </div>

        {display ? (
          <>
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
                    <img
                      src={loading}
                      alt='loading'
                      className='animate-spin duration-300 ease-out'
                    />
                  </div>
                ) : null}
                {bre99.res && (
                  <span className='text-xs font-normal text-light-grey'>{bre99.res}</span>
                )}
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
                    <img
                      src={loading}
                      alt='loading'
                      className='animate-spin duration-300 ease-out'
                    />
                  </div>
                ) : null}
                {bureau.res && (
                  <span className='text-xs font-normal text-light-grey'>{bureau.res}</span>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <p className='text-xs not-italic font-normal text-dark-grey mt-3 text-center absolute bottom-20 w-full p-4 left-2/4 -translate-x-2/4'>
        Do not close the app or go back. Please wait for ID <br /> verification as it may take some
        time. We are validating these checks as per your consent
      </p>

      <div className='flex flex-col gap-[18px] absolute bottom-0 border-t-[1px] w-full p-4 left-2/4 -translate-x-2/4'>
        <Button
          disabled={!bre201}
          inputClasses={`w-full h-12 ${bre201 ? 'font-semibold' : 'font-normal'}`}
          primary={true}
          link='/'
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
export default Eligibility;
