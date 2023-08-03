import { TextInput } from '../../../../components';

const HomeLoanFields = () => {
  return (
    <div className='flex flex-col gap-2'>
      <TextInput
        name='owner-name'
        label='Owner Name'
        required
        placeholder='Eg: Sanjay'
        onChange={() => {}}
      />

      <TextInput
        name='property-address'
        label='Property Address'
        required
        placeholder='Eg: Near Geeta Hospital'
        onChange={() => {}}
      />

      <TextInput
        name='pincode'
        label='Pincode'
        required
        placeholder='Eg: 123456'
        onChange={() => {}}
      />

      <TextInput name='area' label='Area' required placeholder='Eg: Mumbai' onChange={() => {}} />
    </div>
  );
};

export default HomeLoanFields;
