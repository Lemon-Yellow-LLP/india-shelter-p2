import { useCallback, useContext, useEffect, useState } from 'react';
import { LeadContext } from '../../../../context/LeadContextProvider';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
import CurrencyInput from '../../../../components/CurrencyInput';
import { editFieldsById, getCompanyNamesList } from '../../../../global';
import { workingSinceOptions, modeOfSalary } from './WorkIncomeDropdownData';

export default function Salaried({ requiredFieldsStatus, setRequiredFieldsStatus }) {
  const { values, errors, touched, handleBlur, setFieldValue, setFieldError, activeIndex } =
    useContext(LeadContext);

  const [companyNameOptions, setCompanyNameOptions] = useState([]);

  const searchableTextInputChange = useCallback(
    (name, value) => {
      setFieldValue(name, value?.value);
      const new_name = name.split('.')[2];

      editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
        [new_name]: value?.value,
      });

      if (!requiredFieldsStatus[new_name]) {
        setRequiredFieldsStatus((prev) => ({
          ...prev,
          [new_name]: true,
        }));
      }
    },
    [requiredFieldsStatus, setRequiredFieldsStatus],
  );

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

  const handleDropdownChange = useCallback(
    (value) => {
      setFieldValue(`applicants[${activeIndex}].work_income_detail.mode_of_salary`, value);
      editFieldsById(values?.applicants?.[activeIndex]?.work_income_detail?.id, 'work-income', {
        mode_of_salary: value,
      });

      if (!requiredFieldsStatus['mode_of_salary']) {
        setRequiredFieldsStatus((prev) => ({
          ...prev,
          ['mode_of_salary']: true,
        }));
      }
    },
    [requiredFieldsStatus, setRequiredFieldsStatus],
  );

  const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

  return (
    <>
      <SearchableTextInput
        label='Company name'
        placeholder='Search company name'
        required
        name={`applicants[${activeIndex}].work_income_detail.company_name`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.company_name}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.company_name}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.company_name}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.company_name &&
            values?.applicants?.[activeIndex]?.work_income_detail?.company_name
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                company_name: values?.applicants?.[activeIndex]?.work_income_detail?.company_name,
              },
            );
          } else {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['company_name']: false,
            }));

            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                company_name: '',
              },
            );
          }
        }}
        onChange={searchableTextInputChange}
        type='search'
        options={companyNameOptions}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      {values?.applicants?.[activeIndex]?.work_income_detail?.company_name === 'Others' && (
        <TextInput
          label=''
          placeholder='Enter company name'
          name={`applicants[${activeIndex}].work_income_detail.extra_params.extra_company_name`}
          value={
            values?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_company_name
          }
          error={
            errors?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_company_name
          }
          touched={
            touched?.applicants?.[activeIndex]?.work_income_detail?.extra_params?.extra_company_name
          }
          onBlur={(e) => {
            handleBlur(e);

            if (
              !errors?.applicants?.[activeIndex]?.work_income_detail?.extra_params
                ?.extra_company_name &&
              values?.applicants?.[activeIndex]?.work_income_detail?.extra_params
                ?.extra_company_name
            ) {
              editFieldsById(
                values?.applicants?.[activeIndex]?.work_income_detail?.id,
                'work-income',
                {
                  company_name:
                    values?.applicants?.[activeIndex]?.work_income_detail?.extra_params
                      ?.extra_company_name,
                  extra_params: {
                    extra_company_name: 'Others',
                  },
                },
              );
            } else {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ['company_name']: false,
              }));

              editFieldsById(
                values?.applicants?.[activeIndex]?.work_income_detail?.id,
                'work-income',
                {
                  company_name: '',
                  extra_params: {
                    extra_company_name: '',
                  },
                },
              );
            }
          }}
          onChange={(e) => {
            const value = e.currentTarget.value;
            const pattern = /^[a-zA-Z\s]+$/;
            if (!pattern.test(value) && value.length != 0) {
              return;
            }
            if (pattern.exec(value[value.length - 1])) {
              setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));

              if (!requiredFieldsStatus['company_name']) {
                setRequiredFieldsStatus((prev) => ({
                  ...prev,
                  ['company_name']: true,
                }));
              }
            }
          }}
          disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
        />
      )}

      <CurrencyInput
        label='Total income'
        placeholder='Eg: 1,00,000'
        required
        name={`applicants[${activeIndex}].work_income_detail.total_income`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.total_income}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.total_income}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.total_income}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.total_income &&
            values?.applicants?.[activeIndex]?.work_income_detail?.total_income
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                total_income: values?.applicants?.[activeIndex]?.work_income_detail?.total_income,
              },
            );
          } else {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['total_income']: false,
            }));

            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                total_income: 0,
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const pattern = /^[a-zA-Z0-9\/-\s,]+$/;
          if (pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));

            if (!requiredFieldsStatus['total_income']) {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ['total_income']: true,
              }));
            }
          }
        }}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <TextInput
        label='PF UAN'
        placeholder='Eg: 100563503285'
        type='number'
        pattern='\d*'
        name={`applicants[${activeIndex}].work_income_detail.pf_uan`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.pf_uan}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.pf_uan}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.pf_uan}
        onBlur={(e) => {
          handleBlur(e);

          if (
            !errors?.applicants?.[activeIndex]?.work_income_detail?.pf_uan &&
            values?.applicants?.[activeIndex]?.work_income_detail?.pf_uan
          ) {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                pf_uan: values?.applicants?.[activeIndex]?.work_income_detail?.pf_uan,
              },
            );
          } else {
            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                pf_uan: '',
              },
            );
          }
        }}
        onChange={(e) => {
          let value = e.currentTarget.value;
          if (value.length > 12) {
            return;
          }

          if (value < 0) {
            value = '';
          }

          const address_pattern = /^\d+$/;
          if (!address_pattern.test(value) && value.length > 0) {
            return;
          }

          setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            setFieldValue(
              `applicants[${activeIndex}].work_income_detail.pf_uan`,
              values?.applicants?.[activeIndex]?.work_income_detail?.pf_uan.slice(0),
            );
          }
          if (DISALLOW_CHAR.includes(e.key)) {
            e.preventDefault();
            return;
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

            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                no_current_loan: 0,
              },
            );
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

            editFieldsById(
              values?.applicants?.[activeIndex]?.work_income_detail?.id,
              'work-income',
              {
                ongoing_emi: 0,
              },
            );
          }
        }}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));

            if (!requiredFieldsStatus['ongoing_emi']) {
              setRequiredFieldsStatus((prev) => ({
                ...prev,
                ['ongoing_emi']: true,
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

      <SearchableTextInput
        label='Working since'
        placeholder='Search year'
        required
        name={`applicants[${activeIndex}].work_income_detail.working_since`}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.working_since}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.working_since}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.working_since}
        onBlur={handleBlur}
        onChange={searchableTextInputChange}
        type='search'
        options={workingSinceOptions}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />

      <DropDown
        label='Mode of salary'
        required
        options={modeOfSalary}
        placeholder='Choose mode of salary'
        onChange={handleDropdownChange}
        name={`applicants[${activeIndex}].work_income_detail.mode_of_salary`}
        defaultSelected={values?.applicants?.[activeIndex]?.work_income_detail?.mode_of_salary}
        value={values?.applicants?.[activeIndex]?.work_income_detail?.mode_of_salary}
        error={errors?.applicants?.[activeIndex]?.work_income_detail?.mode_of_salary}
        touched={touched?.applicants?.[activeIndex]?.work_income_detail?.mode_of_salary}
        onBlur={handleBlur}
        disabled={values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier}
      />
    </>
  );
}
