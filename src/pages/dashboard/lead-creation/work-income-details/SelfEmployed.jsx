import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';

export default function SelfEmployed() {
  const { values, errors, handleBlur, touched, setFieldValue } = useContext(AuthContext);

  const industriesOptions = [
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
    setFieldValue('work_income_details.industries', value);

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
      <TextInput
        label='Business name'
        placeholder='Eg: Sanjay Enterprises'
        required
        name='work_income_details.business_name'
        value={values.work_income_details.business_name}
        error={errors.work_income_details?.business_name}
        touched={touched.work_income_details?.business_name}
        onBlur={handleBlur}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
      />

      <DropDown
        label='Industries'
        required
        options={industriesOptions}
        placeholder='Choose industries'
        onChange={handleDropdownChange}
        defaultSelected={values.work_income_details.industries}
        name='work_income_details.industries'
        value={values.work_income_details.industries}
        error={errors.work_income_details?.industries}
        touched={touched.work_income_details?.industries}
        onBlur={handleBlur}
      />

      <TextInput
        label='GST number'
        placeholder='Eg: ABC45678'
        required
        name='work_income_details.gst_number'
        value={values.work_income_details.gst_number}
        error={errors.work_income_details?.gst_number}
        touched={touched.work_income_details?.gst_number}
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
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
        disabled={values.work_income_details.no_current_loan == 0 ? true : false}
      />
    </>
  );
}
