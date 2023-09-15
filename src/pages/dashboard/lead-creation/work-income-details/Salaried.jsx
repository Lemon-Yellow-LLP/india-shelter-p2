import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import CurrencyInput from '../../../../components/CurrencyInput';
import { editFieldsById, getCompanyNamesList } from '../../../../global';

const workingSinceOptions = [
  {
    label: '1975',
    value: '1975',
  },
  {
    label: '1976',
    value: '1976',
  },
  {
    label: '1977',
    value: '1977',
  },
  {
    label: '1978',
    value: '1978',
  },
  {
    label: '1979',
    value: '1979',
  },
  {
    label: '1980',
    value: '1980',
  },
  {
    label: '1981',
    value: '1981',
  },
  {
    label: '1982',
    value: '1982',
  },
  {
    label: '1983',
    value: '1983',
  },
  {
    label: '1984',
    value: '1984',
  },
  {
    label: '1985',
    value: '1985',
  },
  {
    label: '1986',
    value: '1986',
  },
  {
    label: '1987',
    value: '1987',
  },
  {
    label: '1988',
    value: '1988',
  },
  {
    label: '1989',
    value: '1989',
  },
  {
    label: '1990',
    value: '1990',
  },
  {
    label: '1991',
    value: '1991',
  },
  {
    label: '1992',
    value: '1992',
  },
  {
    label: '1993',
    value: '1993',
  },
  {
    label: '1994',
    value: '1994',
  },
  {
    label: '1995',
    value: '1995',
  },
  {
    label: '1996',
    value: '1996',
  },
  {
    label: '1997',
    value: '1997',
  },
  {
    label: '1998',
    value: '1998',
  },
  {
    label: '1999',
    value: '1999',
  },
  {
    label: '2000',
    value: '2000',
  },
  {
    label: '2001',
    value: '2001',
  },
  {
    label: '2002',
    value: '2002',
  },
  {
    label: '2003',
    value: '2003',
  },
  {
    label: '2004',
    value: '2004',
  },
  {
    label: '2005',
    value: '2005',
  },
  {
    label: '2006',
    value: '2006',
  },
  {
    label: '2007',
    value: '2007',
  },
  {
    label: '2008',
    value: '2008',
  },
  {
    label: '2009',
    value: '2009',
  },
  {
    label: '2010',
    value: '2010',
  },
  {
    label: '2011',
    value: '2011',
  },
  {
    label: '2012',
    value: '2012',
  },
  {
    label: '2013',
    value: '2013',
  },
  {
    label: '2014',
    value: '2014',
  },
  {
    label: '2015',
    value: '2015',
  },
  {
    label: '2016',
    value: '2016',
  },
  {
    label: '2017',
    value: '2017',
  },
  {
    label: '2018',
    value: '2018',
  },
  {
    label: '2019',
    value: '2019',
  },
  {
    label: '2020',
    value: '2020',
  },
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

const modeOfSalary = [
  { label: 'Bank-transfer', value: 'Bank-transfer' },
  { label: 'Cash', value: 'Cash' },
];

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

    // if (!requiredFieldsStatus['reference_2_type']) {
    //   updateProgress(6, requiredFieldsStatus);
    //   setRequiredFieldsStatus((prev) => ({ ...prev, ['reference_2_type']: true }));
    // }

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
