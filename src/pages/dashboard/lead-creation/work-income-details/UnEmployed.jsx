import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import { CurrencyInput } from '../../../../components';
import { editFieldsById } from '../../../../global';

export default function UnEmployed() {
  const { values, errors, touched, handleBlur, setFieldValue } = useContext(AuthContext);

  return (
    <>
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
