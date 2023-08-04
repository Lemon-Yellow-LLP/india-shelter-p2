import { useCallback, useState } from 'react';
import { TextInput, CurrencyInput, MapInput, Map } from '../../../../components';
import propTypes from 'prop-types';

const IdentificationDoneFields = ({ selectedLoanType }) => {
  const [showMap, setShowMap] = useState(false);

  const onMapButtonClick = useCallback(() => {
    setShowMap((prev) => !prev);
  }, []);

  return (
    <>
      {selectedLoanType === 'LAP' ? (
        <CurrencyInput
          name='property-estimation'
          label='My property value is estimated to be'
          required
          placeholder='1,00,000'
          value=''
          onChange={() => {}}
        />
      ) : null}

      <TextInput
        name='owner-name'
        label='Owner name'
        required
        placeholder='Eg: Sanjay'
        onChange={() => {}}
      />

      <TextInput
        name='plot-no'
        label='Plot/House/Flat No'
        required
        placeholder='Eg: 12/A'
        onChange={() => {}}
      />

      <MapInput
        name='society-name'
        label='Project/Society/Colony name'
        required
        placeholder='Eg: G Groups of Real Estate'
        onChange={() => {}}
        onMapButtonClick={onMapButtonClick}
      />

      <TextInput
        name='pincode'
        label='Pincode'
        required
        placeholder='Eg: 123456'
        onChange={() => {}}
      />

      <TextInput name='city' label='City' disabled placeholder='Eg: Nashik' onChange={() => {}} />

      <TextInput
        name='state'
        label='State'
        disabled
        placeholder='Eg: Maharashtra'
        onChange={() => {}}
      />
      {showMap ? <Map setShowMap={setShowMap} /> : null}
    </>
  );
};

IdentificationDoneFields.propTypes = {
  selectedLoanType: propTypes.string,
};

export default IdentificationDoneFields;
