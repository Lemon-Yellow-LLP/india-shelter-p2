import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import TextInput from '../../../../components/TextInput';

export default function Retired() {
  const { values, setValues, errors } = useContext(AuthContext);

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
      <DropDown
        label='No. of current loan(s)'
        required
        options={salaridDropdownOptions[0].options}
        placeholder='Choose no. of current loan(s)'
        onChange={handleDropdownChange}
        defaultSelected={values.no_of_current_loans}
      />

      <TextInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name='ongoing_emi'
        value={values.ongoing_emi}
        onChange={handleTextInputChange}
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
        name='total_household_income'
        value={values.total_household_income}
        onChange={handleTextInputChange}
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
