export const fieldLabels = {
  lo_id: 'Loan Officer ID',
  loan_type: 'Loan Type',
  purpose_of_loan: 'Purpose of Loan',
  property_type: 'Property type',
  applied_amount: 'Required loan amount',

  property_identification_is: 'Property identification is',
  property_value_estimate: 'Property value estimate',
  owner_name: 'Owner name',
  current_owner_name: 'Current owner name',
  plot_house_flat: 'Plot/House/Flat no.',
  project_society_colony: 'Project Society Colony',
  city: 'City',
  state: 'State',

  applicant_type: 'Primary Applicant',
  first_name: 'First Name',
  middle_name: 'Middle Name',
  last_name: 'Last Name',
  date_of_birth: 'Date of Birth',
  mobile_number: 'Mobile Number',

  id_type: 'ID type',
  id_number: 'ID number',
  selected_address_proof: 'Address proof',
  address_proof_number: 'Address proof number',
  gender: 'Gender',
  father_name: `Father's name`,
  spouse_name: `Spouse's name`,
  mother_name: `Mother's name`,
  marital_status: 'Marital Status',
  religion: 'Religion',
  preferred_language: 'Preferred language',
  qualification: 'Qualification',
  email: 'Email',

  current_type_of_residence: 'Type of Residence',
  current_flat_no_building_name: 'Current Flat no/Building name',
  current_street_area_locality: 'Current Street/Area/Locality',
  current_town: 'Current Town',
  current_landmark: 'Current Landmark',
  current_pincode: 'Current Pincode',
  current_city: 'Current City',
  current_state: 'Current State',
  current_no_of_year_residing: 'Current No. of Year Residing',
  additional_flat_no_building_name: 'Additional Flat no/Building name',
  additional_street_area_locality: 'Additional Street/Area/Locality',
  additional_town: 'Additional Town',
  additional_landmark: 'Additional Landmark',
  additional_pincode: 'Additional Pincode',
  additional_city: 'Additional City',
  additional_state: 'Additional State',
  additional_no_of_year_residing: 'Additional No. of Year Residing',
  additional_address_same_as_current: ' Additional address is same as Current address',
  additional_type_of_residence: 'Type of address',

  profession: 'Profession',
  company_name: 'Company Name',
  pf_uan: 'PF UAN',
  no_current_loan: 'No. of Current Loan',
  ongoing_emi: 'Ongoing EMI',
  working_since: 'Working Since',
  mode_of_salary: 'Mode Of Salary',
  flat_no_building_name: 'Flat No Building Name',
  street_area_locality: 'Street Area Locality',
  town: 'Town',
  landmark: 'Landmark',
  pincode: 'Pincode',
  total_family_number: 'Total Family',
  total_household_income: 'Total Household Income',
  no_of_dependents: 'No. of Dependents',
  business_name: 'Business Name',
  industries: 'Industries',
  gst_number: 'GST Number',
  pention_amount: 'Pention Amount',
  extra_company_name: 'Other Company Name',
  extra_industries: 'Other Industries',
  no_of_employees: 'No. of employees',
  udyam_number: 'Udyam number',
  income_proof: 'Income proof',
  salary_per_month: 'Salary per month',
  pan_number: 'PAN number',

  // reference
  reference_1_address: 'Reference 1 address',
  reference_1_city: 'Reference 1 city',
  reference_1_email: 'Reference 1 email',
  reference_1_full_name: 'Reference 1 full name',
  reference_1_phone_number: 'Reference 1 Phone number',
  reference_1_pincode: 'Reference 1 pincode',
  reference_1_state: 'Reference 1 state',
  reference_1_type: 'Reference 1 type',
  reference_2_address: 'Reference 2 address',
  reference_2_city: 'Reference 2 city',
  reference_2_email: 'Reference 2 email',
  reference_2_full_name: 'Reference 2 full name',
  reference_2_phone_number: 'Reference 2 phone number',
  reference_2_pincode: 'Reference 2 pincode',
  reference_2_state: 'Reference 2 state',
  reference_2_type: 'Reference 2 type',

  //upload
  customer_photo: 'Customer photo',
  id_proof: 'Id proof',
  address_proof: 'Address proof',
  property_paper: 'Property papers',
  salary_slip: 'Salary slip',
  form_60: 'Form 60',
  property_image: 'Property image',
  upload_selfie: 'Upload selfie',
};

export const nonRequiredFields = [
  'middle_name',
  'last_name',
  'extra_company_name',
  'extra_industries',
];

export const pages = {
  applicant_details: {
    title: 'Applicant Details',
    url: '/lead/applicant-details',
    name: 'applicant_details',
  },
  personal_details: {
    title: 'Personal Details',
    url: '/lead/personal-details',
    name: 'personal_details',
  },
  address_detail: {
    title: 'Address Details',
    url: '/lead/address-details',
    name: 'address_detail',
  },
  work_income_detail: {
    title: 'Work/Income Details',
    url: '/lead/work-income-details',
    name: 'work_income_detail',
  },
  property_details: {
    title: 'Property Details',
    url: '/lead/property-details',
    name: 'property_details',
  },
  banking_details: {
    title: 'Banking Details',
    url: '/lead/banking-details',
    name: 'banking_details',
  },
  reference_details: {
    title: 'Reference Details',
    url: '/lead/reference-details',
    name: 'reference_details',
  },
  upload_documents: {
    title: 'Upload Documents',
    url: '/lead/upload-documents',
    name: 'upload_documents',
  },
};
