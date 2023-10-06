import React, { useCallback, useState } from 'react';
import { Button, CardRadio, DropDown, TextInput } from '../../../../components';
import { IconBackBanking } from '../../../../assets/icons';
import { entityType, account_type } from './bankingDropDownOptions';

export default function BankingManual() {
  const [number, setNumber] = useState('');
  const handleTextInputChange = useCallback((e) => {
    const value = e.currentTarget.value;
    const pattern = /^[A-Za-z]+$/;
    if (pattern.exec(value[value.length - 1])) {
      console.log(hi);
    }
  }, []);

  const handleOnPhoneNumberChange = async (e) => {
    const phoneNumber = e.currentTarget.value;

    const pattern = /[^\d]/g;
    if (pattern.test(phoneNumber)) {
      e.preventDefault();
      return;
    }

    if (phoneNumber < 0) {
      e.preventDefault();
      return;
    }

    setNumber(phoneNumber);
    // setShowOTPInput(false);

    // setFieldValue(`applicants[${activeIndex}].applicant_details.mobile_number`, phoneNumber);
  };

  const verify = () => {
    console.log('verify');
  };
  return (
    <div className='flex flex-col h-[100dvh] overflow-hidden'>
      <div className='h-[48px] border-b-2 flex items-center p-[16px]'>
        <button onClick={() => setConfirmation(true)}>
          <IconBackBanking />
        </button>
        <span className='text-[#373435] text-[16px] font-medium pl-[10px]'>Add a bank account</span>
      </div>

      <div className='flex flex-col p-[16px] flex-1 gap-[16px] overflow-auto'>
        <TextInput
          label='Account number'
          placeholder='Eg: 177801501234'
          required
          name='account_number'
          type='tel'
          inputClasses='hidearrow'
          value={number}
          onChange={handleOnPhoneNumberChange}
          // error={errors?.applicants?.[activeIndex]?.applicant_details?.mobile_number}
          // touched={
          //   touched.applicants &&
          //   touched.applicants?.[activeIndex]?.applicant_details?.mobile_number
          // }
          // onBlur={(e) => {
          //   handleBlur(e);

          // }}
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
          // value={values?.applicants?.[activeIndex]?.personal_details?.mother_name}
          // onChange={handleTextInputChange}
          // error={errors.applicants?.[activeIndex]?.personal_details?.mother_name}
          // touched={
          //   touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.mother_name
          // }
          // onBlur={(e) => {
          //   handleBlur(e);
          //   const name = e.target.name.split('.')[2];
          //   if (
          //     !errors.applicants?.[activeIndex]?.personal_details?.[name] &&
          //     values?.applicants?.[activeIndex]?.personal_details?.[name]
          //   ) {
          //     updateFields(name, values?.applicants?.[activeIndex]?.personal_details?.[name]);
          //     if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
          //       setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          //     }
          //   } else {
          //     setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
          //   }
          // }}
        />

        <TextInput
          label='IFSC Code'
          placeholder='Eg: ICICI0001234'
          required
          name='ifsc_code'
          // value={values?.applicants?.[activeIndex]?.personal_details?.mother_name}
          // onChange={handleTextInputChange}
          // error={errors.applicants?.[activeIndex]?.personal_details?.mother_name}
          // touched={
          //   touched?.applicants && touched.applicants?.[activeIndex]?.personal_details?.mother_name
          // }
          // onBlur={(e) => {
          //   handleBlur(e);
          // }}
        />

        <DropDown
          label='Entity type'
          name='entity_type'
          required
          options={entityType}
          placeholder='Choose Entity type'
          onChange={() => console.log('entity type changed')}
          // touched={touched && touched?.lead?.purpose_of_loan}
          // error={errors && errors?.lead?.purpose_of_loan}
          // onBlur={handleBlur}
          // defaultSelected={values.lead?.purpose_of_loan}
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
                  // current={values?.applicants?.[activeIndex]?.work_income_detail?.no_of_dependents}
                  // onChange={handleRadioChange}
                  containerClasses='flex-1'
                >
                  <img src={option.icon} alt='' />
                </CardRadio>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className='flex w-[100vw] p-[16px] bg-white h-[80px] justify-center items-center'
        style={{ boxShadow: '0px -5px 10px #E5E5E580' }}
      >
        <Button primary={true} inputClasses=' w-full h-[48px]' onClick={verify}>
          Verify
        </Button>
      </div>
    </div>
  );
}
