import { useCallback, useContext, useState, useEffect } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import { CurrencyInput } from '../../../../components';
import { editFieldsById } from '../../../../global';
import { industriesOptions } from './WorkIncomeDropdownData';

export default function SelfEmployed() {
  const { values, errors, handleBlur, touched, setFieldValue, setFieldError, activeIndex } =
    useContext(LeadContext);

  const handleDropdownChange = useCallback((value) => {
    setFieldValue('work_income_detail.industries', value);

    editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
      industries: value,
    });
  }, []);

  useEffect(() => {
    const gstPattern =
      /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
    const cleanedGSTNumber = values?.applicants?.[
      activeIndex
    ]?.work_income_detail?.gst_number?.replace(/\s/g, '');
    if (
      !gstPattern.test(cleanedGSTNumber) &&
      values?.applicants?.[activeIndex]?.work_income_detail?.gst_number
    ) {
      setFieldError('work_income_detail.gst_number', 'Inavlid gst number');
    }
  }, [
    values?.applicants?.[activeIndex]?.work_income_detail?.gst_number,
    setFieldError,
    errors?.applicants?.[activeIndex]?.work_income_detail?.gst_number,
  ]);

  return (
    <>
      <TextInput
        label='Business name'
        placeholder='Eg: Sanjay Enterprises'
        required
        name={`applicants[${activeIndex}].work_income_detail.business_name`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.business_name}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.business_name}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.business_name}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.business_name &&
            values?.applicants?.[activeIndex]?.work_income_detail?.business_name
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                business_name: values?.applicants?.[activeIndex]?.work_income_detail?.business_name,
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z]+$/;
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
        defaultSelected={values?.applicants?.[activeIndex]?.work_income_detail?.industries}
        name={`applicants[${activeIndex}].work_income_detail.industries`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.industries}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.industries}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.industries}
        onBlur={handleBlur}
      />

      {values?.applicants?.[activeIndex]?.work_income_detail?.industries === 'Others' && (
        <TextInput
          label=''
          placeholder='Enter industry name'
          name={`applicants[${activeIndex}].work_income_detail.extra_params.extra_industries`}
          value={
            values?.applicants?.[activeIndex]?.work_income_detail?.extra_params.extra_industries
          }
          error={
            errors?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_industries
          }
          touched={
            touched?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_industries
          }
          onBlur={(e) => {
            handleBlur(e);

            if (
              !errors?.applicants?.[activeIndex]?.work_income_detail?.extra_params
                ?.extra_industries &&
              values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_industries
            ) {
              editFieldsById(
                values?.applicants?.[activeIndex]?.work_income_detail?.id,
                'work-income',
                {
                  industries:
                    values?.applicants?.[activeIndex]?.work_income_detail?.extra_params
                      ?.extra_industries,
                  extra_params: {
                    extra_industries: 'Others',
                  },
                },
              );
            }
          }}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const address_pattern = /^[a-zA-Z\s]+$/;
            if (address_pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }
          }}
        />
      )}

      <TextInput
        label='GST number'
        placeholder='Eg: ABC45678'
        required
        name={`applicants[${activeIndex}].work_income_detail.gst_number`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        onBlur={(e) => {
          const gstPattern =
            /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
          const cleanedGSTNumber = values?.applicants?.[
            activeIndex
          ]?.work_income_detail?.gst_number.replace(/\s/g, '');
          if (
            !gstPattern.test(cleanedGSTNumber) &&
            values?.applicants?.[activeIndex]?.work_income_detail?.gst_number
          ) {
            setFieldError('work_income_detail.gst_number', 'Inavlid gst number');
          } else {
            handleBlur(e);
          }

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.gst_number &&
            values?.applicants?.[activeIndex]?.work_income_detail?.gst_number
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                gst_number: values?.applicants?.[activeIndex]?.work_income_detail?.gst_number,
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const pattern = /^[a-zA-Z0-9]+$/;
          if (pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
      />

      <TextInput
        label='No. of current loan(s)'
        placeholder='Choose no. of current loan(s)'
        required
        name={`applicants[${activeIndex}].work_income_detail.no_current_loan`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        onBlur={(e) => {
          handleBlur(e);
          if (values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan == 0) {
            setFieldValue('work_income_detail.ongoing_emi', '');
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                ongoing_emi: null,
              },
            );
          }

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan &&
            values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                no_current_loan: parseInt(
                  values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan,
                ),
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[0-9]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            setFieldValue(
              e.currentTarget.name,
              values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan.slice(
                0,
                values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan.length - 1,
              ),
            );
          }
        }}
      />

      <CurrencyInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name={`applicants[${activeIndex}].work_income_detail.ongoing_emi`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi}
        error={
          values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan != 0
            ? errors?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi
            : null
        }
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi &&
            values?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                ongoing_emi: values?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi,
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
        disabled={
          values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan == 0 ? true : false
        }
      />
    </>
  );
}
