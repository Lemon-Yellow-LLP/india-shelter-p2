import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';
import SearchableTextInput from '../../../../components/TextInput/SearchableTextInput';
// import { top100Films } from '../../../../assets/SearchableInputTestJsonData.json';

export default function Salarid() {
  const { values, setValues, errors } = useContext(AuthContext);

  const handleTextInputChange = useCallback((e) => {
    let newData = values;
    newData[e.target.name] = e.target.value;
    setValues(newData);
  }, []);

  const salaridDropdownOptions = [
    {
      title: 'No of Current Loans',
      options: [
        {
          label: '1',
          value: 1,
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
      {/* <SearchableTextInput
        label='Company name'
        placeholder='Eg: Idea'
        required
        name='company_name'
        value={values.company_name}
        onChange={handleTextInputChange}
        type='search'
        options={top100Films}
      /> */}

      <TextInput
        label='Total income'
        placeholder='Eg: 10,000'
        required
        name='total_income'
        value={values.total_income}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='UTRN'
        placeholder='Eg: 1234567'
        name='utrn'
        value={values.utrn}
        onChange={handleTextInputChange}
      />

      <DropDown
        label='No. of current loan(s)'
        required
        options={salaridDropdownOptions[0].options}
        placeholder='Choose no. of current loan(s)'
        onChange={handleDropdownChange}
        defaultSelected={values.no_of_current_loans}
      />

      <TextInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name='ongoing_emi'
        value={values.ongoing_emi}
        onChange={handleTextInputChange}
        hint='Total ongoing EMI(s) based on the ongoing loan(s)'
      />

      <DropDown
        label='Working since'
        required
        options={salaridDropdownOptions[0].options}
        placeholder='Choose working since'
        onChange={handleDropdownChange}
        defaultSelected={values.working_since}
      />

      <DropDown
        label='Mode of salary'
        required
        options={salaridDropdownOptions[0].options}
        placeholder='Choose mode of salary'
        onChange={handleDropdownChange}
        defaultSelected={values.mode_of_salary}
      />
    </>
  );
}
