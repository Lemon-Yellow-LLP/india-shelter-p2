import { useCallback, useContext, useState, useEffect } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import { CurrencyInput } from '../../../../components';
import { editFieldsById } from '../../../../global';
import { industriesOptions } from './WorkIncomeDropdownData';

export default function SelfEmployed({ requiredFieldsStatus, setRequiredFieldsStatus }) {
  const { values, errors, handleBlur, touched, setFieldValue, setFieldError, activeIndex } =
    useContext(LeadContext);

  const handleDropdownChange = useCallback(
    (name, value) => {
      setFieldValue(name, value);

      editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
        industries: value,
      });

      if (!requiredFieldsStatus['industries']) {
        setRequiredFieldsStatus((prev) => ({
          ...prev,
          ['industries']: true,
        }));
      }
    },
    [requiredFieldsStatus, setRequiredFieldsStatus],
  );

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
  }, [values?.applicants?.[activeIndex]?.work_income_detail?.gst_number, setFieldError]);

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
          } else {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['business_name']: false,
            }));
          }
        }}
        onChange={(e) => {
          let value = e.currentTarget.value;
          value = value.trimStart().replace(/\s\s+/g, ' ');
          const name = e.currentTarget.name;
          // const address_pattern = /^[a-zA-Z]+$/;
          const address_pattern = /^[A-Za-z\s]+$/;
          if (!address_pattern.test(value) && value.length > 0) {
            return;
          }
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));

            if (!requiredFieldsStatus['business_name']) {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ['business_name']: true,
              }));
            }
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <DropDown
        label='Industries'
        required
        options={industriesOptions}
        placeholder='Choose industries'
        onChange={(e) =>
          handleDropdownChange(`applicants[${activeIndex}].work_income_detail.industries`, e)
        }
        defaultSelected={values?.applicants?.[activeIndex]?.work_income_detail?.industries}
        name={`applicants[${activeIndex}].work_income_detail.industries`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.industries}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.industries}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.industries}
        onBlur={handleBlur}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
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
            let value = e.currentTarget.value;
            value = value.trimStart().replace(/\s\s+/g, ' ');
            const address_pattern = /^[A-Za-z\s]+$/;
            if (!address_pattern.test(value) && value.length > 0) {
              return;
            }
            if (address_pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }
          }}
          disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
        />
      )}

      <TextInput
        label='GST number'
        placeholder='Eg: 06AAAPB2117A1ZI'
        className='uppercase'
        name={`applicants[${activeIndex}].work_income_detail.gst_number`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.gst_number}
        onBlur={(e) => {
          // const gstPattern =
          //   /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
          // const cleanedGSTNumber = values?.applicants?.[
          //   activeIndex
          // ]?.work_income_detail?.gst_number.replace(/\s/g, '');
          // if (
          //   !gstPattern.test(cleanedGSTNumber) &&
          //   values?.applicants?.[activeIndex]?.work_income_detail?.gst_number
          // ) {
          //   setFieldError('work_income_detail.gst_number', 'Inavlid gst number');
          // } else {
          //   handleBlur(e);
          // }
          handleBlur(e);

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
          if (!pattern.test(value) && value.length > 0) {
            return;
          }
          if (pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <TextInput
        type='number'
        label='No. of current loan(s)'
        placeholder='Eg: 1'
        pattern='\d*'
        required
        name={`applicants[${activeIndex}].work_income_detail.no_current_loan`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan &&
            (values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan ||
              values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan == 0)
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

            setRequiredFieldsStatus((prev) => ({
              ...prev,
              no_current_loan: true,
            }));

            if (e.target.value == 0) {
              setFieldValue(`applicants[${activeIndex}].work_income_detail.ongoing_emi`, '');
              editFieldsById(
                values?.applicants?.[activeIndex]?.work_income_detail?.id,
                'work-income',
                {
                  ongoing_emi: null,
                },
              );

              setRequiredFieldsStatus((prev) => {
                return {
                  ...prev,
                  no_current_loan: true,
                  ongoing_emi: true,
                };
              });
            } else if (
              errors?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi ||
              !values?.applicants?.[activeIndex]?.work_income_detail?.ongoing_emi
            ) {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ongoing_emi: false,
              }));
            }
          } else {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['no_current_loan']: false,
            }));
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /[^\d]/g;
          if (address_pattern.test(value)) {
            return;
          }

          setFieldValue(e.currentTarget.name, value && parseInt(value));

          setRequiredFieldsStatus((prev) => ({
            ...prev,
            no_current_loan: false,
          }));
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
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
          } else {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['ongoing_emi']: false,
            }));
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));

            if (!requiredFieldsStatus.ongoing_emi) {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ongoing_emi: true,
              }));
            }
          }
        }}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
        disabled={
          values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan == 0
            ? true
            : false || values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
        }
        labelDisabled={
          values?.applicants?.[activeIndex]?.work_income_detail?.no_current_loan == 0 ? true : false
        }
      />
    </>
  );
}
