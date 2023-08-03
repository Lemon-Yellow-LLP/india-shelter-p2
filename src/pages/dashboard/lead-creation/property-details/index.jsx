import { useCallback, useState } from 'react';
import { IconPropertyIdentified, IconPropertyUnIdentified } from '../../../../assets/icons';
import { CardRadio } from '../../../../components';
import HomeLoanFields from './HomeLoanFields';
import LoanAgainstPropertyFields from './LoanAgainstPropertyFields';

const propertyIdentificationOptions = [
  {
    label: 'Done!',
    value: 'done',
    icon: <IconPropertyIdentified />,
  },
  {
    label: 'Not yet...',
    value: 'not-yet',
    icon: <IconPropertyUnIdentified />,
  },
];

const propertyDetailsMap = {
  'Home Loan': {
    fields: <HomeLoanFields />,
  },
  LAP: {
    fields: <LoanAgainstPropertyFields />,
  },
};

const selectedLoanType = 'Home Loan';

const PropertyDetails = () => {
  const [propertyIdentification, setPropertyIdentification] = useState(null);

  const handlePropertyIdentificationChange = useCallback((value) => {
    setPropertyIdentification(value);
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <label
        htmlFor='property-identification'
        className='flex gap-0.5 font-medium text-primary-black'
      >
        The Property identification is <span className='text-primary-red text-xs'>*</span>
      </label>
      <div className='flex gap-4'>
        {propertyIdentificationOptions.map((option) => (
          <CardRadio
            key={option.value}
            label={option.label}
            name='property-identification'
            value={option.value}
            current={propertyIdentification}
            onChange={handlePropertyIdentificationChange}
          >
            {option.icon}
          </CardRadio>
        ))}
      </div>

      {propertyIdentification === 'done'
        ? propertyDetailsMap[selectedLoanType || 'Home Loan'].fields
        : null}
    </div>
  );
};

export default PropertyDetails;
