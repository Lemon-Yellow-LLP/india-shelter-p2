import { useCallback, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import { CurrencyInput } from '../../../../components';
import { editFieldsById } from '../../../../global';

export default function SelfEmployed() {
  const { values, errors, handleBlur, touched, setFieldValue, setFieldError } =
    useContext(AuthContext);

  const industriesOptions = [
    {
      label: 'Others',
      value: 'Others',
    },
    {
      label: 'IT',
      value: 'IT',
    },
    {
      label: 'Architecture',
      value: 'Architecture',
    },
    {
      label: 'Fashion Designer',
      value: 'Fashion Designer',
    },
    {
      label: 'Designer',
      value: 'Designer',
    },
    {
      label: 'Engineer',
      value: 'Engineer',
    },
    {
      label: 'HR',
      value: 'HR',
    },
  ];

  const handleDropdownChange = useCallback((value) => {
    setFieldValue('work_income_details.industries', value);

    // if (!requiredFieldsStatus['reference_2_type']) {
    //   updateProgress(6, requiredFieldsStatus);
    //   setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_type']: true }));
    // }

    editFieldsById(1, 'work-income', {
      industries: value,
    });
  }, []);

  useEffect(() => {
    const gstPattern =
      /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
    const cleanedGSTNumber = values.work_income_details.gst_number.replace(/\s/g, '');
    if (!gstPattern.test(cleanedGSTNumber) && values.work_income_details.gst_number) {
      setFieldError('work_income_details.gst_number', 'Inavlid gst number');
    }
  }, [
    values.work_income_details.gst_number,
    setFieldError,
    errors.work_income_details?.gst_number,
  ]);

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
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors.work_income_details?.business_name &&
            values.work_income_details.business_name
          ) {
            editFieldsById(1, 'work-income', {
              business_name: values.work_income_details.business_name,
            });
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
        defaultSelected={values.work_income_details.industries}
        name='work_income_details.industries'
        value={values.work_income_details.industries}
        error={errors.work_income_details?.industries}
        touched={touched.work_income_details?.industries}
        onBlur={handleBlur}
      />

      {values.work_income_details.industries === 'Others' && (
        <TextInput
          label=''
          placeholder='Enter industry name'
          name='work_income_details.extra_params.extra_industries'
          value={values.work_income_details.extra_params.extra_industries}
          error={errors.work_income_details?.extra_params?.extra_industries}
          touched={touched.work_income_details?.extra_params?.extra_industries}
          onBlur={(e) => {
            handleBlur(e);

            if (
              !errors.work_income_details?.extra_params?.extra_industries &&
              values.work_income_details.extra_params?.extra_industries
            ) {
              editFieldsById(1, 'work-income', {
                industries: values.work_income_details.extra_params?.extra_industries,
                extra_params: {
                  extra_industries: 'Others',
                },
              });
            }
          }}
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

      <TextInput
        label='GST number'
        placeholder='Eg: ABC45678'
        required
        name='work_income_details.gst_number'
        value={values.work_income_details.gst_number}
        error={errors.work_income_details?.gst_number}
        touched={touched.work_income_details?.gst_number}
        onBlur={(e) => {
          const gstPattern =
            /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/;
          const cleanedGSTNumber = values.work_income_details.gst_number.replace(/\s/g, '');
          if (!gstPattern.test(cleanedGSTNumber) && values.work_income_details.gst_number) {
            setFieldError('work_income_details.gst_number', 'Inavlid gst number');
          } else {
            handleBlur(e);
          }

          if (!errors.work_income_details?.gst_number && values.work_income_details.gst_number) {
            editFieldsById(1, 'work-income', {
              gst_number: values.work_income_details.gst_number,
            });
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
        name='work_income_details.no_current_loan'
        value={values.work_income_details.no_current_loan}
        error={errors.work_income_details?.no_current_loan}
        touched={touched.work_income_details?.no_current_loan}
        onBlur={(e) => {
          handleBlur(e);
          if (values.work_income_details.no_current_loan == 0) {
            setFieldValue('work_income_details.ongoing_emi', '');
            editFieldsById(1, 'work-income', {
              ongoing_emi: null,
            });
          }

          if (
            !errors.work_income_details?.no_current_loan &&
            values.work_income_details.no_current_loan
          ) {
            editFieldsById(1, 'work-income', {
              no_current_loan: parseInt(values.work_income_details.no_current_loan),
            });
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
              'work_income_details.no_current_loan',
              values.work_income_details.no_current_loan.slice(
                0,
                values.work_income_details.no_current_loan.length - 1,
              ),
            );
          }
        }}
      />

      <CurrencyInput
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
        onBlur={(e) => {
          handleBlur(e);

          if (!errors.work_income_details?.ongoing_emi && values.work_income_details.ongoing_emi) {
            editFieldsById(1, 'work-income', {
              ongoing_emi: values.work_income_details.ongoing_emi,
            });
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
        disabled={values.work_income_details.no_current_loan == 0 ? true : false}
      />
    </>
  );
}
