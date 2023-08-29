import { useCallback, useState, useContext } from 'react';
import { IconPropertyIdentified, IconPropertyUnIdentified } from '../../../../assets/icons';
import { CardRadio } from '../../../../components';
import IdentificationDoneFields from './IdentificationDoneFields';
import { AuthContext } from '../../../../context/AuthContext';

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

const selectedLoanType = 'LAP';

const PropertyDetails = () => {
  const { values, setValues, updateProgress, errors, touched } = useContext(AuthContext);
  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    property_identification_is: false,
    property_value_estimate: false,
    owner_name: false,
    plot_house_flat: false,
    project_society_colony: false,
    pincode: false,
    city: false,
    state: false,
  });

  const handleRadioChange = useCallback(
    (e) => {
      let newData = values;
      newData[e.name] = e.value;
      setValues(newData);
      if (!requiredFieldsStatus[e.name]) {
        updateProgress(1, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [e.name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  return (
    <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] h-[100vh] pb-[62px]'>
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
            name='property_identification'
            value={option.value}
            current={values.property_identification}
            onChange={handleRadioChange}
            containerClasses='flex-1'
          >
            {option.icon}
          </CardRadio>
        ))}
      </div>

      <span className='text-sm text-primary-red mt-1'>
        {errors.propertySchema?.property_identification_is &&
        touched.propertySchema?.property_identification_is
          ? errors.propertySchema.property_identification_is
          : String.fromCharCode(160)}
      </span>

      {values.property_identification === 'done' ? (
        <IdentificationDoneFields selectedLoanType={selectedLoanType} />
      ) : null}
    </div>
  );
};

export default PropertyDetails;
