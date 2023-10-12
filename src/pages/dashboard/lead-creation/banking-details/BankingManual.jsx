import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, CardRadio, DropDown, TextInput } from '../../../../components';
import { IconBackBanking, IconClose } from '../../../../assets/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { OverDraftIcon, CashCreditIcon, CurrentIcon, SavingIcon } from '../../../../assets/icons';
import BlackSearchIcon from '../../../../assets/icons/blackSearchIcon';
import ClickableEndIcon from '../../../../components/TextInput/ClickableEndIcon';
import DynamicDrawer from '../../../../components/SwipeableDrawer/DynamicDrawer';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import axios from 'axios';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { useNavigate } from 'react-router';

export const entityType = [
  {
    label: 'Company',
    value: 'Company',
  },
  {
    label: 'Partnership',
    value: 'Partnership',
  },
  {
    label: 'Sole_Proprietorship',
    value: 'Sole_Proprietorship',
  },
  {
    label: 'Individual',
    value: 'Individual',
  },
  {
    label: 'Trust',
    value: 'Trust',
  },
];

export const account_type = [
  {
    label: 'Savings',
    value: 'Savings',
    icon: <SavingIcon />,
  },
  {
    label: 'Current',
    value: 'Current',
    icon: <CurrentIcon />,
  },
  {
    label: 'Cash Credit',
    value: 'Cash Credit',
    icon: <CashCreditIcon />,
  },
  {
    label: 'Over Draft',
    value: 'Over Draft',
    icon: <OverDraftIcon />,
  },
];

const defaultValues = {
  account_number: '',
  account_holder_name: '',
  ifsc_code: '',
  entity_type: '',
  account_type: '',
  bank_name: '',
  branch_name: '',
  bank_statement_url: '',
};

const validationSchema = Yup.object().shape({
  account_number: Yup.string()
    .matches(/^\d{9,18}$/, 'Enter a valid account number')
    .required('Enter a valid account number'),
  account_holder_name: Yup.string().required('Account Holder Name is Required'),
  ifsc_code: Yup.string()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code')
    .required('Enter a valid IFSC code'),
  entity_type: Yup.string().required('Entity Type is Required'),
  account_type: Yup.string().required('Account Type is Required'),
});

