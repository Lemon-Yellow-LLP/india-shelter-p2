import { CurrencyInput, DropDown } from '../../../../components';

const propertyTypeOptions = [
  { label: 'Residential House', value: 'Residential House' },
  { label: 'Plot + Construction', value: 'Plot + Construction' },
  { label: 'Ready Built Flat', value: 'Ready Built Flat' },
];

const LoanAgainstPropertyFields = () => {
  return (
    <div className='flex flex-col gap-2'>
      <CurrencyInput
        name='property-estimation'
        label='My property value is estimated to be'
        required
        placeholder='1,00,000'
        value=''
        onChange={() => {}}
      />

      <DropDown
        label='Property Type'
        required
        placeholder='Eg: Residential House'
        options={propertyTypeOptions}
        onChange={(_value) => {}}
      />
    </div>
  );
};

export default LoanAgainstPropertyFields;
