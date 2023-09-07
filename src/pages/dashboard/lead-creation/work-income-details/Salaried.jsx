import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import { noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
// import { top100Films } from '../../../../assets/SearchableInputTestJsonData.json';

export default function Salaried() {
  const { values, setValues, errors, touched, handleBlur, setFieldValue } = useContext(AuthContext);

  const searchableTextInputChange = useCallback((name, value) => {
    setFieldValue(name, value.value);
  }, []);

  const handleRadioChange = useCallback((e) => {
    let newData = values;
    newData[e.name] = e.value;
    setValues(newData);
  }, []);

  const salariedDropdownOptions = [
    {
      title: 'No of Current Loans',
      options: [
        {
          label: 'Others',
          value: 'Others',
        },
        {
          label: '2',
          value: 2,
        },
        {
          label: '3',
          value: 3,
        },
      ],
    },
  ];

  const handleDropdownChange = () => {};

  return (
    <>
      <SearchableTextInput
        label='Company name'
        placeholder='Search company name'
        required
        name='work_income_details.company_name'
        value={values.work_income_details.company_name}
        error={errors.work_income_details?.company_name}
        touched={touched.work_income_details?.company_name}
        onBlur={handleBlur}
        onChange={searchableTextInputChange}
        type='search'
        options={salariedDropdownOptions[0].options}
      />

      <TextInput
        label='Total income'
        placeholder='Eg: 1,00,000'
        required
        name='work_income_details.total_income'
        value={values.work_income_details.total_income}
        error={errors.work_income_details?.total_income}
        touched={touched.work_income_details?.total_income}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }

          // const name = e.target.name.split('.')[1];
          // if (!requiredFieldsStatus[name]) {
          //   updateProgress(6, requiredFieldsStatus);
          //   setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          // }
        }}
      />

      {values.work_income_details.company_name === 'Others' && (
        <TextInput
          label='Total income'
          placeholder='Eg: 1,00,000'
          required
          name='work_income_details.total_income'
          value={values.work_income_details.total_income}
          error={errors.work_income_details?.total_income}
          touched={touched.work_income_details?.total_income}
          onBlur={handleBlur}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
            if (address_pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }

            // const name = e.target.name.split('.')[1];
            // if (!requiredFieldsStatus[name]) {
            //   updateProgress(6, requiredFieldsStatus);
            //   setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            // }
          }}
        />
      )}

      <TextInput
        label='PF UAN'
        placeholder='Eg: 100563503285'
        name='work_income_details.pf_uan'
        value={values.work_income_details.pf_uan}
        error={errors.work_income_details?.pf_uan}
        touched={touched.work_income_details?.pf_uan}
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

      <DropDown
        label='Working since'
        required
        options={salariedDropdownOptions[0].options}
        placeholder='Choose working since'
        onChange={handleDropdownChange}
        name='work_income_details.working_since'
        defaultSelected={values.work_income_details.working_since}
        value={values.work_income_details.working_since}
        error={errors.work_income_details?.working_since}
        touched={touched.work_income_details?.working_since}
        onBlur={handleBlur}
      />

      <DropDown
        label='Mode of salary'
        required
        options={salariedDropdownOptions[0].options}
        placeholder='Choose mode of salary'
        onChange={handleDropdownChange}
        name='work_income_details.mode_of_salary'
        defaultSelected={values.work_income_details.mode_of_salary}
        value={values.work_income_details.mode_of_salary}
        error={errors.work_income_details?.mode_of_salary}
        touched={touched.work_income_details?.mode_of_salary}
        onBlur={handleBlur}
      />

      <TextInput
        label='Flat no/Building name'
        placeholder='Eg: C-101'
        required
        name='work_income_details.flat_no_building_name'
        value={values.work_income_details.flat_no_building_name}
        error={errors.work_income_details?.flat_no_building_name}
        touched={touched.work_income_details?.flat_no_building_name}
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
        label='Street/Area/Locality'
        placeholder='Eg: Senapati road'
        required
        name='work_income_details.street_area_locality'
        value={values.work_income_details.street_area_locality}
        error={errors.work_income_details?.street_area_locality}
        touched={touched.work_income_details?.street_area_locality}
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
        label='Town'
        placeholder='Eg: Igatpuri'
        name='work_income_details.town'
        value={values.work_income_details.town}
        error={errors.work_income_details?.town}
        touched={touched.work_income_details?.town}
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
        label='Landmark'
        placeholder='Eg: Near apollo hospital'
        required
        name='work_income_details.landmark'
        value={values.work_income_details.landmark}
        error={errors.work_income_details?.landmark}
        touched={touched.work_income_details?.landmark}
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
        label='Pincode'
        placeholder='Eg: 123456'
        required
        name='work_income_details.pincode'
        value={values.work_income_details.pincode}
        error={errors.work_income_details?.pincode}
        touched={touched.work_income_details?.pincode}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        hint='City and State fields will get filled based on Pincode'
      />

      <TextInput
        label='City'
        placeholder='Eg: Nashik'
        name='work_income_details.city'
        value={values.work_income_details.city}
        error={errors.work_income_details?.city}
        touched={touched.work_income_details?.city}
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
        label='State'
        placeholder='Eg: Maharashtra'
        name='work_income_details.state'
        value={values.work_income_details.state}
        error={errors.work_income_details?.state}
        touched={touched.work_income_details?.state}
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