export default function BankingManual() {
  const { values: leadValues, activeIndex } = useContext(LeadContext);

  const { values, setFieldValue, errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...defaultValues },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const [confirmation, setConfirmation] = useState(false);

  const [open, setOpen] = useState(false);

  const [bankData, setBankData] = useState([]);

  const [branchData, setBranchData] = useState([]);

  const [bankNameData, setBankNameData] = useState([]);

  const [searchedIfsc, setSearchedIfsc] = useState();

  const navigate = useNavigate();

  const handleRadioChange = (e) => {
    setFieldValue(e.name, e.value);
  };

  const handleTextInputChange = (e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z ]+$/;

    if (pattern.test(value)) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    } else if (value.length < values?.[e.currentTarget.name]?.length) {
      setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
    }
  };

  const handleIfscChange = (e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z0-9]+$/;

    if (pattern.test(value)) {
      setFieldValue(e.currentTarget.name, value.toUpperCase());
    } else if (value.length < values?.[e.currentTarget.name]?.length) {
      setFieldValue(e.currentTarget.name, value.toUpperCase());
    }
  };

  const handleAccountNumberChange = async (e) => {
    const accNumber = e.currentTarget.value;

    const pattern = /[^\d]/g;
    if (pattern.test(accNumber)) {
      e.preventDefault();
      return;
    }

    if (accNumber < 0) {
      e.preventDefault();
      return;
    }

    setFieldValue('account_number', accNumber);
  };

  const verify = async () => {
    await axios
      .post(
        `https://lo.scotttiger.in/api/applicant/penny-drop/${leadValues?.applicants?.[activeIndex]?.applicant_details?.id}`,
        {
          ...values,
        },
      )
      .then(({ data }) => {
        navigate('/lead/banking-details');
      })
      .catch((err) => {
        navigate('/lead/banking-details');
      });
  };

  const handleSearch = () => {
    setOpen(true);
  };

  const getIfsc = async () => {
    axios
      .post(`https://lo.scotttiger.in/api/ifsc/r/get-bank-ifsc`, {
        bank: values?.bank_name,
        branch: values?.branch_name,
      })
      .then(({ data }) => {
        setSearchedIfsc(data[0].ifsc_code);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBankFromIfsc = async () => {
    axios
      .post(`https://lo.scotttiger.in/api/ifsc/r/get-bank-ifsc`, {
        ifsc: values?.ifsc_code,
      })
      .then(({ data }) => {
        setFieldValue('bank_name', data[0]?.name);
        setFieldValue('branch_name', data[0]?.branch);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBranchesFromBankName = async () => {
    axios
      .post(`https://lo.scotttiger.in/api/ifsc/r/get-bank-ifsc`, {
        bank: values?.bank_name,
      })
      .then(({ data }) => {
        const newData = data.map((item) => {
          return { label: item.branch, value: item.branch };
        });
        console.log(newData);
        setBranchData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllBanks = async () => {
    axios
      .get(`https://lo.scotttiger.in/api/ifsc/r/get-all-bank`)
      .then(({ data }) => {
        const newData = data.map((item) => {
          return { label: item.name, value: item.name };
        });
        setBankNameData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchableTextInputChange = (name, value) => {
    setFieldValue(name, value?.value);
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  console.log(errors);
  console.log(values);

  return (
    <>
      <div className='flex flex-col h-[100dvh] overflow-hidden'>
        <div className='h-[48px] border-b-2 flex items-center p-[16px]'>
          <button onClick={() => setConfirmation(true)}>
            <IconBackBanking />
          </button>
          <span className='text-[#373435] text-[16px] font-medium pl-[10px]'>
            Add a bank account
          </span>
        </div>

        <div className='flex flex-col p-[16px] flex-1 gap-[16px] overflow-auto'>
          <TextInput
            label='Account number'
            placeholder='Eg: 177801501234'
            required
            name='account_number'
            type='tel'
            inputClasses='hidearrow'
            value={values?.account_number}
            onChange={handleAccountNumberChange}
            error={errors?.account_number}
            touched={touched && touched?.account_number}
            onBlur={handleBlur}
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
          />

          <TextInput
            label='Account holder name'
            placeholder='Eg: Sanjay Shah'
            required
            name='account_holder_name'
            value={values?.account_holder_name}
            onChange={handleTextInputChange}
            error={errors?.account_holder_name}
            touched={touched && touched?.account_holder_name}
            onBlur={handleBlur}
          />

          <ClickableEndIcon
            label='IFSC Code'
            placeholder='Eg: ICICI0001234'
            required
            name='ifsc_code'
            value={values?.ifsc_code}
            onChange={handleIfscChange}
            error={errors?.ifsc_code}
            touched={touched && touched?.ifsc_code}
            onBlur={(e) => {
              handleBlur(e);
              !errors?.ifsc_code && values?.ifsc_code && getBankFromIfsc();
            }}
            EndIcon={BlackSearchIcon}
            onEndButtonClick={handleSearch}
            message={
              values?.bank_name || values?.branch_name
                ? `${values?.bank_name},  ${values?.branch_name}`
                : null
            }
          />

          <DropDown
            label='Entity type'
            name='entity_type'
            required
            options={entityType}
            placeholder='Choose Entity type'
            onChange={(e) => setFieldValue('entity_type', e)}
            touched={touched && touched?.entity_type}
            error={errors?.entity_type}
            onBlur={(e) => handleBlur(e)}
            defaultSelected={values?.entity_type}
            inputClasses='mt-2'
          />

          <div className='flex flex-col gap-2'>
            <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-primary-black'>
              Account type <span className='text-primary-red text-xs'>*</span>
            </label>
            <div className='flex gap-4 w-full'>
              {account_type.map((option) => {
                return (
                  <CardRadio
                    key={option.value}
                    label={option.label}
                    name='account_type'
                    value={option.value}
                    current={values?.account_type}
                    onChange={handleRadioChange}
                    containerClasses='flex-1'
                  >
                    {option.icon}
                  </CardRadio>
                );
              })}
            </div>
            {errors?.account_type && touched?.account_type ? (
              <span
                className='text-xs text-primary-red'
                dangerouslySetInnerHTML={{
                  __html: errors?.account_type,
                }}
              />
            ) : (
              ''
            )}
          </div>
        </div>

        <div
          className='flex w-[100vw] p-[16px] bg-white h-[80px] justify-center items-center'
          style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
        >
          <Button
            primary={true}
            inputClasses=' w-full h-[48px]'
            onClick={verify}
            disabled={
              Object.keys(errors)?.length !== 0 ||
              !!Object.keys(values).find((key) => values[key]?.length === 0)
            }
          >
            Verify
          </Button>
        </div>
      </div>

      <DynamicDrawer open={open} setOpen={setOpen} height='70vh'>
        <div className='flex gap-1 items-center justify-between w-[100vw] border-b-2 pl-[20px] pr-[20px] pb-[5px]'>
          <h4 className='text-center text-[20px] not-italic font-semibold text-primary-black mb-2'>
            Search IFSC code
          </h4>

          <div className=''>
            <button onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>
        </div>

        <div className='flex flex-col flex-1 p-[20px] w-[100vw] gap-2'>
          <SearchableTextInput
            label='Bank Name'
            placeholder='Eg: ICICI Bank'
            required
            name='bank_name'
            value={values?.bank_name}
            error={errors?.bank_name}
            touched={touched?.bank_name}
            onBlur={(e) => {
              handleBlur(e);
              getBranchesFromBankName();
            }}
            onChange={searchableTextInputChange}
            type='search'
            options={bankNameData}
          />
          <SearchableTextInput
            label='Branch'
            placeholder='Eg: College Road, Nashik'
            required
            name='branch_name'
            value={values?.branch_name}
            error={errors?.branch_name}
            touched={touched?.branch_name}
            onBlur={(e) => {
              handleBlur(e);
            }}
            onChange={searchableTextInputChange}
            type='search'
            options={branchData}
          />
          {searchedIfsc ? (
            <div className='flex gap-1'>
              <span className='text-[#727376] text-[16px] font-normal'>IFSC code:</span>
              <span className='text-[#373435] text-[16px] font-medium'>{searchedIfsc}</span>
            </div>
          ) : null}
        </div>

        <div className='w-full flex gap-4 mt-6'>
          {searchedIfsc ? (
            <Button
              primary={true}
              inputClasses='w-full h-[46px]'
              onClick={() => {
                setFieldValue('ifsc_code', searchedIfsc);
                setOpen(false);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button primary={true} inputClasses='w-full h-[46px]' onClick={getIfsc}>
              Search IFSC code
            </Button>
          )}
        </div>
      </DynamicDrawer>

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
