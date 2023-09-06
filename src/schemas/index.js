import * as Yup from 'yup';
import { parse, isDate } from 'date-fns';

function parseDateString(_, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date());

  return parsedDate;
}

export const signUpSchema = Yup.object({
  propertySchema: Yup.object().shape({
    property_identification_is: Yup.string()
      .required('This field is mandatory')
      .test({
        name: 'min',
        exclusive: false,
        params: {},
        message: 'Property estimation value should be greater than Loan Amount',
        test: function (value) {
          // You can access the price field with `this.parent`.
          return parseInt(value) >= parseInt(this.parent.loan_request_amount);
        },
      }),
    property_value_estimate: Yup.string().required('This field is mandatory'),
    owner_name: Yup.string()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long'),
    plot_house_flat: Yup.string()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long'),
    project_society_colony: Yup.string()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long'),
    pincode: Yup.string()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
  }),
  referenceSchema: Yup.object().shape({
    reference_1_type: Yup.string().required('This field is mandatory'),
    reference_1_full_name: Yup.string()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long'),
    reference_1_address: Yup.string()
      .min(10, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long')
      .required('This field is mandatory'),
    reference_1_phone_number: Yup.string()
      .min(10, 'Enter a valid 10 digit mobile number')
      .max(10, 'Enter a valid 10 digit mobile number')
      .required('This field is mandatory'),
    reference_1_pincode: Yup.string()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
    reference_1_email: Yup.string()
      .email('Enter a valid Email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),

    reference_2_type: Yup.string().required('This field is mandatory'),
    reference_2_full_name: Yup.string()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long'),
    reference_2_address: Yup.string()
      .min(10, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long')
      .required('This field is mandatory'),
    reference_2_phone_number: Yup.string()
      .min(10, 'Enter a valid 10 digit mobile number')
      .max(10, 'Enter a valid 10 digit mobile number')
      .required('This field is mandatory'),
    reference_2_pincode: Yup.string()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
    reference_2_email: Yup.string()
      .email('Enter a valid Email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
  }),

  pan_number: Yup.string()
    .required('Please enter your valid PAN number')
    .min(10, 'Pan Number must be in the following format ex. ABCDE1234F')
    .max(10, 'Pan Number must be in the following format ex. ABCDE1234F'),
  date_of_birth: Yup.date().transform(parseDateString).required(''),
  monthly_family_income: Yup.string().required('Please enter your monthly family income'),
  ongoing_emi: Yup.string().required('Please enter your ongoing emi amount'),
  property_pincode: Yup.string()
    .required('Please enter your property pincode')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(6, 'Enter a valid Pincode')
    .max(6, 'Enter a valid Pincode'),
  banker_name: Yup.string().required(
    'Please enter a right Bank Name. Entered Bank name was not found',
  ),
  purpose_of_loan: Yup.string().required('Please select the purpose of the loan.'),
  property_type: Yup.string().required('Please select the property type.'),
  loan_tenure: Yup.number()
    .required('Please enter the Loan tenure period')
    .min(1, 'Loan Tenure should must be in between 1-30 year')
    .max(30, 'Loan Tenure should must be in between 1-30 year'),
  loan_amount: Yup.string().required('Please enter the loan amount.'),
  purpose_type: Yup.string().required('Property category not selected.'),

  personal_details: Yup.object().shape({
    how_would_you_like_to_proceed: Yup.string().required('This field is mandatory.'),
    id_type: Yup.string().required('This field is mandatory.'),
    id_number: Yup.string().when('id_type', (value, schema) => {
      if (value[0] === 'Passport') {
        return schema
          .matches(
            /^[A-Z]{1}[A-Z0-9]{7}[A-Z]{1}$/,
            'Invalid Passport number. Format should be P1234567B',
          )
          .required('Enter a valid ID number');
      } else if (value[0] === 'PAN Card') {
        return schema
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid Pan number. Format should be AAAPB2117A')
          .required('Enter a valid ID number');
      } else if (value[0] === 'Aadhar') {
        return schema
          .matches(/^\d{12}$/, 'Enter Valid 12 digit Aadhar number')
          .required('Enter a valid ID number');
      } else {
        return schema.required('Enter a valid ID number');
      }
    }),

    selected_address_proof: Yup.string().required('This field is mandatory.'),
    address_proof_number: Yup.string().when('selected_address_proof', (value, schema) => {
      if (value[0] === 'Passport') {
        return schema
          .matches(
            /^[A-Z]{1}[A-Z0-9]{7}[A-Z]{1}$/,
            'Invalid Passport number. Format should be P1234567B',
          )
          .required('Enter a valid address proof number');
      } else if (value[0] === 'PAN Card') {
        return schema
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid Pan number. Format should be AAAPB2117A')
          .required('Enter a valid address proof number');
      } else if (value[0] === 'Aadhar') {
        return schema
          .matches(/^\d{12}$/, 'Enter Valid 12 digit Aadhar number')
          .required('Enter a valid address proof number');
      } else {
        return schema.required('Enter a valid address proof number');
      }
    }),

    first_name: Yup.string()
      .min(2, 'First Name must be atleast 2 characters long')
      .max(10, 'First Name can be max 10 characters long')
      .required('First Name is required')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in First Name'),
    middle_name: Yup.string()
      .min(2, 'Middle Name must be atleast 2 characters long')
      .max(10, 'Middle Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Middle Name'),
    last_name: Yup.string()
      .min(2, 'Last Name must be atleast 2 characters long')
      .max(10, 'Last Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Last Name'),
    gender: Yup.string().required('This field is mandatory.'),
    date_of_birth: Yup.string().required('Date of birth is required'),
    mobile_number: Yup.string()
      .matches(/^(?!.*(\d{5}).*\1)\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
    father_husband_name: Yup.string().required('Father/Husband Name is required'),
    mother_name: Yup.string().required('Mother Name is required'),
    marital_status: Yup.string().required('This field is mandatory.'),
    religion: Yup.string().required('Religion is required'),
    preferred_language: Yup.string().required('Preferred Language is required'),
    qualification: Yup.string().required('Qualification is required'),
    email: Yup.string()
      .email()
      .required('Please enter your email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
  }),

  applicant_details: Yup.object().shape({
    loan_type: Yup.string().required('This field is mandatory field.'),
    applied_amount: Yup.number()
      .min(100000, 'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000')
      .max(
        5000000,
        'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000',
      )
      .required('This field is mandatory.'),
    first_name: Yup.string()
      .min(2, 'First Name must be atleast 2 characters long')
      .max(10, 'First Name can be max 10 characters long')
      .required('First Name is required')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in First Name'),
    middle_name: Yup.string()
      .min(2, 'Middle Name must be atleast 2 characters long')
      .max(10, 'Middle Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Middle Name'),
    last_name: Yup.string()
      .min(2, 'Last Name must be atleast 2 characters long')
      .max(10, 'Last Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Last Name'),
    date_of_birth: Yup.string()
      .nullable()
      .min(10, 'Enter valid date')
      .required('Date of birth is required'),
    purpose_of_loan: Yup.string().required('Loan Purpose is required'),
    property_type: Yup.string().required('Property Type is required'),
    mobile_number: Yup.string()
      .matches(/^(?!.*(\d)\1{4})(?!.*(\d{5}).*\2)\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
  }),
});
