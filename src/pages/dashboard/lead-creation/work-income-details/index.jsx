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
import CurrencyInput from '../../../../components/CurrencyInput';

const WorkIncomeDetails = () => {
  const { values, errors, touched, handleBlur, setFieldValue } = useContext(AuthContext);

  const handleRadioChange = useCallback((e) => {
    setFieldValue(`work_income_details.${e.name}`, e.value);
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
                  current={values.work_income_details.profession}
                  onChange={handleRadioChange}
                  containerClasses='flex-1'
                >
                  {option.icon}
                </CardRadio>
              );
            })}
          </div>
        </div>
        {values.work_income_details.profession === 'Salaried' && <Salaried />}
        {values.work_income_details.profession === 'SelfEmployed' && <SelfEmployed />}
        {values.work_income_details.profession === 'Unemployed' && <UnEmployed />}
        {values.work_income_details.profession === 'Retired' && <Retired />}

        {values.work_income_details.profession === 'Salaried' ||
        values.work_income_details.profession === 'SelfEmployed' ? (
          <>
            <TextInput
              label='Flat no/Building name'
              placeholder='Eg: C-101'
              required
              name='work_income_details.flat_no_building_name'
              value={values.work_income_details.flat_no_building_name}
              error={errors.work_income_details?.flat_no_building_name}
              touched={touched.work_income_details?.flat_no_building_name}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Street/Area/Locality'
              placeholder='Eg: Senapati road'
              required
              name='work_income_details.street_area_locality'
              value={values.work_income_details.street_area_locality}
              error={errors.work_income_details?.street_area_locality}
              touched={touched.work_income_details?.street_area_locality}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Town'
              placeholder='Eg: Igatpuri'
              name='work_income_details.town'
              value={values.work_income_details.town}
              error={errors.work_income_details?.town}
              touched={touched.work_income_details?.town}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Landmark'
              placeholder='Eg: Near apollo hospital'
              required
              name='work_income_details.landmark'
              value={values.work_income_details.landmark}
              error={errors.work_income_details?.landmark}
              touched={touched.work_income_details?.landmark}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='Pincode'
              placeholder='Eg: 123456'
              required
              name='work_income_details.pincode'
              value={values.work_income_details.pincode}
              error={errors.work_income_details?.pincode}
              touched={touched.work_income_details?.pincode}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
              hint='City and State fields will get filled based on Pincode'
            />

            <TextInput
              label='City'
              placeholder='Eg: Nashik'
              name='work_income_details.city'
              value={values.work_income_details.city}
              error={errors.work_income_details?.city}
              touched={touched.work_income_details?.city}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />

            <TextInput
              label='State'
              placeholder='Eg: Maharashtra'
              name='work_income_details.state'
              value={values.work_income_details.state}
              error={errors.work_income_details?.state}
              touched={touched.work_income_details?.state}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }
              }}
            />
          </>
        ) : null}

        {professionOptions.length && values.work_income_details.profession ? (
          <>
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
                      current={values.work_income_details.total_family_members}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>
            </div>

            <CurrencyInput
              label='Total household income'
              placeholder='Eg: 1,00,000'
              required
              name='work_income_details.total_household_income'
              value={values.work_income_details.total_household_income}
              error={errors.work_income_details?.total_household_income}
              touched={touched.work_income_details?.total_household_income}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.currentTarget.value;
                const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
                if (address_pattern.exec(value[value.length - 1])) {
                  setFieldValue(
                    e.currentTarget.name,
                    value.charAt(0).toUpperCase() + value.slice(1),
                  );
                }

                // const name = e.target.name.split('.')[1];
                // if (!requiredFieldsStatus[name]) {
                //   updateProgress(6, requiredFieldsStatus);
                //   setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
                // }
              }}
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
                      current={values.work_income_details.no_of_dependents}
                      onChange={handleRadioChange}
                      containerClasses='flex-1'
                    ></CardRadioWithoutIcon>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default WorkIncomeDetails;
