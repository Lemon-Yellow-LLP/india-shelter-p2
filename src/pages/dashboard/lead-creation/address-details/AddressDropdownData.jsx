import IconSelfOwned from '../../../../assets/icons/self-owned';
import IconRent from '../../../../assets/icons/rent';
import CommunicationIcon from '../../../../assets/icons/communication';
import PermanentIcon from '../../../../assets/icons/additional';

export const residenceData = [
  {
    label: 'Rented',
    value: 'Rented',
    icon: <IconRent />,
  },
  {
    label: 'Self owned',
    value: 'Self owned',
    icon: <IconSelfOwned />,
  },
];

export const yearsResidingData = [
  {
    label: '0-1',
    value: '0-1',
  },
  {
    label: '2-5',
    value: '2-5',
  },
  {
    label: '6-10',
    value: '6-10',
  },
  {
    label: '10+',
    value: '10+',
  },
];

export const typeOfAddressData = [
  {
    label: 'Communication',
    value: 'Communication',
    icon: <CommunicationIcon />,
  },
  {
    label: 'Permanent',
    value: 'Permanent',
    icon: <PermanentIcon />,
  },
];
