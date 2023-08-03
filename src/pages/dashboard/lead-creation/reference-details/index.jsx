import { useCallback, useState } from 'react';
import ReferenceForm from './ReferenceForm';

const referenceDropdownOptions = [
  {
    label: 'Relative/Friend',
    value: 'relative-friend',
  },
  {
    label: 'Current Employer/Contractor',
    value: 'current-employer-contractor',
  },
  {
    label: 'Colleague',
    value: 'colleague',
  },
  {
    label: 'Business Neighbour',
    value: 'business-neighbour',
  },
  {
    label: 'Customer/Client',
    value: 'customer-client',
  },
  {
    label: 'Supplier',
    value: 'supplier',
  },
  {
    label: 'Business Place Landlord',
    value: 'business-place-landlord',
  },
  {
    label: 'Supervisor',
    value: 'supervisor',
  },
];

const ReferenceDetails = () => {
  const [selectedReferenceTypeOne, setSelectedReferenceTypeOne] = useState(null);
  const [selectedReferenceTypeTwo, setSelectedReferenceTypeTwo] = useState(null);
  const [referenceOneOptions, setReferenceOneOptions] = useState(referenceDropdownOptions);
  const [referenceTwoOptions, setReferenceTwoOptions] = useState(referenceDropdownOptions);

  function disableOneOption(value) {
    setReferenceOneOptions((prev) => {
      return prev.map((option) => {
        if (option.value === value) option['disabled'] = true;
        else option['disabled'] = false;
        return option;
      });
    });
  }

  function disableTwoOption(value) {
    setReferenceTwoOptions((prev) => {
      return prev.map((option) => {
        if (option.value === value) option['disabled'] = true;
        else option['disabled'] = false;
        return option;
      });
    });
  }

  const handleReferenceTypeChangeOne = useCallback(
    (value) => {
      setSelectedReferenceTypeOne(value);
      disableTwoOption(value);
    },
    [selectedReferenceTypeOne],
  );

  const handleReferenceTypeChangeTwo = useCallback(
    (value) => {
      setSelectedReferenceTypeTwo(value);
      disableOneOption(value);
    },
    [selectedReferenceTypeOne],
  );


  return (
    <div className='bg-mid-grey p-4'>
      <h2 className='text-xs text-dark-grey'>It is mandatory to fill in two reference details.</h2>
      <ReferenceForm
        count='1'
        selectedReferenceType={selectedReferenceTypeOne}
        options={referenceOneOptions}
        callback={handleReferenceTypeChangeOne}
      />
      <ReferenceForm
        count='2'
        selectedReferenceType={selectedReferenceTypeTwo}
        options={referenceTwoOptions}
        callback={handleReferenceTypeChangeTwo}
      />
    </div>
  );
};

export default ReferenceDetails;
