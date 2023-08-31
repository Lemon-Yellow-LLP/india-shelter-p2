import { useCallback, useState, useContext } from 'react';
import { TextInput, CurrencyInput, MapInput, Map } from '../../../../components';
import propTypes from 'prop-types';
import { AuthContext } from '../../../../context/AuthContext';
import { checkIsValidStatePincode } from '../../../../global';

const DISALLOW_CHAR = ['-', '_', '.', '+', 'ArrowUp', 'ArrowDown', 'Unidentified', 'e', 'E'];

const IdentificationDoneFields = ({
  selectedLoanType,
  requiredFieldsStatus,
  setRequiredFieldsStatus,
}) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    setFieldError,
    updateProgress,
  } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);

  const onMapButtonClick = useCallback(() => {
    setShowMap((prev) => !prev);
  }, []);

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const pattern = /^[A-Za-z\s]+$/;
      if (pattern.exec(value[value.length - 1])) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      const name = e.target.name.split('.')[1];
      if (!requiredFieldsStatus[name]) {
        updateProgress(4, requiredFieldsStatus);
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleOnPincodeChange = useCallback(async () => {
    if (
      !values.propertySchema.pincode ||
      values.propertySchema.pincode.toString().length < 5
      // errors.propertySchema.pincode
    )
      return;

    const res = await checkIsValidStatePincode(values.propertySchema.pincode);
    if (!res) {
      setFieldError('propertySchema.pincode', 'Invalid Pincode');
      return;
    }

    setFieldValue('propertySchema.city', res.city);
    setFieldValue('propertySchema.state', res.state);
  }, [
    errors.propertySchema?.pincode,
    values.propertySchema?.pincode,
    setFieldError,
    setFieldValue,
  ]);

  return (
    <>
      {selectedLoanType === 'LAP' ? (
        <CurrencyInput
          name='propertySchema.property_value_estimate'
          label='My property value is estimated to be'
          required
          placeholder='1,00,000'
          value={values.propertySchema.property_value_estimate}
          error={errors.propertySchema?.property_value_estimate}
          touched={touched.propertySchema?.property_value_estimate}
          onChange={(e) => {
            handleChange(e);

            const name = e.target.name.split('.')[1];
            if (!requiredFieldsStatus[name]) {
              updateProgress(4, requiredFieldsStatus);
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          }}
          onBlur={handleBlur}
        />
      ) : null}

      <TextInput
        name='propertySchema.owner_name'
        label='Owner name'
        required
        placeholder='Eg: Sanjay'
        value={values.propertySchema.owner_name}
        error={errors.propertySchema?.owner_name}
        touched={touched.propertySchema?.owner_name}
        onChange={handleTextInputChange}
        onBlur={handleBlur}
      />

      <TextInput
        name='propertySchema.plot_house_flat'
        label='Plot/House/Flat No'
        required
        placeholder='Eg: 12/A'
        value={values.propertySchema.plot_house_flat}
        error={errors.propertySchema?.plot_house_flat}
        touched={touched.propertySchema?.plot_house_flat}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }

          const name = e.target.name.split('.')[1];
          if (!requiredFieldsStatus[name]) {
            updateProgress(4, requiredFieldsStatus);
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          }
        }}
        onBlur={handleBlur}
      />

      <MapInput
        name='propertySchema.project_society_colony'
        label='Project/Society/Colony name'
        required
        placeholder='Eg: G Groups of Real Estate'
        value={values.propertySchema.project_society_colony}
        error={errors.propertySchema?.project_society_colony}
        touched={touched.propertySchema?.project_society_colony}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }

          const name = e.target.name.split('.')[1];
          if (!requiredFieldsStatus[name]) {
            updateProgress(4, requiredFieldsStatus);
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          }
        }}
        inputClasses='capitalize'
        maxLength={90}
        onBlur={handleBlur}
        onMapButtonClick={onMapButtonClick}
      />

      <TextInput
        name='propertySchema.pincode'
        label='Pincode'
        required
        placeholder='Eg: 123456'
        value={values.propertySchema.pincode}
        error={errors.propertySchema?.pincode}
        touched={touched.propertySchema?.pincode}
        onBlur={(e) => {
          handleBlur(e);
          handleOnPincodeChange();
        }}
        min='0'
        onInput={(e) => {
          if (!e.currentTarget.validity.valid) e.currentTarget.value = '';
        }}
        onChange={(e) => {
          if (e.currentTarget.value.length > 6) {
            e.preventDefault();
            return;
          }
          const value = e.currentTarget.value;
          if (value.charAt(0) === '0') {
            e.preventDefault();
            return;
          }
          handleChange(e);

          const name = e.target.name.split('.')[1];
          if (!requiredFieldsStatus[name]) {
            updateProgress(4, requiredFieldsStatus);
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          }
        }}
        onKeyDown={(e) => {
          //capturing ctrl V and ctrl C
          (e.key == 'v' && (e.metaKey || e.ctrlKey)) ||
          DISALLOW_CHAR.includes(e.key) ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
            ? e.preventDefault()
            : null;
        }}
        pattern='\d*'
        onFocus={(e) =>
          e.target.addEventListener(
            'wheel',
            function (e) {
              e.preventDefault();
            },
            { passive: false },
          )
        }
        onPaste={(e) => {
          e.preventDefault();
          const text = (e.originalEvent || e).clipboardData.getData('text/plain').replace('');
          e.target.value = text;
          handleChange(e);
        }}
        inputClasses='hidearrow'
      />

      <TextInput
        name='propertySchema.city'
        label='City'
        disabled
        placeholder='Eg: Nashik'
        value={values.propertySchema.city}
        error={errors.propertySchema?.city}
        touched={touched.propertySchema?.city}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        name='propertySchema.state'
        label='State'
        disabled
        placeholder='Eg: Maharashtra'
        value={values.propertySchema.state}
        error={errors.propertySchema?.state}
        touched={touched.propertySchema?.state}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {showMap ? <Map setShowMap={setShowMap} /> : null}
    </>
  );
};

IdentificationDoneFields.propTypes = {
  selectedLoanType: propTypes.string,
};

export default IdentificationDoneFields;
