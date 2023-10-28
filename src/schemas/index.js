import * as Yup from 'yup';
import { checkIsValidStatePincode } from '../global';

export const signInSchema = Yup.object({
  username: Yup.string()
    .required('This field is mandatory')
    .min(10, 'Enter a valid phone number')
    .max(10, 'Enter a valid phone number'),
});

const applicantSchema = Yup.object().shape({
  applicant_details: Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .min(2, 'First Name must be atleast 2 characters long')
      .max(10, 'First Name can be max 10 characters long')
      .required('First Name is required')
      .matches(/^[A-Za-z][A-Za-z\s]*$/, 'Invalid characters in First Name'),
    middle_name: Yup.string()
      .trim()
      .nullable()
      .min(2, 'Middle Name must be atleast 2 characters long')
      .max(10, 'Middle Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters'),
    last_name: Yup.string()
      .trim()
      .nullable()
      .min(2, 'Last Name must be atleast 2 characters long')
      .max(10, 'Last Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters'),
    date_of_birth: Yup.string().required(
      'Date of Birth is Required. Minimum age must be 18 or 18+',
    ),
    mobile_number: Yup.string()
      .matches(/^(?!.*(\d)\1{4})(?!.*(\d{5}).*\2)\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
  }),

  personal_details: Yup.object().shape({
    how_would_you_like_to_proceed: Yup.string().required('This field is mandatory.'),
    id_type: Yup.string().required('This field is mandatory.'),
    id_number: Yup.string().when('id_type', (value, schema) => {
      if (value[0] === 'Passport') {
        return schema
          .matches(
            /^[A-PR-WY-Za-pr-wy-z][0-9]{7}$/,
            'Invalid Passport number. Format should be J1234567',
          )
          .required('Enter a valid ID number');
      } else if (value[0] === 'PAN') {
        return schema
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid Pan number. Format should be AAAPB2117A')
          .required('Enter a valid ID number');
      } else if (value[0] === 'AADHAR') {
        return schema
          .min(12, 'Enter Valid 12 digit Aadhar number')
          .max(12, 'Enter Valid 12 digit Aadhar number')
          .required('Enter a valid ID number');
      } else if (value[0] === 'Driving license') {
        return schema
          .matches(
            /^[A-Za-z]{2}\d{13}$/,
            'Enter Valid Driving license number. Format should be DL1234567891012',
          )
          .required('Enter a valid ID number');
      } else if (value[0] === 'Voter ID') {
        return schema
          .matches(/^[A-Za-z]{3}\d{7}$/, 'Enter Valid Voter ID number. Format should be XGS1234567')
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
            /^[A-PR-WY-Za-pr-wy-z][0-9]{7}$/,
            'Invalid Passport number. Format should be J1234567',
          )
          .required('Enter a valid address proof number');
      } else if (value[0] === 'PAN Card') {
        return schema
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid Pan number. Format should be AAAPB2117A')
          .required('Enter a valid address proof number');
      } else if (value[0] === 'AADHAR') {
        return schema
          .min(12, 'Enter Valid 12 digit Aadhar number')
          .max(12, 'Enter Valid 12 digit Aadhar number')
          .required('Enter a valid address proof number');
      } else if (value[0] === 'Driving license') {
        return schema
          .matches(
            /^[A-Za-z]{2}\d{13}$/,
            'Enter Valid Driving license number. Format should be DL1234567891012',
          )
          .required('Enter a valid address proof number');
      } else if (value[0] === 'Voter ID') {
        return schema
          .matches(/^[A-Za-z]{3}\d{7}$/, 'Enter Valid Voter ID number. Format should be XGS1234567')
          .required('Enter a valid address proof number');
      } else {
        return schema.required('This field is mandatory.');
      }
    }),
    first_name: Yup.string()
      .min(2, 'First Name must be atleast 2 characters long')
      .max(10, 'First Name can be max 10 characters long')
      .required('First Name is required')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in First Name'),
    middle_name: Yup.string()
      .nullable()
      .min(2, 'Middle Name must be atleast 2 characters long')
      .max(10, 'Middle Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Middle Name'),
    last_name: Yup.string()
      .nullable()
      .min(2, 'Last Name must be atleast 2 characters long')
      .max(10, 'Last Name can be max 10 characters long')
      .matches(/^[a-zA-Z]+$/, 'Invalid characters in Last Name'),
    gender: Yup.string().required('This field is mandatory.'),
    date_of_birth: Yup.string().required('Date of birth is required'),
    mobile_number: Yup.string()
      .matches(/^(?!.*(\d{5}).*\1)\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
    father_husband_name: Yup.string()
      .trim()
      .min(2, 'Father/Husbands Name must be atleast 2 characters long')
      .max(90, 'Father/Husbands Name can be max 90 characters long')
      .required('Father/Husbands Name is required')
      .matches(/^[a-zA-Z\s]*$/, 'Invalid characters'),
    mother_name: Yup.string()
      .trim()
      .min(2, 'Mother Name must be atleast 2 characters long')
      .max(90, 'Mother Name can be max 90 characters long')
      .required('Mother Name is required')
      .matches(/^[a-zA-Z\s]*$/, 'Invalid characters'),
    marital_status: Yup.string().required('This field is mandatory.'),
    religion: Yup.string().required('Religion is required'),
    preferred_language: Yup.string().required('Preferred Language is required'),
    qualification: Yup.string().required('Qualification is required'),
    email: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
  }),

  work_income_detail: Yup.object().shape({
    profession: Yup.string().required('This field is mandatory'),
    no_current_loan: Yup.number()
      .required('This field is mandatory')
      .min(0, 'No. of Current loan(s) can be min 0')
      .max(99, 'No. of Current loan(s) can be max 99'),
    ongoing_emi: Yup.number()
      .required('This field is mandatory')
      .when('no_current_loan', {
        is: (val) => val > 0,
        then: (schema) => schema.min(1, 'EMI amount should be greater than 0'),
        otherwise: (schema) => schema.min(0),
      }),
    total_family_number: Yup.string().required('This field is mandatory'),
    total_household_income: Yup.string().required('This field is mandatory'),
    no_of_dependents: Yup.string().required('This field is mandatory'),
    extra_params: Yup.object().shape({
      extra_company_name: Yup.string()
        .trim()
        .min(2, 'Company name must be atleast 2 characters long')
        .max(90, 'Company name can be max 90 characters long')
        .required('This field is mandatory'),
      extra_industries: Yup.string()
        .trim()
        .min(2, 'Industry name must be atleast 2 characters long')
        .max(90, 'Industry name can be max 90 characters long')
        .required('This field is mandatory'),
    }),

    //Salaried and Self Employed
    flat_no_building_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 2 characters long')
      .max(90, 'Address can be max 90 characters long'),
    street_area_locality: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 2 characters long')
      .max(90, 'Address can be max 90 characters long'),
    town: Yup.string()
      .trim()
      .min(2, 'Town must be atleast 2 characters long')
      .max(90, 'Town can be max 90 characters long')
      .required('This field is mandatory'),
    landmark: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Landmark must be atleast 2 characters long')
      .max(90, 'Landmark can be max 90 characters long'),
    pincode: Yup.string()
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .required('This field is mandatory')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
    //Salaried
    company_name: Yup.string().required('This field is mandatory'),
    total_income: Yup.number()
      .required('This field is mandatory')
      .required('Total income should not be less than ₹ 10,000 and more than ₹ 50,00,00,000')
      .typeError('Total income should not be less than ₹ 10,000 and more than ₹ 50,00,00,000')
      .min(10000, 'Total income should not be less than ₹ 10,000 and more than ₹ 50,00,00,000')
      .max(
        500000000,
        'Total loan amount should not be less than ₹ 10,000 and more than ₹ 50,00,00,000',
      ),
    pf_uan: Yup.string()
      .trim()
      .min(12, 'pf uan number must be atleast 12 characters')
      .max(12, 'pf uan number must be atleast 12 characters'),
    working_since: Yup.string().required('This field is mandatory'),
    mode_of_salary: Yup.string().required('This field is mandatory'),

    //Self Employed
    business_name: Yup.string()
      .trim()
      .min(2, 'Business name must be atleast 2 characters long')
      .max(90, 'Business name can be max 90 characters long')
      .required('This field is mandatory'),
    industries: Yup.string().required('This field is mandatory'),

    gst_number: Yup.string().matches(
      /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[0-9]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,
      'Invalid GST Number Eg: 06AAAPB2117A1ZI ',
    ),

    //Pentioner
    pention_amount: Yup.string().required('This field is mandatory'),
  }),

  address_detail: Yup.object().shape({
    current_type_of_residence: Yup.string().trim().required('This field is mandatory'),
    current_flat_no_building_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Flat no/Building name must be atleast 2 characters long')
      .max(90, 'Flat no/Building name can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    current_street_area_locality: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Street/Area/Locality must be atleast 2 characters long')
      .max(90, 'Street/Area/Locality can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    current_town: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Town must be atleast 2 characters long')
      .max(90, 'Town can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    current_landmark: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Landmark must be atleast 2 characters long')
      .max(90, 'Landmark can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    current_pincode: Yup.string()
      .trim()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Pincode a valid Pincode')
      .max(6, 'Pincode a valid Pincode'),
    current_no_of_year_residing: Yup.string().required('This field is mandatory'),

    permanent_flat_no_building_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Flat no/Building name must be atleast 2 characters long')
      .max(90, 'Flat no/Building name can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    permanent_street_area_locality: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Street/Area/Locality must be atleast 2 characters long')
      .max(90, 'Street/Area/Locality can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    permanent_town: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Town must be atleast 2 characters long')
      .max(90, 'Town can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    permanent_landmark: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Landmark must be atleast 2 characters long')
      .max(90, 'Landmark can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    permanent_pincode: Yup.string()
      .trim()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Pincode a valid Pincode')
      .max(6, 'Pincode a valid Pincode'),
    permanent_no_of_year_residing: Yup.string().required('This field is mandatory'),
  }),
});

export const validationSchemaLead = Yup.object().shape({
  property_details: Yup.object().shape({
    property_identification_is: Yup.string().required('This field is mandatory'),
    property_value_estimate: Yup.string().trim().required('This field is mandatory'),
    owner_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long')
      .matches(/^[a-zA-Z ]+$/, 'Invalid characters'),
    plot_house_flat: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 2 characters long')
      .max(90, 'Address can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    project_society_colony: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Address must be atleast 2 characters long')
      .max(90, 'Address can be max 90 characters long')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    pincode: Yup.string()
      .trim()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
  }),
  reference_details: Yup.object().shape({
    reference_1_type: Yup.string().trim().required('This field is mandatory'),
    reference_1_full_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Invalid characters'),
    reference_1_address: Yup.string()
      .trim()
      .min(10, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long')
      .required('This field is mandatory')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    reference_1_phone_number: Yup.string()
      .trim()
      .min(10, 'Enter a valid 10 digit mobile number')
      .max(10, 'Enter a valid 10 digit mobile number')
      .required('This field is mandatory')
      .test('reference_1_phone_number', 'Invalid mobile number', async (mobileNumber) => {
        const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];
        if (DISALLOW_NUM.includes(mobileNumber.at(0))) return false;
        return true;
      }),

    reference_1_pincode: Yup.string()
      .trim()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
    reference_1_email: Yup.string()
      .trim()
      .email('Enter a valid Email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),

    reference_2_type: Yup.string().required('This field is mandatory'),
    reference_2_full_name: Yup.string()
      .trim()
      .required('This field is mandatory')
      .min(2, 'Name must be atleast 2 characters long')
      .max(90, 'Name can be max 90 characters long')
      .matches(/^[a-zA-Z0-9 ]+$/, 'Invalid characters'),
    reference_2_address: Yup.string()
      .trim()
      .min(10, 'Address must be atleast 10 characters long')
      .max(90, 'Address can be max 90 characters long')
      .required('This field is mandatory')
      .matches(/^[a-zA-Z0-9.,/ -]+$/, 'Invalid characters'),
    reference_2_phone_number: Yup.string()
      .trim()
      .min(10, 'Enter a valid 10 digit mobile number')
      .max(10, 'Enter a valid 10 digit mobile number')
      .required('This field is mandatory')
      .test('reference_2_phone_number', 'Invalid mobile number', async (mobileNumber) => {
        const DISALLOW_NUM = ['0', '1', '2', '3', '4', '5'];
        if (DISALLOW_NUM.includes(mobileNumber.at(0))) return false;
        return true;
      }),
    reference_2_pincode: Yup.string()
      .trim()
      .required('This field is mandatory')
      .matches(/^(0|[1-9]\d*)$/, 'Enter a valid Pincode')
      .min(6, 'Enter a valid Pincode')
      .max(6, 'Enter a valid Pincode'),
    reference_2_email: Yup.string()
      .trim()
      .email('Enter a valid Email')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
  }),

  lead: Yup.object().shape({
    loan_type: Yup.string().required('This field is mandatory field.'),
    purpose_of_loan: Yup.string().required('Loan Purpose is required'),
    property_type: Yup.string().required('Property Type is required'),
    applied_amount: Yup.number()
      .min(100000, 'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000')
      .max(
        5000000,
        'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000',
      )
      .required('This field is mandatory.'),
  }),

  lnt_mobile_number: Yup.object().shape({
    mobile_number: Yup.string()
      .matches(/^(?!.*(\d)\1{4})(?!.*(\d{5}).*\2)\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
  }),

  applicants: Yup.array().of(applicantSchema),
});
