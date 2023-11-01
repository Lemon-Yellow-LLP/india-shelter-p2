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
import Topbar from '../../../../components/Topbar';

const Eligibility = () => {
  const { activeIndex, values, setFieldValue, updateCompleteFormProgress } =
    useContext(LeadContext);
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
  const [bre101, setBre101] = useState(null);
  const [display, setDisplay] = useState(false);
  const [bre201, setBre201] = useState(false);
  const [faceMatchResponse, setFaceMatchResponse] = useState(null);
  const [edited_applicants, setEditedApplicants] = useState([]);
  const [sdfcResponse, setSdfcResponse] = useState(false);
  const [sfdcStatus, setSfdcStatus] = useState(false);

  useEffect(() => {
    setEditedApplicants(
      values.applicants.filter((applicant) => !applicant.applicant_details.is_primary),
    );
  }, [values.applicants]);

  useEffect(() => {
    async function breTwo() {
      const lead = await getLeadById(values?.applicants?.[activeIndex]?.applicant_details.lead_id);
      const res = await getApplicantById(values?.applicants?.[activeIndex]?.applicant_details.id);

      if (res.bre_101_response && lead.bre_201_response) {
        setBre101(res);
        setSdfcResponse(true);
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

        setUpiName((prev) => ({
          ...prev,
          ran: true,
          res: lead.bre_201_response.body.UPI_Name.main_applicant[0]
            .UPI_Name_Match_with_Applicant_Name,
        }));

        setFaceMatchResponse(lead.bre_201_response.body.Facematch);

        if (
          res?.extra_params?.pan_ran ||
          res?.extra_params?.dl_ran ||
          res?.extra_params?.voter_ran ||
          res?.extra_params?.pf_ran ||
          res?.extra_params?.gst_ran
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

        setBre201(lead);

        return;
      }

      setFaceMatch((prev) => ({ ...prev, loader: true, ran: true }));
      setUpiName((prev) => ({ ...prev, loader: true, ran: true }));

      setProgress(values.applicants.length + 1);
      setFinalApi(values.applicants.length + 1);

      let final_api = [];
      let test_api_ran = [];
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

        test_api_ran.push('PAN');
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

            test_api_ran.push('PAN');
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

        test_api_ran.push('Driving license');
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

            test_api_ran.push('Driving license');
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

            test_api_ran.push('Driving license');
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

        test_api_ran.push('Voter ID');
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

            test_api_ran.push('Voter ID');
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

            test_api_ran.push('Voter ID');
          }
        }
      }

      if (
        res.bre_101_response.body.Display.UAN_Status === 'Error' ||
        res.bre_101_response.body.Display.UAN_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.UAN_Status === 'Valid No Match'
      ) {
        setPfUAN((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.UAN_Status,
        }));

        final_api.push(verifyPFUAN(values?.applicants?.[activeIndex]?.applicant_details.id, {}));

        test_api_ran.push('pf');
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

          test_api_ran.push('pf');
        }
      }

      if (
        res.bre_101_response.body.Display.GST_Status === 'Error' ||
        res.bre_101_response.body.Display.GST_Status === 'In-Valid' ||
        res.bre_101_response.body.Display.GST_Status === 'Valid No Match'
      ) {
        setGST((prev) => ({
          ...prev,
          loader: true,
          ran: true,
          status: res.bre_101_response.body.Display.GST_Status,
        }));

        final_api.push(verifyGST(values?.applicants?.[activeIndex]?.applicant_details.id, {}));

        test_api_ran.push('gst');
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

          test_api_ran.push('gst');
        }
      }

      if (final_api.length !== 0) {
        setDisplay(true);

        try {
          setProgress(final_api.length + values.applicants.length + 1);
          setFinalApi(final_api.length + values.applicants.length + 3);

          await Promise.allSettled([...final_api]);
        } catch (err) {
          console.log(err);
        }

        let callCibilOrCrif = '';

        try {
          setBre99((prev) => ({ ...prev, loader: true, ran: true }));
          setProgress(final_api.length + values.applicants.length + 2);

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
        setProgress(final_api.length + values.applicants.length + 3);

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

          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params`,
            edited_extra_params,
          );

          setFieldValue(
            `applicants[${activeIndex}].applicant_details.bre_101_response`,
            bre_res.bre_101_response,
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

      try {
        const bre_res = await checkBre201(
          values?.applicants?.[activeIndex]?.applicant_details.lead_id,
          {},
        );

        if (bre_res.bre_201_response.statusCode != 200) return;

        setBre201(bre_res);

        setFaceMatch((prev) => ({ ...prev, loader: false }));
        setFaceMatchResponse(bre_res.bre_201_response?.body.Facematch);
        setUpiName((prev) => ({
          ...prev,
          loader: false,
          res: bre_res.bre_201_response?.body.UPI_Name.main_applicant[0]
            .UPI_Name_Match_with_Applicant_Name,
        }));

        if (edited_bre) {
          const extra_parmas = edited_bre.extra_params;

          const edited_extra_params = {
            ...extra_parmas,
            eligibility: true,
            eligibility_api_progress:
              final_api.length !== 0
                ? final_api.length + values.applicants.length + 3
                : values.applicants.length + 1,
            pan_ran: test_api_ran.includes('PAN'),
            dl_ran: test_api_ran.includes('Driving license'),
            voter_ran: test_api_ran.includes('Voter ID'),
            pf_ran: test_api_ran.includes('pf'),
            gst_ran: test_api_ran.includes('gst'),
          };

          await editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            'applicant',
            {
              extra_params: edited_extra_params,
            },
          );

          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params`,
            edited_extra_params,
          );
        } else {
          let new_data = { ...values };

          const extra_parmas = new_data.applicants[activeIndex].applicant_details.extra_params;

          const edited_extra_params = {
            ...extra_parmas,
            eligibility: true,
            eligibility_api_progress:
              final_api.length !== 0
                ? final_api.length + values.applicants.length + 3
                : values.applicants.length + 1,
          };

          await editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details.id,
            'applicant',
            {
              extra_params: edited_extra_params,
            },
          );

          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params`,
            edited_extra_params,
          );
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const sdfc_res = await pushToSalesforce(
          values?.applicants?.[activeIndex]?.applicant_details.lead_id,
          {},
        );

        if (!sdfc_res) return;

        setToastMessage('Data has been successfully pushed to the Salesforce');
        setSdfcResponse(true);
        setSfdcStatus(false);
      } catch (err) {
        console.log(err);
        setToastMessage('The data push to Salesforce has failed');
        setSdfcResponse(true);
        setSfdcStatus(true);
      }
    }

    breTwo();
  }, []);

  return (
    <>
      <Topbar title='Eligibility' id={values?.lead?.id} showClose={!sdfcResponse ? false : true} />

      <div className='p-4 h-full pb-28'>
        <ToastMessage
          message={toastMessage}
          setMessage={setToastMessage}
          error={sfdcStatus ? true : false}
        />

        <div className='flex items-start gap-2'>
          <img src={InfoIcon} className='w-4 h-4' alt='info-icon' />
          <p className='text-xs not-italic font-normal text-dark-grey'>
            The eligibilty provides information regarding the status of all the verification and
            lead eligibility.
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
            {!sdfcResponse ? <h3>Verification in progress</h3> : <h3>Application submitted</h3>}
            <h3>
              {progress}/{finalApi}
            </h3>
          </div>

          <div className='mt-3 bg-primary-black rounded-lg p-4'>
            {!sdfcResponse ? (
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
              <p className='text-white text-xs'>{bre201.bre_201_response.body.FinalRemarks}</p>
            )}
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-2'>
          {PAN.status === 'Error' ||
          PAN.status === 'In-Valid' ||
          PAN.status === 'Valid No Match' ||
          bre101?.extra_params?.pan_ran ? (
            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
              <div className='flex items-center gap-1'>
                {/* {!PAN.ran ? (
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
                )} */}

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

          {DL.status === 'Error' ||
          DL.status === 'In-Valid' ||
          DL.status === 'Valid No Match' ||
          bre101?.extra_params?.dl_ran ? (
            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
              <div className='flex items-center gap-1'>
                {/* {!DL.ran ? (
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
                )} */}

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
          voterID.status === 'Valid No Match' ||
          bre101?.extra_params?.voter_ran ? (
            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
              <div className='flex items-center gap-1'>
                {/* {!voterID.ran ? (
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
                )} */}

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
          pfUAN.status === 'Valid No Match' ||
          bre101?.extra_params?.pf_ran ? (
            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
              <div className='flex items-center gap-1'>
                {/* {!pfUAN.ran ? (
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
                )} */}

                <p className='text-sm text-primary-black'>PF UAN</p>
              </div>
              <div>
                {pfUAN.loader ? (
                  <div className='ml-auto'>
                    <img
                      src={loading}
                      alt='loading'
                      className='animate-spin duration-300 ease-out'
                    />
                  </div>
                ) : null}
                {pfUAN.res && (
                  <span className='text-xs font-normal text-light-grey'>{pfUAN.res}</span>
                )}
              </div>
            </div>
          ) : null}

          {GST.status === 'Error' ||
          GST.status === 'In-Valid' ||
          GST.status === 'Valid No Match' ||
          bre101?.extra_params?.gst_ran ? (
            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
              <div className='flex items-center gap-1'>
                {/* {!GST.ran ? (
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
                )} */}

                <p className='text-sm text-primary-black'>GST</p>
              </div>
              <div>
                {GST.loader ? (
                  <div className='ml-auto'>
                    <img
                      src={loading}
                      alt='loading'
                      className='animate-spin duration-300 ease-out'
                    />
                  </div>
                ) : null}
                {GST.res && <span className='text-xs font-normal text-light-grey'>{GST.res}</span>}
              </div>
            </div>
          ) : null}

          {display ? (
            <>
              <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
                <div className='flex items-center gap-1'>
                  {/* {!bre99.ran ? (
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
                  )} */}

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

              <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
                <div className='flex items-center gap-1'>
                  {/* {!bureau.ran ? (
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
                  )} */}

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

          <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5'>
            <div className='flex items-center gap-1'>
              {/* {!upiName.ran ? (
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
              )} */}

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

          <div>
            <p className='text-sm text-primary-black'>Primary applicant</p>

            <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5 mt-2'>
              <div className='flex items-center gap-1'>
                {/* {!faceMatch.ran ? (
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
                )} */}

                <p className='text-sm text-primary-black'>Face Match</p>
              </div>
              <div>
                {faceMatch.loader ? (
                  <div className='ml-auto'>
                    <img
                      src={loading}
                      alt='loading'
                      className='animate-spin duration-300 ease-out'
                    />
                  </div>
                ) : null}

                {faceMatchResponse && (
                  <span className='text-xs font-normal text-light-grey'>
                    {faceMatchResponse?.main_applicant?.[0]?.Face_match_with_ID_Proof}
                  </span>
                )}
              </div>
            </div>
          </div>

          {edited_applicants?.map((data, index) =>
            !data?.applicant_details?.is_primary ? (
              <div key={index}>
                <p className='text-sm text-primary-black'>
                  {data?.applicant_details?.applicant_type}
                </p>

                <div className='flex justify-between items-center rounded-lg border-stroke bg-neutral-50 border-x border-y px-2 py-1.5 mt-2'>
                  <div className='flex items-center gap-1'>
                    {/* {!faceMatch.ran ? (
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
                    )} */}

                    <p className='text-sm text-primary-black'>Face Match</p>
                  </div>
                  <div>
                    {faceMatch.loader ? (
                      <div className='ml-auto'>
                        <img
                          src={loading}
                          alt='loading'
                          className='animate-spin duration-300 ease-out'
                        />
                      </div>
                    ) : null}

                    {/* {console.log(index + 1)} */}
                    {faceMatchResponse && (
                      <span className='text-xs font-normal text-light-grey'>
                        {
                          faceMatchResponse?.[`co_applicant_${index + 1}`]?.[0]
                            ?.Face_match_with_ID_Proof
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </div>

        <div>
          {!sdfcResponse ? (
            <p className='flex gap-2 text-[10px] leading-4 not-italic font-normal text-primary-black mt-3 p-1.5 border border-[#E1CE3F] bg-[#FFFAD6] rounded-md'>
              <span className='text-[10px] leading-4 font-medium'>NOTE:</span>
              Do not close the app or go back. Please wait for ID verification as it may take some
              time. We are validating these checks as per your consent.
            </p>
          ) : (
            <p className='flex gap-2 text-[10px] leading-4 not-italic font-normal text-dark-grey mt-3'>
              <span className='text-[10px] leading-4 font-medium'>NOTE:</span>
              Do not close the app or go back. Please wait for ID verification as it may take some
              time. We are validating these checks as per your consent.
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-[18px] fixed bottom-0 border-t-[1px] w-full p-4 bg-white'>
        <Button
          disabled={!sdfcResponse}
          inputClasses={`w-full h-12 ${sdfcResponse ? 'font-semibold' : 'font-normal'}`}
          primary={true}
          link='/'
          onClick={() => {
            updateCompleteFormProgress();
          }}
        >
          Go to Dashboard
        </Button>
      </div>
    </>
  );
};
export default Eligibility;
