import { useCallback, useState, useContext, useEffect } from 'react';
import { IconPropertyIdentified, IconPropertyUnIdentified } from '../../../../assets/icons';
import { CardRadio } from '../../../../components';
import IdentificationDoneFields from './IdentificationDoneFields';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { addApi, editPropertyById } from '../../../../global';
import PreviousNextButtons from '../../../../components/PreviousNextButtons';
import { defaultValuesLead } from '../../../../context/defaultValuesLead';
import Topbar from '../../../../components/Topbar';
import SwipeableDrawerComponent from '../../../../components/SwipeableDrawer/LeadDrawer';

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

  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.property_details?.extra_params?.required_fields_status,
  });

  useEffect(() => {
    updateProgressApplicantSteps('property_details', requiredFieldsStatus, 'property');
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    async (e) => {
      const name = e.name;

      setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      setFieldValue('property_details.property_identification_is', e.value);

      if (values?.property_details?.id) {
        editPropertyById(values?.property_details?.id, {
          property_identification_is: e.value,
        });
      } else {
        let addData = { ...defaultValuesLead.property_details, [name]: e.value };
        await addApi('property', {
          ...addData,
          lead_id: values?.lead?.id,
        })
          .then(async (res) => {
            setFieldValue(`property_details.id`, res.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (e.value === 'not-yet') {
        editPropertyById(values?.property_details?.id, {
          property_value_estimate: '',
          owner_name: '',
          plot_house_flat: '',
          project_society_colony: '',
          pincode: null,
          city: '',
          state: '',
        });

        setValues({
          ...values,
          property_details: {
            ...values.property_details,
            property_identification_is: e.value,
            property_value_estimate: '',
            owner_name: '',
            plot_house_flat: '',
            project_society_colony: '',
            pincode: null,
            city: '',
            state: '',
          },
        });

        setRequiredFieldsStatus({
          property_identification_is: true,
        });
      } else {
        setRequiredFieldsStatus((prev) => ({
          ...prev,
          owner_name: false,
          pincode: false,
          plot_house_flat: false,
          project_society_colony: false,
          property_identification_is: true,
          property_value_estimate: false,
        }));
      }
    },
    [requiredFieldsStatus, setFieldValue],
  );

  return (
    <>
      <div className='overflow-hidden flex flex-col h-[100vh]'>
        <Topbar title='Lead Creation' id={values?.lead?.id} showClose={true} />
        <div className='flex flex-col bg-medium-grey gap-2 overflow-auto max-[480px]:no-scrollbar p-[20px] pb-[160px] flex-1'>
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
                current={values?.property_details?.property_identification_is}
                onChange={handleRadioChange}
                containerClasses='flex-1'
              >
                {option.icon}
              </CardRadio>
            ))}
          </div>

          {errors?.property_details?.property_identification_is &&
          touched?.property_details?.property_identification_is ? (
            <span
              className='text-xs text-primary-red'
              dangerouslySetInnerHTML={{
                __html: errors?.property_details?.property_identification_is,
              }}
            />
          ) : (
            ''
          )}

          {values?.property_details?.property_identification_is === 'done' ? (
            <IdentificationDoneFields
              selectedLoanType={selectedLoanType}
              requiredFieldsStatus={requiredFieldsStatus}
              setRequiredFieldsStatus={setRequiredFieldsStatus}
            />
          ) : null}
        </div>

        {/* <button onClick={handleSubmit}>submit</button> */}

        <PreviousNextButtons linkPrevious='/lead/lnt-charges' linkNext='/lead/banking-details' />

        <SwipeableDrawerComponent />
      </div>
    </>
  );
};

export default PropertyDetails;
