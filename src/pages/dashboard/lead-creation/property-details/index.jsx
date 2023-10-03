import { useCallback, useState, useContext, useEffect } from 'react';
import { IconPropertyIdentified, IconPropertyUnIdentified } from '../../../../assets/icons';
import { CardRadio } from '../../../../components';
import IdentificationDoneFields from './IdentificationDoneFields';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { addApi, editPropertyById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { defaultValuesLead } from '../../../../context/defaultValuesLead';

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
  const {
    values,
    updateProgress,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setValues,
    updateProgressApplicantSteps,
  } = useContext(LeadContext);
  const [propertyIdentification, setPropertyIdentification] = useState(null);

  useEffect(() => {
    setPropertyIdentification(values?.propertySchema?.property_identification_is);
  }, [values?.propertySchema?.property_identification_is]);

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.propertySchema?.extra_params?.required_fields_status,
  });

  useEffect(() => {
    updateProgressApplicantSteps('propertySchema', requiredFieldsStatus, 'property');
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    async (e) => {
      setPropertyIdentification(e.value);
      setFieldValue('propertySchema.property_identification_is', e.value);

      const name = e.name.split('.')[0];

      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));

      if (values?.propertySchema?.id) {
        editPropertyById(values?.propertySchema?.id, {
          property_identification_is: e.value,
        });
      } else {
        let addData = { ...defaultValuesLead.propertySchema, [name]: e.value };
        await addApi('property', {
          ...addData,
          lead_id: values?.lead?.id,
        })
          .then(async (res) => {
            setFieldValue(`propertySchema.id`, res.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (e.value === 'not-yet') {
        editPropertyById(values?.propertySchema?.id, {
          property_value_estimate: '',
          owner_name: '',
          plot_house_flat: '',
          project_society_colony: '',
          pincode: '',
          city: '',
          state: '',
        });

        setValues({
          ...values,
          propertySchema: {
            ...values.propertySchema,
            property_value_estimate: '',
            owner_name: '',
            plot_house_flat: '',
            project_society_colony: '',
            pincode: '',
            city: '',
            state: '',
          },
        });
      }
    },
    [requiredFieldsStatus, setFieldValue],
  );

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
