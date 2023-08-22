import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';
import DropDown from '../../../../components/DropDown';

export default function SelfEmployed() {
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

  const handleDropdownChange = () => {
    console.log(e);
  };

  return (
    <>
      <TextInput
        label='Business name'
        placeholder='Eg: Sanjay Enterprises'
        required
        name='business_name'
        value={values.business_name}
        onChange={handleTextInputChange}
      />

      <DropDown
        label='Industries'
        required
        options={salaridDropdownOptions[0].options}
        placeholder='Choose industries'
        onChange={handleDropdownChange}
        defaultSelected={values.industries}
      />

      <TextInput
        label='GST number'
        placeholder='Eg: ABC45678'
        required
        name='gst_number'
        value={values.gst_number}
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
    </>
  );
}
