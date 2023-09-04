import { reference } from '@popperjs/core';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_URL = import.meta.env.VITE_API_URL || 'https://lo.scotttiger.in/api';
const API_LEAD_URL = `${API_URL}/lead`;

const requestOptions = {};

axiosRetry(axios, { retries: 0 });

async function pingAPI() {
  const res = await axios.get(`${API_URL}`, {}, requestOptions);
  return res.data;
}

async function checkIsValidStatePincode(pincode) {
  const res = await axios.get(`${API_URL}/state-pin/${pincode}`, {}, requestOptions);
  return res.data;
}

async function editReferenceById(id, referenceData) {
  if (!id) return;

  const res = await axios.patch(`${API_URL}/reference/edit/${id}`, referenceData, requestOptions);
  return res.data;
}

async function updateLeadDataOnBlur(leadId, fieldName, value) {
  if (!leadId) return;
  const inputName = fieldName;
  const updatedFieldValue = {};
  updatedFieldValue[inputName] = value;
  return editLeadById(leadId, updatedFieldValue);
}

function NaNorNull(value, toReturn = null) {
  return isNaN(value) ? toReturn : value;
}

const MAX_ALLOWED_YEAR = 18;

function isEighteenOrAbove(date) {
  const today = new Date();

  const differenceInYear = today.getFullYear() - date.getFullYear();
  const differenceInMonth = today.getMonth() - date.getMonth();

  if (differenceInYear > MAX_ALLOWED_YEAR) {
    return true;
  } else if (differenceInYear === MAX_ALLOWED_YEAR) {
    if (differenceInMonth > 0) return true;
    else if (differenceInMonth === 0 && today.getDate() >= date.getDate()) return true;
  }

  return false;
}

export {
  API_URL,
  pingAPI,
  updateLeadDataOnBlur,
  NaNorNull,
  isEighteenOrAbove,
  checkIsValidStatePincode,
  editReferenceById,
};
