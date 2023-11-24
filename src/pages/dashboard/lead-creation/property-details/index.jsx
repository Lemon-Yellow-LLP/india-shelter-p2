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
import Popup from '../../../../components/Popup';
import { AuthContext } from '../../../../context/AuthContextProvider';
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
    errors,
    touched,
    setFieldValue,
    setValues,
    updateProgressApplicantSteps,
    activeIndex,
    setCurrentStepIndex,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);
  const [requiredFieldsStatus, setRequiredFieldsStatus] = useState({
    ...values?.property_details?.extra_params?.required_fields_status,
  });
  const [openQualifierNotActivePopup, setOpenQualifierNotActivePopup] = useState(false);
  const handleCloseQualifierNotActivePopup = () => {
    setOpenQualifierNotActivePopup(false);
  };

  useEffect(() => {
    let userLocation = navigator.geolocation;

    if (userLocation) {
      userLocation.getCurrentPosition(success);
    } else {
      console.log('The geolocation API is not supported by your browser.');
    }

    function success(data) {
      let lat = data.coords.latitude;
      let long = data.coords.longitude;
      if (values?.property_details?.id)
        editPropertyById(values?.property_details?.id, {
          geo_lat: String(lat),
          geo_long: String(long),
        });
    }
  }, []);

  useEffect(() => {
    setRequiredFieldsStatus(values?.property_details?.extra_params?.required_fields_status);
  }, [activeIndex]);

  useEffect(() => {
    updateProgressApplicantSteps('property_details', requiredFieldsStatus, 'property');
  }, [requiredFieldsStatus]);

  const handleRadioChange = useCallback(
    async (e) => {
      const name = e.name;
      setFieldValue('property_details.property_identification_is', e.value);
      if (values?.property_details?.id) {
        if (e.value === 'not-yet') {
          editPropertyById(
            values?.property_details?.id,
            {
              property_identification_is: e.value,
              property_value_estimate: '',
              current_owner_name: '',
              plot_house_flat: '',
              project_society_colony: '',
              pincode: null,
              city: '',
              state: '',
              extra_params: {
                ...values?.property_details?.extra_params,
                progress: 100,
                required_fields_status: {
                  property_identification_is: true,
                },
              },
            },
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setValues({
            ...values,
            property_details: {
              ...values.property_details,
              property_identification_is: e.value,
              property_value_estimate: '',
              current_owner_name: '',
              plot_house_flat: '',
              project_society_colony: '',
              pincode: null,
              city: '',
              state: '',
              extra_params: {
                ...values?.property_details?.extra_params,
                progress: 100,
                required_fields_status: {
                  property_identification_is: true,
                },
              },
            },
          });
          setRequiredFieldsStatus({
            property_identification_is: true,
          });
        } else {
          editPropertyById(
            values?.property_details?.id,
            {
              property_identification_is: e.value,
              property_value_estimate: '',
              current_owner_name: '',
              plot_house_flat: '',
              project_society_colony: '',
              pincode: null,
              city: '',
              state: '',
              extra_params: {
                ...values?.property_details?.extra_params,
                progress: 16,
                required_fields_status: {
                  current_owner_name: false,
                  pincode: false,
                  plot_house_flat: false,
                  project_society_colony: false,
                  property_identification_is: true,
                  property_value_estimate: false,
                },
              },
            },
            {
              headers: {
                Authorization: token,
              },
            },
          );
          setRequiredFieldsStatus({
            current_owner_name: false,
            pincode: false,
            plot_house_flat: false,
            project_society_colony: false,
            property_identification_is: true,
            property_value_estimate: false,
          });
        }
      } else {
        let newDefaultValues = structuredClone(defaultValuesLead);
        let addData = { ...newDefaultValues.property_details, [name]: e.value };
        if (e.value === 'not-yet') {
          addData.extra_params = {
            ...addData.extra_params,
            progress: 100,
            required_fields_status: {
              property_identification_is: true,
            },
          };
        } else {
          addData.extra_params = {
            ...addData.extra_params,
            progress: 16,
            required_fields_status: {
              property_identification_is: true,
              property_value_estimate: false,
              current_owner_name: false,
              plot_house_flat: false,
              project_society_colony: false,
              pincode: false,
            },
          };
        }
        await addApi(
          'property',
          {
            ...addData,
            lead_id: values?.lead?.id,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        )
          .then(async (res) => {
            setFieldValue('property_details', { ...addData, id: res.id });
            setRequiredFieldsStatus({ ...addData.extra_params.required_fields_status });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [requiredFieldsStatus, setFieldValue],
  );
  return (
    <>
      <Popup
        handleClose={handleCloseQualifierNotActivePopup}
        open={openQualifierNotActivePopup}
        setOpen={setOpenQualifierNotActivePopup}
        title='Step is lock.'
        description='Complete Qualifier to Unlock.'
      />
      <div className='overflow-hidden flex flex-col h-[100vh] justify-between'>
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
        <PreviousNextButtons
          linkPrevious={
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              ? '/lead/lnt-charges'
              : null
          }
          linkNext={
            values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              ? '/lead/banking-details'
              : null
          }
          onNextClick={() => {
            setCurrentStepIndex(7);
            !values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              ? setOpenQualifierNotActivePopup(true)
              : null;
          }}
          onPreviousClick={() => {
            setCurrentStepIndex(5);
            !values?.applicants?.[activeIndex]?.applicant_details?.extra_params?.qualifier
              ? setOpenQualifierNotActivePopup(true)
              : null;
          }}
        />
        <SwipeableDrawerComponent />
      </div>
    </>
  );
};
export default PropertyDetails;
