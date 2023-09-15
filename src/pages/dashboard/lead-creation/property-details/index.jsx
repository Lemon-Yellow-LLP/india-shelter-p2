import { useCallback, useState, useContext, useEffect } from 'react';
import { IconPropertyIdentified, IconPropertyUnIdentified } from '../../../../assets/icons';
import { CardRadio } from '../../../../components';
import IdentificationDoneFields from './IdentificationDoneFields';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { editPropertyById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';

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
  const { values, updateProgress, errors, touched, setFieldValue, handleSubmit } =
    useContext(LeadContext);
  const [propertyIdentification, setPropertyIdentification] = useState(null);

  useEffect(() => {
    setPropertyIdentification(values.propertySchema.property_identification_is);
  }, [values.propertySchema.property_identification_is]);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    property_identification_is: false,
    property_value_estimate: false,
    owner_name: false,
    plot_house_flat: false,
    project_society_colony: false,
    pincode: false,
  });

  const handleRadioChange = useCallback(
    (e) => {
      setPropertyIdentification(e.value);
      setFieldValue('propertySchema.property_identification_is', e.value);

      const name = e.name.split('.')[0];

      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }

      editPropertyById(1, {
        property_identification_is: e.value,
      });
    },
    [requiredFieldsStatus, setFieldValue],
  );

  useEffect(() => {
    updateProgress(4, requiredFieldsStatus);
  }, [requiredFieldsStatus]);

  return (
    <div className='overflow-hidden flex flex-col h-[100vh]'>
      <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[200px] flex-1'>
        <label
          htmlFor='property-identification'
          className='flex gap-0.5 font-medium text-primary-black'
        >
          The Property identification is <span className='text-primary-red text-xs'>*</span>
        </label>
        <h2 className='text-xs font-normal text-light-grey'>
          To know more about property related details if it’s identified
        </h2>
        <div className='flex gap-4'>
          {propertyIdentificationOptions.map((option) => (
            <CardRadio
              key={option.value}
              label={option.label}
              name='property_identification_is'
              value={option.value}
              current={propertyIdentification}
              onChange={handleRadioChange}
              containerClasses='flex-1'
            >
              {option.icon}
            </CardRadio>
          ))}
        </div>

        {errors.propertySchema?.property_identification_is &&
          !values.property_identification_is && (
            <span className='text-sm text-primary-red'>
              {errors.propertySchema.property_identification_is}
            </span>
          )}

        {propertyIdentification === 'done' ? (
          <IdentificationDoneFields
            selectedLoanType={selectedLoanType}
            requiredFieldsStatus={requiredFieldsStatus}
            setRequiredFieldsStatus={setRequiredFieldsStatus}
          />
        ) : null}
      </div>

      {/* <button onClick={handleSubmit}>submit</button> */}

      {/* <PreviousNextButtons linkPrevious='/lead/banking-details' linkNext='/lead/upload-documents' /> */}
    </div>
  );
};

export default PropertyDetails;
