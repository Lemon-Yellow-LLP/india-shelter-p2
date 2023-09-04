import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_URL = import.meta.env.VITE_API_URL || 'https://lo.scotttiger.in/api';

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

  const dateString = date;
  const parts = dateString.split('/');
  const year = parts[2];
  const month = parts[1];
  const differenceInYear = today.getFullYear() - year;
  const differenceInMonth = today.getMonth() - month;

  if (differenceInYear > MAX_ALLOWED_YEAR) {
    return true;
  } else if (differenceInYear === MAX_ALLOWED_YEAR) {
    if (differenceInMonth > 0) return true;
    else if (differenceInMonth === 0 && today.getDate() >= date.getDate()) return true;
  }

  return false;
}

async function getEmailOtp(id) {
  const res = await axios.get(`${API_URL}/personal/send-email/${id}`, {}, requestOptions);
  return res;
}

async function verifyEmailOtp(id, otp) {
  console.log(otp);
  const res = await axios.post(`${API_URL}/personal/verify-email/${id}`, { otp }, requestOptions);
  return res;
}

export {
  API_URL,
  pingAPI,
  updateLeadDataOnBlur,
  NaNorNull,
  isEighteenOrAbove,
  checkIsValidStatePincode,
  getEmailOtp,
  verifyEmailOtp,
};
