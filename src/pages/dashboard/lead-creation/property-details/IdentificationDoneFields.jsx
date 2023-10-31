import { useCallback, useState, useContext, useEffect } from 'react';
import { TextInput, CurrencyInput, MapInput, Map } from '../../../../components';
import propTypes from 'prop-types';
import { LeadContext } from '../../../../context/LeadContextProvider';
import { checkIsValidStatePincode, editPropertyById } from '../../../../global';
import { AuthContext } from '../../../../context/AuthContextProvider';

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
    activeIndex,
    pincodeErr,
    setPincodeErr,
  } = useContext(LeadContext);

  const { token } = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);

  // const onMapButtonClick = useCallback(() => {
  //   setShowMap((prev) => !prev);
  // }, []);

  const handleTextInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value;
      const name = e.target.name.split('.')[1];
      const pattern = /^[A-Za-z\s]+$/;
      if (pattern.test(value) || value.length === 0) {
        setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
      }

      if (!requiredFieldsStatus[name]) {
        setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
      }
    },
    [requiredFieldsStatus],
  );

  const handleOnPincodeChange = useCallback(async () => {
    if (
      !values?.property_details?.pincode ||
      values?.property_details?.pincode.toString().length < 5 ||
      errors?.property_details?.pincode
    ) {
      setFieldValue('property_details.city', '');
      setFieldValue('property_details.state', '');
      setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: false }));

      editPropertyById(
        values?.property_details?.id,
        {
          city: '',
          state: '',
          pincode: null,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      return;
    }

    const res = await checkIsValidStatePincode(values?.property_details?.pincode, {
      headers: {
        Authorization: token,
      },
    });
    if (!res) {
      setFieldError('property_details.pincode', 'Invalid Pincode');
      setPincodeErr((prev) => ({ ...prev, property_details: 'Invalid Pincode' }));
      setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: false }));
      setFieldValue('property_details.city', '');
      setFieldValue('property_details.state', '');
      editPropertyById(
        values?.property_details?.id,
        {
          city: '',
          state: '',
          pincode: null,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      return;
    }

    editPropertyById(
      values?.property_details?.id,
      {
        city: res.city,
        state: res.state,
        pincode: parseInt(values?.property_details?.pincode),
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setFieldValue('property_details.city', res.city);
    setFieldValue('property_details.state', res.state);
    setPincodeErr((prev) => ({ ...prev, property_details: '' }));

    setRequiredFieldsStatus((prev) => ({ ...prev, ['pincode']: true }));
  }, [
    errors?.property_details?.pincode,
    values?.property_details?.pincode,
    setFieldError,
    setFieldValue,
    requiredFieldsStatus,
  ]);

  useEffect(() => {
    if (
      parseInt(values?.lead?.applied_amount) >
      parseInt(values?.property_details?.property_value_estimate)
    ) {
      setFieldError(
        'property_details.property_value_estimate',
        'Property estimation value should be greater than Loan Amount',
      );
    }
  }, [
    values?.property_details?.property_value_estimate,
    setFieldError,
    errors?.property_details?.property_value_estimate,
  ]);

  return (
    <>
      {selectedLoanType === 'LAP' ? (
        <CurrencyInput
          name='property_details.property_value_estimate'
          label='My property value is estimated to be'
          required
          placeholder='1,00,000'
          value={values?.property_details?.property_value_estimate}
          error={errors?.property_details?.property_value_estimate}
          touched={touched.property_details?.property_value_estimate}
          onChange={(e) => {
            handleChange(e);

            const name = e.target.name.split('.')[1];
            if (!requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          }}
          onBlur={(e) => {
            if (
              parseInt(values?.lead?.applied_amount) >
                parseInt(values?.property_details?.property_value_estimate) &&
              !errors?.property_details.property_value_estimate
            ) {
              setFieldError(
                'property_details.property_value_estimate',
                'Property estimation value should be greater than Loan Amount',
              );
            } else {
              handleBlur(e);
            }
            const name = e.currentTarget.name.split('.')[1];

            if (
              !errors?.property_details?.property_value_estimate &&
              values?.property_details?.property_value_estimate &&
              parseInt(values?.lead?.applied_amount) <
                parseInt(values?.property_details?.property_value_estimate)
            ) {
              editPropertyById(
                values?.property_details?.id,
                {
                  property_value_estimate: values?.property_details?.property_value_estimate,
                },
                {
                  headers: {
                    Authorization: token,
                  },
                },
              );

              if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
              }
            } else {
              if (requiredFieldsStatus[name]) {
                setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
              }
            }
          }}
        />
      ) : null}

      <TextInput
        name='property_details.owner_name'
        label='Owner name'
        required
        placeholder='Eg: Sanjay'
        value={values?.property_details?.owner_name}
        error={errors?.property_details?.owner_name}
        touched={touched.property_details?.owner_name}
        onChange={handleTextInputChange}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.currentTarget.name.split('.')[1];

          if (!errors?.property_details?.owner_name && values?.property_details?.owner_name) {
            editPropertyById(
              values?.property_details?.id,
              {
                owner_name: values?.property_details?.owner_name,
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );

            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            if (requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            }
            editPropertyById(
              values?.property_details?.id,
              {
                owner_name: '',
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
          }
        }}
        inputClasses='capitalize'
      />

      <TextInput
        name='property_details.plot_house_flat'
        label='Plot/House/Flat No'
        required
        placeholder='Eg: 12/A'
        value={values?.property_details?.plot_house_flat}
        error={errors?.property_details?.plot_house_flat}
        touched={touched.property_details?.plot_house_flat}
        onChange={(e) => {
          const value = e.currentTarget.value;
          const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          if (!address_pattern.test(value) && value.length > 0) {
            return;
          }
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }

          const name = e.target.name.split('.')[1];
          if (!requiredFieldsStatus[name]) {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          }
        }}
        onBlur={(e) => {
          handleBlur(e);
          const name = e.currentTarget.name.split('.')[1];

          if (
            !errors?.property_details?.plot_house_flat &&
            values?.property_details?.plot_house_flat
          ) {
            editPropertyById(
              values?.property_details?.id,
              {
                plot_house_flat: values?.property_details?.plot_house_flat,
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            if (requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            }
            editPropertyById(
              values?.property_details?.id,
              {
                plot_house_flat: '',
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
          }
        }}
      />

      <TextInput
        name='property_details.project_society_colony'
        label='Project/Society/Colony name'
        required
        placeholder='Eg: G Groups of Real Estate'
        value={values?.property_details?.project_society_colony}
        error={errors?.property_details?.project_society_colony}
        touched={touched.property_details?.project_society_colony}
        onChange={(e) => {
          const value = e.currentTarget.value;
          // const address_pattern = /^[a-zA-Z0-9\/-\s,.]+$/;
          const address_pattern = /^[a-zA-Z0-9\s,.\-\/]+$/;
          if (!address_pattern.test(value) && value.length > 0) {
            return;
          }
          if (address_pattern.exec(value[value.length - 1])) {
            setFieldValue(e.currentTarget.name, value.charAt(0).toUpperCase() + value.slice(1));
          }

          const name = e.target.name.split('.')[1];
          if (!requiredFieldsStatus[name]) {
            setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
          }
        }}
        inputClasses='capitalize'
        onBlur={(e) => {
          handleBlur(e);
          const name = e.target.name.split('.')[1];

          if (
            !errors?.property_details?.project_society_colony &&
            values?.property_details?.project_society_colony
          ) {
            editPropertyById(
              values?.property_details?.id,
              {
                project_society_colony: values?.property_details?.project_society_colony,
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
            if (requiredFieldsStatus[name] !== undefined && !requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: true }));
            }
          } else {
            if (requiredFieldsStatus[name]) {
              setRequiredFieldsStatus((prev) => ({ ...prev, [name]: false }));
            }
            editPropertyById(
              values?.property_details?.id,
              {
                project_society_colony: '',
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
          }
        }}
      />

      {/* <MapInput
        name='property_details.project_society_colony'
        label='Project/Society/Colony name'
        required
        placeholder='Eg: G Groups of Real Estate'
        value={values?.property_details?.project_society_colony}
        error={errors?.property_details?.project_society_colony}
        touched={touched.property_details?.project_society_colony}
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
      /> */}

      <TextInput
        name='property_details.pincode'
        label='Pincode'
        type='number'
        required
        hint='City and State fields will get filled based on Pincode'
        placeholder='Eg: 123456'
        value={values?.property_details?.pincode}
        error={errors?.property_details?.pincode || pincodeErr?.property_details}
        touched={touched.property_details?.pincode}
        onBlur={(e) => {
          handleBlur(e);
          handleOnPincodeChange();
          if (
            errors?.applicants?.[activeIndex]?.work_income_detail?.pincode ||
            !values?.applicants?.[activeIndex]?.work_income_detail?.pincode
          ) {
            setRequiredFieldsStatus((prev) => ({
              ...prev,
              ['pincode']: false,
            }));
            editPropertyById(
              values?.property_details?.id,
              {
                pincode: '',
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            );
          }
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
          setFieldValue(e.currentTarget.name, value ? parseInt(e.currentTarget.value) : value);
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
        name='property_details.city'
        label='City'
        disabled
        placeholder='Eg: Nashik'
        value={values?.property_details?.city}
        error={errors?.property_details?.city}
        touched={touched.property_details?.city}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        name='property_details.state'
        label='State'
        disabled
        placeholder='Eg: Maharashtra'
        value={values?.property_details?.state}
        error={errors?.property_details?.state}
        touched={touched.property_details?.state}
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
