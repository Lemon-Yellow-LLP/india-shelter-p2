import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import TextInput from '../../../../components/TextInput';

export default function Retired() {
  const { values, setValues, errors, handleBlur, touched } = useContext(AuthContext);

  const handleTextInputChange = useCallback((e) => {
    let newData = values;
    newData[e.target.name] = e.target.value;
    setValues(newData);
  }, []);

  const handleRadioChange = useCallback((e) => {
    let newData = values;
    newData[e.name] = e.value;
    setValues(newData);
  }, []);

  return (
    <>
      <TextInput
        label='Total pension amount'
        placeholder='Eg: 1,00,000'
        required
        name='work_income_details.no_current_loans'
        value={values.work_income_details.no_current_loans}
        error={errors.work_income_details?.no_current_loans}
        touched={touched.work_income_details?.no_current_loansn}
        onBlur={handleBlur}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='No. of current loan(s)'
        placeholder='Choose no. of current loan(s)'
        required
        name='work_income_details.no_current_loan'
        value={values.work_income_details.no_current_loan}
        error={errors.work_income_details?.no_current_loan}
        touched={touched.work_income_details?.no_current_loan}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
      />

      <TextInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name='work_income_details.ongoing_emi'
        value={values.work_income_details.ongoing_emi}
        error={errors.work_income_details?.ongoing_emi}
        touched={touched.work_income_details?.ongoing_emi}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
          Total family members <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className={`flex gap-4 w-full`}>
          {totalFamilyMembersOptions.map((option) => {
            return (
              <CardRadioWithoutIcon
                key={option.value}
                label={option.label}
                name='total_family_members'
                value={option.value}
                current={values.total_family_members}
                onChange={handleRadioChange}
                containerClasses='flex-1'
              ></CardRadioWithoutIcon>
            );
          })}
        </div>
      </div>

      <TextInput
        label='Total household income'
        placeholder='₹ 1,00,000'
        required
        name='work_income_details.total_household_income'
        value={values.work_income_details.total_household_income}
        error={errors.work_income_details?.total_household_income}
        touched={touched.work_income_details?.total_household_income}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
      />

      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
          No. of Dependents <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className={`flex gap-4 w-full`}>
          {noOfDependentsOptions.map((option) => {
            return (
              <CardRadioWithoutIcon
                key={option.value}
                label={option.label}
                name='no_of_dependents'
                value={option.value}
                current={values.no_of_dependents}
                onChange={handleRadioChange}
                containerClasses='flex-1'
              ></CardRadioWithoutIcon>
            );
          })}
        </div>
      </div>
    </>
  );
}
