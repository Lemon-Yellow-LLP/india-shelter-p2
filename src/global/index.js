import { reference } from '@popperjs/core';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_URL = import.meta.env.VITE_API_URL || 'https://lo.scotttiger.in/api';

const requestOptions = {};

const bre_timeout = 900000;

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

//WORK AND INCOME SCREEN

async function getCompanyNamesList() {
  const res = await axios.get(`${API_URL}/company-list`, requestOptions);
  return res.data;
}

//LOGIN SCREEN

async function getLoginOtp(mobile_no) {
  const res = await axios.get(
    `${API_URL}/account/login-sms-otp-request/${mobile_no}`,
    requestOptions,
  );
  return res.data;
}

async function verifyLoginOtp(mobile_no, otp) {
  const res = await axios.post(
    `${API_URL}/account/login-sms-otp-verify/${mobile_no}`,
    otp,
    requestOptions,
  );
  return res.data;
}

async function logout(status, options) {
  const res = await axios.post(`${API_URL}/account/user/logout`, status, options);
  return res.data;
}

async function testLogout(options) {
  const res = await axios.post(`${API_URL}/session/check-auth/login`, {}, options);
  return res.data;
}

async function getAllLoanOfficers() {
  const res = await axios.get(`${API_URL}/account`, requestOptions);
  return res.data;
}

//BRE SCREEN

async function verifyPan(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/pan/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );

  return res.data;
}

async function verifyDL(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/driver-license/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );

  return res.data;
}

async function verifyVoterID(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/voter/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );

  return res.data;
}

async function verifyGST(id, options) {
  const res = await axios.post(
    `${API_URL}/work-income/gst/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );

  return res.data;
}

async function verifyPFUAN(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/uan/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );

  return res.data;
}

async function checkDedupe(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/dedupe/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );
  return res;
}

async function checkBre99(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/bre-99/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );
  return res.data;
}

async function checkCibil(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/cibil/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );
  return res;
}

async function checkCrif(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/crif/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );
  return res;
}

async function checkBre101(id, options) {
  const res = await axios.post(
    `${API_URL}/lead/bre-101/${id}`,
    {},
    {
      ...options,
      timeout: bre_timeout,
      'axios-retry': {
        retries: 3,
        retryCondition: () => true,
      },
    },
  );
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
  } catch (err) {
    throw err;
  }
}

export async function addLnTCharges(leadId, values) {
  const { data } = await axios.post(`${API_URL}/lt-charges/add/`, {
    lead_id: leadId,
  });
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

export async function editLnTCharges(id, values) {
  const { data } = await axios.patch(`${API_URL}/lt-charges/edit/${id}`, values);
  return data;
}

export async function makePaymentByCash(id, values) {
  try {
    const { data } = await axios.patch(`${API_URL}/lt-charges/edit/${id}`, {
      extra_params: {
        method: 'Cash',
        status: 'success',
      },
    });
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function makePaymentByLink(id, values) {
  try {
    const { data } = await axios.post(`${API_URL}/lt-charges/invoice-create/${id}`, values);
    return data;
  } catch (err) {
    console.log(err);
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
  getLoginOtp,
  verifyLoginOtp,
  logout,
  testLogout,
  getAllLoanOfficers,
  verifyPan,
  verifyDL,
  verifyVoterID,
  verifyGST,
  verifyPFUAN,
  checkDedupe,
  checkBre99,
  checkCibil,
  checkCrif,
  checkBre101,
};
