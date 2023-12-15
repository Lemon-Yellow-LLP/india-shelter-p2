import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { editFieldsById, reUploadDoc, uploadDoc } from '../../../../global';
import imageCompression from 'browser-image-compression';
import LoaderDynamicText from '../../../../components/Loader/LoaderDynamicText';
import PdfAndImageUploadBanking from '../../../../components/PdfAndImageUpload/PdfAndImageUploadBanking';
import { AuthContext } from '../../../../context/AuthContextProvider';
import generateImageWithTextWatermark from '../../../../utils/GenerateImageWithTextWatermark';

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
    value: 'Proprietorship',
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
    value: 'OD',
    icon: <OverDraftIcon />,
  },
];

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
  // branch_name: Yup.string().required('Branch Name is Required'),
  // bank_name: Yup.string().required('Bank Name is Required'),
  bank_statement_image: Yup.array()
    .required('Bank Statement is required')
    .min(1, 'Bank Statement is required'),
});

export default function BankingManual() {
  const {
    values: leadValues,
    activeIndex,
    setFieldValue: setFieldValueLead,
    setBankSuccessTost,
    setBankErrorTost,
  } = useContext(LeadContext);

  const { token, session } = useContext(AuthContext);

  const {
    values,
    setFieldValue,
    errors,
    handleBlur,
    touched,
    handleSubmit,
    setValues,
    setFieldError,
  } = useFormik({
    initialValues: {
      account_number: '',
      account_holder_name: '',
      ifsc_code: '',
      entity_type: '',
      account_type: 'Savings',
      bank_name: '',
      branch_name: '',
      bank_statement_image: [],
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      verify();
    },
  });

  const [confirmation, setConfirmation] = useState(false);

  const [open, setOpen] = useState(false);

  const [branchData, setBranchData] = useState([]);

  const [bankNameData, setBankNameData] = useState([]);

  const [searchedBank, setSearchedBank] = useState('');

  const [searchedBranch, setSearchedBranch] = useState({});

  const [searchedIfsc, setSearchedIfsc] = useState('');

  const [bankStatement, setBankStatement] = useState([]);

  const [bankStatementUploads, setBankStatementUploads] = useState(null);

  const [bankStatementPdf, setBankStatementPdf] = useState(null);

  const [editBankStatement, setEditBankStatement] = useState({
    file: {},
    id: null,
  });

  const [bankStatementLatLong, setBankStatementLatLong] = useState(null);

  const [bankStatementFile, setBankStatementFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState();

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const preFilledData = location.state?.preFilledData;

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
      setFieldValue('bank_name', '');
      setFieldValue('branch_name', '');
      setFieldValue(e.currentTarget.name, value.toUpperCase());
    } else if (value.length < values?.[e.currentTarget.name]?.length) {
      setFieldValue('bank_name', '');
      setFieldValue('branch_name', '');
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
    setLoading(true);
    let valuesData = { ...values };
    if (preFilledData) {
      valuesData = { ...valuesData, banking_id: preFilledData?.id };

      await editFieldsById(
        preFilledData?.id,
        'banking',
        {
          ...values,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
    }

    await axios
      .post(
        `https://uatagile.indiashelter.in/api/applicant/penny-drop/${leadValues?.applicants?.[activeIndex]?.applicant_details?.id}`,
        {
          ...valuesData,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(async (res) => {
        await axios
          .get(
            `https://uatagile.indiashelter.in/api/banking/by-applicant/${leadValues?.applicants?.[activeIndex]?.applicant_details?.id}`,
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
        navigate('/lead/banking-details');
        setBankSuccessTost('Bank verified successfully');
        setLoading(false);
      })
      .catch(async (err) => {
        console.log(err);

        await axios
          .get(
            `https://uatagile.indiashelter.in/api/banking/by-applicant/${leadValues?.applicants?.[activeIndex]?.applicant_details?.id}`,
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
        navigate('/lead/banking-details');
        setBankErrorTost('Bank verified unsuccessfully');
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setOpen(true);
  };

  const getIfsc = async () => {
    await axios
      .post(
        `https://uatagile.indiashelter.in/api/ifsc/r/get-bank-ifsc`,
        {
          // bank: searchedBank,
          ifsc: searchedBranch?.value,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(({ data }) => {
        setSearchedIfsc(data[0].ifsc_code);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBankFromIfsc = async () => {
    await axios
      .post(
        `https://uatagile.indiashelter.in/api/ifsc/r/get-bank-ifsc`,
        {
          ifsc: values?.ifsc_code,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(({ data }) => {
        setFieldValue('bank_name', data[0]?.name);
        setFieldValue('branch_name', data[0]?.branch);
      })
      .catch((err) => {
        setFieldValue('bank_name', '');
        setFieldValue('branch_name', '');
        setFieldError('ifsc_code', 'Invalid IFSC code');
      });
  };

  const getBranchesFromBankName = async (e) => {
    if (e) {
      await axios
        .post(
          `https://uatagile.indiashelter.in/api/ifsc/r/get-bank-ifsc`,
          {
            bank: searchedBank,
            branch: e ? e : '',
          },
          {
            headers: {
              Authorization: token,
            },
          },
        )
        .then(({ data }) => {
          const newData = data.map(({ branch, ifsc_code }) => ({
            label: branch.toString().toUpperCase(),
            value: ifsc_code,
          }));

          const calculateMatchScore = (item) => {
            const label = item.label;
            let matchScore = 0;

            if (e) {
              for (const char of e) {
                const index = label.indexOf(char);
                if (index !== -1) {
                  matchScore += 1 / (index + 1);
                }
              }
            }

            return matchScore;
          };

          newData.sort((a, b) => calculateMatchScore(b) - calculateMatchScore(a));

          // newData.sort((a, b) => a.label.localeCompare(b.label));

          const slicedData = newData.slice(0, 30);

          setBranchData(slicedData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setBranchData([]);
    }
  };

  const getAllBanks = async () => {
    await axios
      .get(`https://uatagile.indiashelter.in/api/ifsc/r/get-all-bank`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        let newData = data.map((item) => {
          return { label: item.name, value: item.name };
        });
        newData.sort((a, b) => a.label.localeCompare(b.label));
        setBankNameData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function removeImage(id) {
    let newData = { ...values };

    let document_name = newData.bank_statement_image.filter(
      (data) => data.id.toString() === id.toString(),
    );

    document_name = document_name?.[0]?.document_name;

    setBankStatement((prev) => prev.filter((data) => data.name !== document_name));
    setBankStatementUploads((prev) =>
      prev.data.filter((data) => data.document_name !== document_name),
    );
    if (bankStatementFile?.name === document_name) {
      setBankStatementFile(null);
    }

    newData = {
      ...newData,
      bank_statement_image: newData.bank_statement_image.filter(
        (data) => data.id.toString() !== id.toString(),
      ),
    };

    setValues(newData);

    const active_uploads = newData.bank_statement_image.filter((data) => {
      return data.active === true;
    });

    setBankStatementUploads({ data: active_uploads });
  }

  // useEffect(() => console.log('-------', values), [values]);

  async function deletePDF(id) {
    let newData = { ...values };

    let document_name = newData.bank_statement_image.filter(
      (data) => data.id.toString() === id.toString(),
    );

    document_name = document_name?.[0]?.document_name;

    setBankStatement((prev) => prev && prev.filter((data) => data?.name !== document_name));
    setBankStatementUploads(
      (prev) => prev && prev?.data?.filter((data) => data?.document_name !== document_name),
    );
    setBankStatementPdf(null);
    if (bankStatementFile?.name === document_name) {
      setBankStatementFile(null);
    }

    newData = {
      ...newData,
      bank_statement_image: newData.bank_statement_image.filter(
        (data) => data.id.toString() !== id.toString(),
      ),
    };

    setValues(newData);

    const pdf = newData.bank_statement_image.find((data) => {
      if (data.document_meta.mimetype === 'application/pdf' && data.active === true) {
        return data;
      }
    });

    setBankStatementPdf(pdf);
  }

  useEffect(() => {
    getAllBanks();
  }, []);

  useEffect(() => {
    const addPropertyPaperPhotos = async () => {
      await generateImageWithTextWatermark(
        leadValues?.lead?.id,
        session?.employee_code,
        session?.first_name,
        session?.middle_name,
        session?.last_name,
        bankStatementLatLong?.lat,
        bankStatementLatLong?.long,
        bankStatementFile,
      )
        .then(async (image) => {
          const data = new FormData();

          const filename = bankStatementFile.name;
          data.append('applicant_id', leadValues?.applicants?.[activeIndex]?.applicant_details?.id);
          data.append('document_type', 'bank_statement_photo');
          data.append('document_name', filename);
          data.append('geo_lat', bankStatementLatLong?.lat);
          data.append('geo_long', bankStatementLatLong?.long);

          if (image.type.includes('image')) {
            if (image.fileSize > 5000000) {
              const options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
              };
              const compressedFile = await imageCompression(image, options);
              const compressedImageFile = new File([compressedFile], filename, {
                type: compressedFile.type,
              });
              data.append('file', compressedImageFile);
            } else {
              data.append('file', image);
            }
          } else {
            data.append('file', bankStatementFile);
          }

          let fileSize = data.get('file');

          if (fileSize.size <= 5000000) {
            const res = await uploadDoc(data, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
              },
            });

            if (res) {
              let newData = { ...values };

              newData.bank_statement_image.push(res.document);

              setValues(newData);

              const pdf = values.bank_statement_image.find((data) => {
                if (data.document_meta.mimetype === 'application/pdf' && data.active === true) {
                  return data;
                }
              });

              if (bankStatementFile.type === 'image/jpeg') {
                const active_uploads = values.bank_statement_image.filter((data) => {
                  return data.active === true;
                });

                setBankStatementUploads({ data: active_uploads });
              } else {
                setBankStatementPdf(pdf);
              }
            }
          } else {
            setLoader(false);
            setMessage('File size should be less than 5MB');
          }
        })
        .catch((err) => {
          setLoader(false);
          setMessage('Error loading image');
        });
    };
    if (bankStatement.length > 0) {
      addPropertyPaperPhotos();
    }
  }, [bankStatementFile]);

  useEffect(() => {
    async function editPropertyPaperPhotos() {
      const data = new FormData();
      const filename = editBankStatement.file.name;
      data.append('document_type', 'bank_statement_photo');
      data.append('document_name', filename);
      data.append('geo_lat', bankStatementLatLong?.lat);
      data.append('geo_long', bankStatementLatLong?.long);

      if (editBankStatement.file.type === 'image/jpeg') {
        const options = {
          maxSizeMB: 4,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression(editBankStatement.file, options);

          const compressedImageFile = new File([compressedFile], filename, {
            type: compressedFile.type,
          });

          data.append('file', compressedImageFile);
        } catch (error) {
          console.log(error);
        }
      } else {
        data.append('file', editBankStatement.file);
      }

      const res = await reUploadDoc(editBankStatement.id, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });

      if (!res) return;

      let newData = { ...values };

      newData.bank_statement_image = newData.bank_statement_image.map((data) => {
        if (data.id === res.document.id) {
          return res.document;
        }
        return data;
      });

      setValues(newData);

      const active_uploads = newData.bank_statement_image.filter((data) => {
        return data.active === true;
      });

      setBankStatementUploads({ type: 'bank_statement_photo', data: active_uploads });
      setBankStatement(active_uploads);
    }
    editBankStatement.id && editPropertyPaperPhotos();
  }, [editBankStatement]);

  useEffect(() => {
    if (preFilledData) {
      setValues(preFilledData);

      const pdf = preFilledData?.bank_statement_image?.find((data) => {
        if (data.document_meta.mimetype === 'application/pdf' && data.active === true) {
          return data;
        }
      });

      if (pdf) {
        setBankStatementPdf(pdf);
        setBankStatement([2]);
      } else {
        const active_uploads = preFilledData?.bank_statement_image?.filter((data) => {
          return data.active === true;
        });

        if (active_uploads.length) {
          setBankStatementUploads({ type: 'bank_statement_photo', data: active_uploads });
          setBankStatement(active_uploads);
        }
      }
    }
  }, [preFilledData]);

  useEffect(() => {
    if (!open) {
      setSearchedBank('');
      setSearchedBranch({});
      setSearchedIfsc('');
    }
  }, [open]);

  // console.log(errors);
  // console.log(values);

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
          <PdfAndImageUploadBanking
            files={bankStatement}
            setFile={setBankStatement}
            uploads={bankStatementUploads}
            setUploads={setBankStatementUploads}
            setEdit={setEditBankStatement}
            pdf={bankStatementPdf}
            setPdf={setBankStatementPdf}
            label='Upload 12 months statement'
            required
            hint='File size should be less than 5MB'
            setSingleFile={setBankStatementFile}
            removeImage={removeImage}
            deletePDF={deletePDF}
            setLatLong={setBankStatementLatLong}
            message={message}
            setMessage={setMessage}
            loader={loader}
            setLoader={setLoader}
          />
          {errors?.bank_statement_image && touched?.bank_statement_image ? (
            <span
              className='text-xs text-primary-red'
              dangerouslySetInnerHTML={{
                __html: errors?.bank_statement_image,
              }}
            />
          ) : (
            ''
          )}
        </div>

        <div
          className='flex w-[100vw] p-[16px] bg-white h-[80px] justify-center items-center'
          style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
        >
          <Button primary={true} inputClasses=' w-full h-[48px]' onClick={handleSubmit}>
            Verify
          </Button>
        </div>

        {loading ? (
          <div className='absolute w-full h-full bg-[#00000080]'>
            <LoaderDynamicText
              text='Verifying your bank account'
              textColor='white'
              height='100vh'
            />
          </div>
        ) : null}
      </div>

      <DynamicDrawer open={open} setOpen={setOpen} height='70vh'>
        <div className='flex gap-1 items-center justify-between w-[100vw] border-b-2 pl-[20px] pr-[20px] pb-[5px]'>
          <h4 className='text-center text-[20px] not-italic font-semibold text-primary-black mb-2'>
            Search IFSC code
          </h4>

          <div className=''>
            <button
              onClick={() => {
                setSearchedBank('');
                setSearchedBranch({});
                setSearchedIfsc('');
                setOpen(false);
              }}
            >
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
            value={searchedBank ? searchedBank : ''}
            error={errors?.bank_name}
            touched={touched?.bank_name}
            onBlur={(e) => {
              handleBlur(e);
              setBranchData([]);
              getBranchesFromBankName();
            }}
            onChange={(name, value) => {
              setSearchedIfsc('');
              setSearchedBranch({});
              setSearchedBank(value.value);
            }}
            onTextChange={(e) => console.log(e)}
            type='search'
            options={bankNameData}
          />

          <SearchableTextInput
            label='Branch'
            placeholder='Eg: College Road, Nashik'
            required
            name='branch_name'
            value={searchedBranch?.label ? searchedBranch?.label : ''}
            error={errors?.branch_name}
            touched={touched?.branch_name}
            onBlur={(e) => {
              handleBlur(e);
            }}
            onChange={(name, value) => {
              setSearchedIfsc('');
              setSearchedBranch(value);
              // getBranchesFromBankName(value.value);
            }}
            onTextChange={(e) => {
              getBranchesFromBankName(e);
            }}
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
                setFieldValue('bank_name', searchedBank);
                setFieldValue('branch_name', searchedBranch?.label);
                setOpen(false);
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              primary={true}
              disabled={!searchedBank || !searchedBranch}
              inputClasses='w-full h-[46px]'
              onClick={getIfsc}
            >
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
            onClick={(e) => {
              e.preventDefault();
              setValues({
                account_number: '',
                account_holder_name: '',
                ifsc_code: '',
                entity_type: '',
                account_type: 'Savings',
                bank_name: '',
                branch_name: '',
                bank_statement_image: [],
              });

              setBankStatement([]);
              setBankStatementUploads(null);
              setBankStatementPdf(null);
              setBankStatementFile(null);
              setConfirmation(false, navigate('/lead/banking-details'));
            }}
          >
            Leave
          </Button>
        </div>
      </DynamicDrawer>
    </>
  );
}
