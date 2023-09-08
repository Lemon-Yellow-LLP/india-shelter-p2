import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import CurrencyInput from '../../../../components/CurrencyInput';

export default function Salaried() {
  const { values, setValues, errors, touched, handleBlur, setFieldValue, setFieldError } =
    useContext(AuthContext);

  const searchableTextInputChange = useCallback((name, value) => {
    setFieldValue(name, value?.value);
  }, []);

  const companyNameOptions = [
    {
      label: 'Others',
      value: 'Others',
    },
    {
      label: 'Google',
      value: 'Google',
    },
    {
      label: 'Amazon',
      value: 'Amazon',
    },
  ];

  const workingSinceOptions = [
    {
      label: '2021',
      value: '2021',
    },
    {
      label: '2022',
      value: '2022',
    },
    {
      label: '2023',
      value: '2023',
    },
  ];

  const handleDropdownChange = useCallback((value) => {
    setFieldValue('work_income_details.mode_of_salary', value);

    // if (!requiredFieldsStatus['reference_2_type']) {
    //   updateProgress(6, requiredFieldsStatus);
    //   setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_type']: true }));
    // }

    // editReferenceById(2, {
    //   reference_2_type: value,
    // });
  }, []);

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
        options={companyNameOptions}
      />

      {values.work_income_details.company_name === 'Others' && (
        <TextInput
          label=''
          placeholder='Enter company name'
          name='work_income_details.extra_params.extra_company_name'
          value={values.work_income_details.extra_params.extra_company_name}
          error={errors.work_income_details?.extra_params?.extra_company_name}
          touched={touched.work_income_details?.extra_params?.extra_company_name}
          onBlur={handleBlur}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const address_pattern = /^[a-zA-Z\s]+$/;
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

      <CurrencyInput
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
          const address_pattern = /^[0-9-]+$/;
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
          const address_pattern = /^[0-9-]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
          if (values.work_income_details.no_current_loan == 0) {
            setFieldValue('work_income_details.ongoing_emi', '');
          }
        }}
      />

      <TextInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name='work_income_details.ongoing_emi'
        value={values.work_income_details.ongoing_emi}
        error={
          values.work_income_details.no_current_loan != 0
            ? errors.work_income_details?.ongoing_emi
            : null
        }
        touched={touched.work_income_details?.ongoing_emi}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[0-9-]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
        disabled={values.work_income_details.no_current_loan == 0 ? true : false}
      />

      <SearchableTextInput
        label='Working since'
        placeholder='Search year'
        required
        name='work_income_details.working_since'
        value={values.work_income_details.working_since}
        error={errors.work_income_details?.working_since}
        touched={touched.work_income_details?.working_since}
        onBlur={handleBlur}
        onChange={searchableTextInputChange}
        type='search'
        options={workingSinceOptions}
      />

      <DropDown
        label='Mode of salary'
        required
        options={workingSinceOptions}
        placeholder='Choose mode of salary'
        onChange={handleDropdownChange}
        name='work_income_details.mode_of_salary'
        defaultSelected={values.work_income_details.mode_of_salary}
        value={values.work_income_details.mode_of_salary}
        error={errors.work_income_details?.mode_of_salary}
        touched={touched.work_income_details?.mode_of_salary}
        onBlur={handleBlur}
      />
    </>
  );
}
