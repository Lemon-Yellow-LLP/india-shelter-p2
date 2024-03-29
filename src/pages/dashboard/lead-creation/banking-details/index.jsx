import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { editFieldsById } from '../../../../global';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { Button, CardRadio, ToastMessage } from '../../../../components';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { useNavigate } from 'react-router-dom';
import Accounts from './Accounts';
import { BankingAA, BankingManual, IconClose } from '../../../../assets/icons';
import axios from 'axios';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import LoaderDynamicText from '../../../../components/Loader/LoaderDynamicText';
import ErrorTost from '../../../../components/ToastMessage/ErrorTost';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';
import { AuthContext } from '../../../../context/AuthContextProvider';

export const bankingMode = [
  {
    label: 'Account Aggregator',
    value: 'Account Aggregator',
    icon: <BankingAA />,
  },
  {
    label: 'Manual',
    value: 'Manual',
    icon: <BankingManual />,
  },
];

const BankingDetails = () => {
  const {
    values,
    setFieldValue,
    activeIndex,
    bankSuccessTost,
    setBankSuccessTost,
    bankErrorTost,
    setBankErrorTost,
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const handleRadioChange = (e) => {
    if (e.value === 'Manual') {
      navigate('/lead/banking-details/manual');
    } else {
      navigate('/lead/banking-details/account-aggregator');
    }
  };

  const handlePrimaryChange = (id, checked) => {
    let newData = values;
    let currentPrimaryId = newData.applicants[activeIndex].banking_details.find(
      (account) => account.is_primary === true,
    );

    currentPrimaryId = currentPrimaryId?.id;

    newData.applicants[activeIndex].banking_details.map((account) => {
      if (account.id === id) {
        account.is_primary = checked;
      } else {
        account.is_primary = false;
      }
    });

    setFieldValue(
      `applicants[${activeIndex}].banking_details`,
      newData.applicants[activeIndex].banking_details,
    );

    editFieldsById(
      id,
      'banking',
      { is_primary: checked },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (currentPrimaryId) {
      editFieldsById(
        currentPrimaryId,
        'banking',
        { is_primary: false },
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }
  };

  useEffect(() => {
    if (
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.banking_progress ===
        null ||
      values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.banking_progress !== 100
    ) {
      if (values?.applicants?.[activeIndex]?.banking_details?.length > 0) {
        if (
          values?.applicants?.[activeIndex]?.banking_details?.filter(
            (e) => e.account_aggregator_response,
          )?.length
        ) {
          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
            100,
          );
          let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
          newData.extra_params.banking_progress = 100;
          editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details?.id,
            'applicant',
            newData,
            {
              headers: {
                Authorization: token,
              },
            },
          );
        } else if (
          values?.applicants?.[activeIndex]?.banking_details?.filter(
            (e) => e.penny_drop_response?.result && e.penny_drop_response?.result?.active !== 'no',
          )?.length
        ) {
          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
            100,
          );
          let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
          newData.extra_params.banking_progress = 100;
          editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details?.id,
            'applicant',
            newData,
            {
              headers: {
                Authorization: token,
              },
            },
          );
        } else {
          setFieldValue(
            `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
            0,
          );
          let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
          newData.extra_params.banking_progress = 0;
          editFieldsById(
            values?.applicants?.[activeIndex]?.applicant_details?.id,
            'applicant',
            newData,
            {
              headers: {
                Authorization: token,
              },
            },
          );
        }
      } else {
        setFieldValue(
          `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
          0,
        );
        let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
        newData.extra_params.banking_progress = 0;
        editFieldsById(
          values?.applicants?.[activeIndex]?.applicant_details?.id,
          'applicant',
          newData,
          {
            headers: {
              Authorization: token,
            },
          },
        );
      }
    }
  }, [values?.applicants?.[activeIndex]?.banking_details]);

  const handleDelete = async () => {
    await editFieldsById(
      deleteId,
      'banking',
      { extra_params: { is_deleted: true } },
      {
        headers: {
          Authorization: token,
        },
      },
    );
    let newBanking = values?.applicants?.[activeIndex]?.banking_details;
    newBanking = newBanking.filter((account) => account.id !== deleteId);
    setFieldValue(`applicants[${activeIndex}].banking_details`, newBanking);
    if (newBanking?.length) {
      setFieldValue(
        `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
        100,
      );
      let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
      newData.extra_params.banking_progress = 100;
      editFieldsById(
        values?.applicants?.[activeIndex]?.applicant_details?.id,
        'applicant',
        newData,
        {
          headers: {
            Authorization: token,
          },
        },
      );
    } else {
      setFieldValue(
        `applicants[${activeIndex}].applicant_details.extra_params.banking_progress`,
        0,
      );
      let newData = { ...values?.applicants?.[activeIndex]?.applicant_details };
      newData.extra_params.banking_progress = 0;
      editFieldsById(
        values?.applicants?.[activeIndex]?.applicant_details?.id,
        'applicant',
        newData,
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }
    setOpenPopup(false);
  };

  const handleRetry = async (id) => {
    setLoading(true);
    let data = {
      ...values?.applicants?.[activeIndex]?.banking_details?.find((e) => e.id === id),
      banking_id: id,
    };
    await axios
      .post(
        `https://uatagile.indiashelter.in/api/applicant/penny-drop/${values?.applicants?.[activeIndex]?.applicant_details?.id}`,
        { ...data },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(({ data }) => {
        setLoading(false);
        setBankSuccessTost('Bank verified successfully');
      })
      .catch((err) => {
        setLoading(false);
        setBankErrorTost('Bank verified unsuccessfully');
      });
  };

  const handleEdit = (event, id) => {
    event.preventDefault();
    const data = values?.applicants?.[activeIndex]?.banking_details?.find((e) => e.id === id);
    navigate('/lead/banking-details/manual', {
      state: { preFilledData: data },
    });
  };

  const fetchBanking = async () => {
    if (values?.applicants?.[activeIndex]?.applicant_details?.id) {
      await axios
        .get(
          `https://uatagile.indiashelter.in/api/banking/by-applicant/${values?.applicants?.[activeIndex]?.applicant_details?.id}`,
          {
            headers: {
              Authorization: token,
            },
          },
        )
        .then(({ data }) => {
          const newBanking = data?.filter((bank) => !bank?.extra_params?.is_deleted);
          setFieldValue(`applicants[${activeIndex}].banking_details`, newBanking);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchBanking();
  }, [activeIndex]);

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh] justify-between'>
        {values?.applicants[activeIndex]?.applicant_details?.is_primary ? (
          <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
        ) : (
          <Topbar
            title='Adding Co-applicant'
            id={values?.lead?.id}
            showClose={false}
            showBack={true}
            coApplicant={true}
            coApplicantName={values?.applicants[activeIndex]?.applicant_details?.first_name}
          />
        )}
        <ToastMessage message={bankSuccessTost} setMessage={setBankSuccessTost} />
        <ErrorTost message={bankErrorTost} setMessage={setBankErrorTost} />
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[150px] flex-1'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
              Add a bank account <span className='text-primary-red text-xs'>*</span>
            </label>
            <div className={`flex gap-4 w-full`}>
              {bankingMode.map((option) => {
                return (
                  <CardRadio
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    onChange={handleRadioChange}
                    containerClasses='flex-1'
                  >
                    {option.icon}
                  </CardRadio>
                );
              })}
            </div>
          </div>
          {values?.applicants?.[activeIndex]?.banking_details?.length ? (
            <>
              <div className='flex flex-col mt-4'>
                <div>
                  <span className='text-[#727376] font-normal text-[16px]'>Added Accounts</span>
                  <span className='text-[#727376] font-normal text-[16px] ml-1'>
                    ({values?.applicants?.[activeIndex]?.banking_details?.length || 0})
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                {values?.applicants?.[activeIndex]?.banking_details
                  ?.sort((a, b) => (a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1))
                  .map((account, index) =>
                    !account?.extra_params?.is_deleted ? (
                      <Accounts
                        key={index}
                        data={account}
                        handlePrimaryChange={handlePrimaryChange}
                        handleDelete={(id) => {
                          setDeleteId(id);
                          setOpenPopup(true);
                        }}
                        handleRetry={handleRetry}
                        handleEdit={handleEdit}
                      />
                    ) : null,
                  )}
              </div>
            </>
          ) : null}
        </div>

        <PreviousNextButtons
          linkPrevious={
            values?.applicants?.[activeIndex]?.applicant_details?.is_primary
              ? '/lead/property-details'
              : '/lead/qualifier'
          }
          linkNext={
            values?.applicants?.[activeIndex]?.applicant_details?.is_primary
              ? '/lead/reference-details'
              : '/lead/upload-documents'
          }
          onPreviousClick={() => {
            if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
              setCurrentStepIndex(6);
            } else {
              setCurrentStepIndex(4);
            }
          }}
          onNextClick={() => {
            if (values?.applicants?.[activeIndex]?.applicant_details?.is_primary) {
              setCurrentStepIndex(8);
            } else {
              setCurrentStepIndex(6);
            }
          }}
        />
        <SwipeableDrawerComponent />

        {loading ? (
          <div className='absolute w-full h-full bg-[#00000080] z-[9000]'>
            <LoaderDynamicText
              text='Verifying your bank account'
              textColor='white'
              height='100vh'
            />
          </div>
        ) : null}
      </div>

      <DynamicDrawer open={openPopup} setOpen={setOpenPopup} height='180px'>
        <div className='flex gap-1'>
          <div className=''>
            <h4 className='text-center text-base not-italic font-semibold text-primary-black mb-2'>
              Are you sure you want to delete this account?
            </h4>
            <p className='text-center text-xs not-italic font-normal text-primary-black'>
              You have option to verify your account again
            </p>
          </div>
          <div className=''>
            <button onClick={() => setOpenPopup(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='w-full flex gap-4 mt-6'>
          <Button inputClasses='w-full h-[46px]' onClick={() => setOpenPopup(false)}>
            No, Keep it
          </Button>
          <Button primary={true} inputClasses=' w-full h-[46px]' onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default BankingDetails;
