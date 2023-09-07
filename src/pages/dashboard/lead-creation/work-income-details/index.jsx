import { professionOptions, noOfDependentsOptions, totalFamilyMembersOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import CardRadioWithoutIcon from '../../../../components/CardRadio/CardRadioWithoutIcon';
import { memo, useCallback, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import Salaried from './Salaried';
import SelfEmployed from './SelfEmployed';
import TextInput from '../../../../components/TextInput';
import UnEmployed from './UnEmployed';
import Retired from './Retired';

const WorkIncomeDetails = () => {
  const { values, setValues } = useContext(AuthContext);

  const handleRadioChange = useCallback((e) => {
    let newData = values;
    newData[e.name] = e.value;
    setValues(newData);
  }, []);

  const handleTextInputChange = useCallback((e) => {
    let newData = values;
    newData[e.target.name] = e.target.value;
    setValues(newData);
  }, []);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
            Profession <span className='text-primary-red text-xs'>*</span>
          </label>
          <div className={`flex gap-4 w-full`}>
            {professionOptions.map((option) => {
              return (
                <CardRadio
                  key={option.value}
                  label={option.label}
                  name='profession'
                  value={option.value}
                  current={values.profession}
                  onChange={handleRadioChange}
                  containerClasses='flex-1'
                >
                  {option.icon}
                </CardRadio>
              );
            })}
          </div>
        </div>
        {values.profession === 'Salaried' && <Salaried />}
        {values.profession === 'SelfEmployed' && <SelfEmployed />}
        {values.profession === 'Unemployed' && <UnEmployed />}
        {values.profession === 'Retired' && <Retired />}

        {/* {values.profession.length ? (
          <>
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
              hint='City and State fields will get filled based on Pincode'
            />

            <TextInput
              label='City'
              placeholder='Eg: Nashik'
              name='city'
              value={values.city}
              onChange={handleTextInputChange}
            />

            <TextInput
              label='State'
              placeholder='Eg: Maharashtra'
              name='state'
              value={values.state}
              onChange={handleTextInputChange}
            />

            <div className='flex flex-col gap-2'>
              <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
                Total family members <span className='text-primary-red text-xs'>*</span>
              </label>
              <div className={`flex gap-4 w-full`}>
                {totalFamilyMembersOptions.map((option) => {
                  return (
                    <CardRadioWithoutIcon
                      key={option.value}
                      label={option.label}
                      name='total_family_members'
                      value={option.value}
                      current={values.total_family_members}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>
            </div>

            <TextInput
              label='Total household income'
              placeholder='₹ 1,00,000'
              required
              name='total_household_income'
              value={values.total_household_income}
              onChange={handleTextInputChange}
            />

            <div className='flex flex-col gap-2'>
              <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
                No. of Dependents <span className='text-primary-red text-xs'>*</span>
              </label>
              <div className={`flex gap-4 w-full`}>
                {noOfDependentsOptions.map((option) => {
                  return (
                    <CardRadioWithoutIcon
                      key={option.value}
                      label={option.label}
                      name='no_of_dependents'
                      value={option.value}
                      current={values.no_of_dependents}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>
            </div>
          </>
        ) : null} */}
      </div>
    </div>
  );
};

export default WorkIncomeDetails;
