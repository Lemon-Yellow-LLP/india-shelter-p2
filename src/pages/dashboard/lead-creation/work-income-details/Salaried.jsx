import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import CurrencyInput from '../../../../components/CurrencyInput';
import { editFieldsById, getCompanyNamesList } from '../../../../global';
import { workingSinceOptions, modeOfSalary } from './WorkIncomeDropdownData';

export default function Salaried() {
  const { values, errors, touched, handleBlur, setFieldValue, setFieldError } =
    useContext(LeadContext);

  const [companyNameOptions, setCompanyNameOptions] = useState([]);

  const searchableTextInputChange = useCallback((name, value) => {
    setFieldValue(name, value?.label);
    const new_name = name.split('.')[1];

    editFieldsById(1, 'work-income', {
      [new_name]: value?.label,
    });
  }, []);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await getCompanyNamesList();

        if (!data) return;

        const new_data = data.map((obj) => {
          return { label: obj.name, value: obj.name, id: obj.id };
        });

        new_data.unshift({
          label: 'Others',
          value: 'Others',
          id: 0,
        });

        setCompanyNameOptions(new_data);
      } catch (err) {
        console.log(err);
      }
    };
    getCompanies();
  }, []);

  const handleDropdownChange = useCallback((value) => {
    setFieldValue('work_income_details.mode_of_salary', value);

    editFieldsById(1, 'work-income', {
      mode_of_salary: value,
    });
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
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors.work_income_details?.company_name &&
            values.work_income_details.company_name
          ) {
            editFieldsById(1, 'work-income', {
              company_name: values.work_income_details.company_name,
            });
          }
        }}
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
          onBlur={(e) => {
            handleBlur(e);

            if (
              !errors.work_income_details?.extra_params?.extra_company_name &&
              values.work_income_details.extra_params?.extra_company_name
            ) {
              editFieldsById(1, 'work-income', {
                company_name: values.work_income_details.extra_params?.extra_company_name,
                extra_params: {
                  extra_company_name: 'Others',
                },
              });
            }
          }}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const pattern = /^[a-zA-Z\s]+$/;
            if (pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
            }
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
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors.work_income_details?.total_income &&
            values.work_income_details.total_income
          ) {
            editFieldsById(1, 'work-income', {
              total_income: values.work_income_details.total_income,
            });
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const pattern = /^[a-zA-Z0-9\/-\s,]+$/;
          if (pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
      />

      <TextInput
        label='PF UAN'
        placeholder='Eg: 100563503285'
        name='work_income_details.pf_uan'
        value={values.work_income_details.pf_uan}
        error={errors.work_income_details?.pf_uan}
        touched={touched.work_income_details?.pf_uan}
        onBlur={(e) => {
          handleBlur(e);

          if (!errors.work_income_details?.pf_uan && values.work_income_details.pf_uan) {
            editFieldsById(1, 'work-income', {
              pf_uan: values.work_income_details.pf_uan,
            });
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          if (value.length > 12) {
            return;
          }
          const address_pattern = /^[0-9]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            setFieldValue(
              'work_income_details.pf_uan',
              values.work_income_details.pf_uan.slice(
                0,
                values.work_income_details.pf_uan.length - 1,
              ),
            );
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
        options={modeOfSalary}
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
