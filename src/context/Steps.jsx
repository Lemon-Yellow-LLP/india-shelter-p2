import {
  ApplicantDetailsIcon,
  WorkIncomeIcon,
  UploadIcon,
  ReferenceDetailsIcon,
  QualifierIcon,
  PropertyDetailsIcon,
  PreviewIcon,
  PersonalDetailsIcon,
  LnTIcon,
  BankingDetailsIcon,
  AddressDetailsIcon,
} from '../assets/icons';

export const applicantSteps = [
  {
    title: 'Applicant Details',
    description: 'Name, Mobile Number, Loan Type',
    url: '/lead/applicant-details',
    Icon: ApplicantDetailsIcon,
    name: 'applicant_details',
  },
  {
    title: 'Personal Details',
    description: 'OCR, e-KYC, Manual',
    url: '/lead/personal-details',
    lock: false,
    Icon: PersonalDetailsIcon,
    name: 'personal_details',
  },
  {
    title: 'Address Details',
    description: 'Current, Permanent',
    url: '/lead/address-details',
    lock: true,
    Icon: AddressDetailsIcon,
    name: 'address_detail',
  },
  {
    title: 'Work/Income Details',
    description: 'Profession details, Family Income',
    url: '/lead/work-income-details',
    lock: true,
    Icon: WorkIncomeIcon,
    name: 'work_income_detail',
  },
  {
    title: 'Qualifier is not activated',
    description: 'Complete Applicant, Personal, Address and Work & Income details to activate',
    url: '/lead/qualifier',
    hideProgress: true,
    Icon: QualifierIcon,
    name: 'qualifier',
  },
  {
    title: 'L&T Charges',
    description: 'Fee details',
    url: '/lead/lnt-charges',
    lock: true,
    Icon: LnTIcon,
    name: 'lt_charges',
  },
  {
    title: 'Property Details',
    description: 'Property Identification, Property address',
    url: '/lead/property-details',
    lock: true,
    Icon: PropertyDetailsIcon,
    name: 'property_details',
  },
  {
    title: 'Banking Details',
    description: 'IFSC Details, Bank Statement',
    url: '/lead/banking-details',
    lock: true,
    Icon: BankingDetailsIcon,
    name: 'banking_details',
  },
  {
    title: 'Reference Details',
    description: 'Reference person name, Address',
    url: '/lead/reference-details',
    lock: true,
    Icon: ReferenceDetailsIcon,
    name: 'reference_details',
  },
  {
    title: 'Upload Documents',
    description: 'Aadhar, PAN, Property document',
    url: '/lead/upload-documents',
    lock: true,
    Icon: UploadIcon,
    name: 'applicant_details',
  },
  {
    title: 'Preview',
    description: '',
    url: '/lead/preview',
    hideProgress: true,
    Icon: PreviewIcon,
  },
  {
    title: 'Eligibility is not activated',
    description: 'Complete all the steps to activate',
    url: '/lead/eligibility',
    hideProgress: true,
    Icon: QualifierIcon,
    name: 'eligibility',
  },
];

export const coApplicantSteps = [
  {
    title: 'Applicant Details',
    description: 'Name, Mobile Number, Loan Type',
    url: '/lead/applicant-details',
    Icon: ApplicantDetailsIcon,
    name: 'applicant_details',
  },
  {
    title: 'Personal Details',
    description: 'OCR, e-KYC, Manual',
    url: '/lead/personal-details',
    lock: false,
    Icon: PersonalDetailsIcon,
    name: 'personal_details',
  },
  {
    title: 'Address Details',
    description: 'Current, Permanent',
    url: '/lead/address-details',
    lock: true,
    Icon: AddressDetailsIcon,
    name: 'address_detail',
  },
  {
    title: 'Work/Income Details',
    description: 'Profession details, Family Income',
    url: '/lead/work-income-details',
    lock: true,
    Icon: WorkIncomeIcon,
    name: 'work_income_detail',
  },
  {
    title: 'Qualifier is not activated',
    description: 'Complete Applicant, Personal, Address and Work & Income details to activate',
    url: '/lead/qualifier',
    hideProgress: true,
    Icon: QualifierIcon,
    name: 'qualifier',
  },
  {
    title: 'Banking Details',
    description: 'IFSC Details, Bank Statement',
    url: '/lead/banking-details',
    lock: true,
    Icon: BankingDetailsIcon,
    name: 'banking_details',
  },
  {
    title: 'Upload Documents',
    description: 'Aadhar, PAN, Property document',
    url: '/lead/upload-documents',
    lock: true,
    Icon: UploadIcon,
    name: 'applicant_details',
  },
];
