import { reference } from '@popperjs/core';
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

async function editReferenceById(id, referenceData) {
  if (!id) return;

  const res = await axios.patch(`${API_URL}/reference/edit/${id}`, referenceData, requestOptions);
  return res.data;
}

async function editPropertyById(id, propertyData) {
  if (!id) return;

  const res = await axios.patch(`${API_URL}/property/edit/${id}`, propertyData, requestOptions);
  return res.data;
}

async function getCompanyNamesList() {
  const res = await axios.get(`${API_URL}/company-list`, requestOptions);
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
  const parts = dateString.split('-');
  const year = parts[0];
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
  const res = await axios.post(`${API_URL}/personal/verify-email/${id}`, { otp }, requestOptions);
  return res;
}

async function editFieldsById(id, page, values) {
  const { data } = await axios.patch(`${API_URL}/${page}/edit/${id}`, values, requestOptions);
  return data;
}

async function addApi(page, values) {
  const { data } = await axios.post(`${API_URL}/${page}/add`, values, requestOptions);
  return data;
}

async function getMobileOtp(id) {
  const res = await axios.get(`${API_URL}/applicant/send-sms/${id}`, {}, requestOptions);
  return res;
}

async function verifyMobileOtp(id, otp) {
  const res = await axios.post(`${API_URL}/applicant/verify-sms/${id}`, { otp }, requestOptions);
  return res;
}

async function editAddressById(id, data) {
  const res = await axios.patch(`${API_URL}/address/edit/${id}`, data, requestOptions);
  return res;
}

async function checkExistingCustomer(body) {
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  let requestOptions2 = {
    method: 'POST',
    headers: myHeaders,
    body: body,
    redirect: 'follow',
    mode: 'no-cors',
  };

  // const res = await axios.post(
  //   `https://eyt7u5wx9l.execute-api.ap-south-1.amazonaws.com/v1/digibre-run`,
  //   body,
  // );

  await fetch(
    'https://eyt7u5wx9l.execute-api.ap-south-1.amazonaws.com/v1/digibre-run',
    requestOptions2,
  ).then((res) => {
    return res;
  });
}

// L&T
export async function getLnTChargesQRCode(leadId, values) {
  const { data } = await axios.post(`${API_URL}/lt-charges/payment-qr/${leadId}`);
  return data;
}

export async function checkPaymentStatus(leadId, values) {
  try {
    const { data } = await axios.post(`${API_URL}/lt-charges/payment-verify/${leadId}`);
    return data;
  } catch (err) {}
}

export async function addLnTCharges(leadId, values) {
  const { data } = await axios.post(`${API_URL}/lt-charges/add/`, {
    lead_id: leadId,
  });
  console.log('Added LnT Charge');
  return data;
}

export async function doesLnTChargesExist(leadId, values) {
  try {
    const { data } = await axios.get(`${API_URL}/lt-charges/by-lead/${leadId}`);
    return {
      data,
      success: true,
    };
  } catch (err) {
    return {
      err,
      success: false,
    };
  }
}

export async function editLnTCharges(leadId, values) {
  const { data } = await axios.post(`${API_URL}/lt-charges/edit/`, {
    values,
  });
  return data;
}

export async function sendPaymentLink(leadId, values) {
  const { data } = await axios.post(`${API_URL}/lt-charges/add/`, values);
  return data;
}

export async function makePaymentByCash(leadId, values) {
  try {
    const { data } = await axios.post(`${API_URL}/lt-charges/edit/`, {
      method: 'Cash',
      status: 'success',
    });
  } catch (err) {
    console.error(err);
  }
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
  editReferenceById,
  editPropertyById,
  editFieldsById,
  getCompanyNamesList,
  editAddressById,
  getMobileOtp,
  verifyMobileOtp,
  addApi,
  checkExistingCustomer,
};
