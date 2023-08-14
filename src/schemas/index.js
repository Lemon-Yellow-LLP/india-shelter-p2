import * as Yup from 'yup';
import { parse, isDate } from 'date-fns';

function parseDateString(_, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date());

  return parsedDate;
}

export const signUpSchema = Yup.object({
  reference_one_type: Yup.string().required('Please select your reference type'),
  reference_two_type: Yup.string().required('Please select your reference type'),
  reference_one_full_name: Yup.string().required('Please enter your Full name'),
  reference_two_full_name: Yup.string().required('Please enter your Full name'),
  reference_one_address: Yup.string()
    .max(90, 'Character limit exceeded')
    .required('Please enter your address'),
  reference_two_address: Yup.string()
    .max(90, 'Character limit exceeded')
    .required('Please enter your address'),
  reference_one_phone_number: Yup.string()
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits')
    .required('Please enter your valid 10 digit mobile number'),
  reference_two_phone_number: Yup.string()
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits')
    .required('Please enter your valid 10 digit mobile number'),
  reference_one_pincode: Yup.string()
    .required('Please enter valid Pincode for your region')
    .matches(/^(0|[1-9]\d*)$/, 'Must be only digits')
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
  reference_two_pincode: Yup.string()
    .required('Please enter valid Pincode for your region')
    .matches(/^(0|[1-9]\d*)$/, 'Must be only digits')
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
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
    .min(6, 'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
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

  reference_one_email: Yup.string()
    .email()
    .required('Please enter your email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
  reference_two_email: Yup.string()
    .email()
    .required('Please enter your email')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a Valid Email'),
}).shape({
  loan_request_amount: Yup.number()
    .required('Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000')
    .typeError('Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000')
    .min(100000, 'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000')
    .max(5000000, 'Total loan amount should not be less than ₹ 1,00,000 and more than ₹ 50,00,000'),
  property_estimation: Yup.string()
    .required('Please enter you property estimation')
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
});
