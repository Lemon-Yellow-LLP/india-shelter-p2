import { IconHomeLoan, IconLoanAgainstProperty } from '../../../../assets/icons';

export const loanTypeOptions = [
  {
    label: 'Home Loan',
    value: 'HL',
    icon: <IconHomeLoan />,
  },
  {
    label: 'Loan against Property',
    value: 'LAP',
    icon: <IconLoanAgainstProperty />,
  },
];

export const loanOptions = {
  'Home Purchase': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
    {
      label: 'Ready Built Flat',
      value: 'Ready Built Flat',
    },
  ],
  'Home Construction': [
    {
      label: 'Owned Plot',
      value: 'Owned Plot',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
  ],
  'Home Renovation/Extension': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
  ],
  'BT+Top-up': [
    {
      label: 'Residential House',
      value: 'Residential House',
    },
    {
      label: 'Plot + Construction',
      value: 'Plot + Construction',
    },
    {
      label: 'Ready Built Flat',
      value: 'Ready Built Flat',
    },
  ],
};

export const loanPurposeData = [
  {
    label: 'Home Purchase',
    value: 'Home Purchase',
  },
  {
    label: 'Home Construction',
    value: 'Home Construction',
  },
  {
    label: 'Home Renovation/Extension',
    value: 'Home Renovation/Extension',
  },
  {
    label: 'BT+Top-up',
    value: 'BT+Top-up',
  },
];
