import React from 'react';
import { BankingManual, BankingAA, IconSingle } from '../../../../assets/icons';
import savingsIcon from '../../../../assets/icons/savingsIcon.svg';
import currentIcon from '../../../../assets/icons/currentIcon.svg';
import cashCreditIcon from '../../../../assets/icons/cashCreditIcon.svg';
import overDraftIcon from '../../../../assets/icons/overDraftIcon.svg';

export const bankingMode = [
  {
    label: 'Account Aggregator',
    value: 'Account Aggregator',
    icon: BankingAA,
  },
  {
    label: 'Manual',
    value: 'Manual',
    icon: BankingManual,
  },
];

export const entityType = [
  {
    label: 'Company',
    value: 'Company',
  },
  {
    label: 'Partnership',
    value: 'Partnership',
  },
  {
    label: 'Sole_Proprietorship',
    value: 'Sole_Proprietorship',
  },
  {
    label: 'Individual',
    value: 'Individual',
  },
  {
    label: 'Trust',
    value: 'Trust',
  },
];

export const account_type = [
  {
    label: 'Savings',
    value: 'Savings',
    icon: savingsIcon,
  },
  {
    label: 'Current',
    value: 'Current',
    icon: currentIcon,
  },
  {
    label: 'Cash Credit',
    value: 'Cash Credit',
    icon: cashCreditIcon,
  },
  {
    label: 'Over Draft',
    value: 'Over Draft',
    icon: overDraftIcon,
  },
];
