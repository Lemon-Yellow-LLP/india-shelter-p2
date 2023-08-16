import {
  IconManual,
  IconOcr,
  IconEkyc,
  IconMale,
  IconFemale,
  IconTransGender,
  IconMarried,
  IconSingle,
  IconSalarid,
  IconSelfEmployed,
} from '../../../assets/icons';

export const personalDetailsModeOption = [
  {
    label: 'OCR',
    value: 'OCR',
    icon: <IconOcr />,
  },
  {
    label: 'e-KYC',
    value: 'e-KYC',
    icon: <IconEkyc />,
  },
  {
    label: 'Manual',
    value: 'Manual',
    icon: <IconManual />,
  },
];

export const personalDetailsGenderOption = [
  {
    label: 'Male',
    value: 'Male',
    icon: <IconMale />,
  },
  {
    label: 'Female',
    value: 'Female',
    icon: <IconFemale />,
  },
  {
    label: 'Transgender',
    value: 'Transgender',
    icon: <IconTransGender />,
  },
];

export const personalMaritalStatusOptions = [
  {
    label: 'Married',
    value: 'Married',
    icon: <IconMarried />,
  },
  {
    label: 'Single',
    value: 'Single',
    icon: <IconSingle />,
  },
];

export const professionOptions = [
  {
    label: 'Salarid',
    value: 'Salarid',
    icon: <IconSalarid />,
  },
  {
    label: 'Self employed',
    value: 'SelfEmployed',
    icon: <IconSelfEmployed />,
  },
];
