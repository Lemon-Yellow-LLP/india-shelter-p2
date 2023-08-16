import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import TextInput from '../../../../components/TextInput';

export default function Salarid() {
  const { values, setValues, errors } = useContext(AuthContext);

  const handleTextInputChange = useCallback((e) => {
    let newData = values;
    newData[e.target.name] = e.target.value;
    setValues(newData);
  }, []);

  return (
    <>
      <TextInput
        label='Company name'
        placeholder='Eg: Idea'
        required
        name='company_name'
        value={values.company_name}
        onChange={handleTextInputChange}
      />

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
        required
        name='utrn'
        value={values.utrn}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Ongoing EMI(s)'
        placeholder='Eg: 10,000'
        required
        name='ongoing_emi'
        value={values.ongoing_emi}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Flat no/Building name'
        placeholder='Eg: C-101'
        required
        name='flat_no'
        value={values.flat_no}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Street/Area/Locality'
        placeholder='Eg: Senapati road'
        required
        name='street_area_locality'
        value={values.street_area_locality}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Town'
        placeholder='Eg: Igatpuri'
        required
        name='town'
        value={values.town}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Landmark'
        placeholder='Eg: Near apollo hospital'
        required
        name='landmark'
        value={values.landmark}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Pincode'
        placeholder='Eg: 123456'
        required
        name='pincode'
        value={values.pincode}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='City'
        placeholder='Eg: Nashik'
        required
        name='city'
        value={values.city}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='State'
        placeholder='Eg: Maharashtra'
        required
        name='state'
        value={values.state}
        onChange={handleTextInputChange}
      />

      <TextInput
        label='Total household income'
        placeholder='₹ 1,00,000'
        required
        name='total_household_income'
        value={values.total_household_income}
        onChange={handleTextInputChange}
      />
    </>
  );
}
