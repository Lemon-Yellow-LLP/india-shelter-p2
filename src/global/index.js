import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';

const API_URL = import.meta.env.VITE_API_URL || 'https://uatagile.indiashelter.in/api';

const requestOptions = {};

const bre_timeout = 90000;

axiosRetry(axios, { retries: 0 });

async function pingAPI() {
  const res = await axios.get(`${API_URL}`, {}, requestOptions);
  return res.data;
}

async function checkIsValidStatePincode(pincode, options) {
  try {
    const res = await axios.get(`${API_URL}/state-pin/${pincode}`, options, requestOptions);
    return res.data;
  } catch (error) {
    return false;
  }
}

async function editReferenceById(id, referenceData, options) {
  if (!id) return;

  const res = await axios.patch(`${API_URL}/reference/edit/${id}`, referenceData, options);
  return res.data;
}

async function editPropertyById(id, propertyData, options) {
  if (!id) return;

  const res = await axios.patch(`${API_URL}/property/edit/${id}`, propertyData, options);
  return res.data;
}

//WORK AND INCOME SCREEN

async function getCompanyNamesList(options) {
  const res = await axios.get(`${API_URL}/company-list`, options);
  return res.data;
}

//LOGIN SCREEN

async function getLoginOtp(mobile_no) {
  try {
    const res = await axios.get(
      `${API_URL}/account/login-sms-otp-request/${mobile_no}`,
      requestOptions,
    );
    return res.data;
  } catch (error) {
    return { error: true, message: error.response.data.message };
  }
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

async function getAllLoanOfficers(options) {
  const res = await axios.get(`${API_URL}/account`, options);
  return res.data;
}

//BRE SCREEN

async function verifyPan(id, data, options) {
  const res = await axios.post(`${API_URL}/applicant/pan/${id}`, data, {
    ...options,
    timeout: bre_timeout,
    'axios-retry': {
      retries: 3,
      retryCondition: () => true,
    },
  });

  return res.data;
}

async function verifyDL(id, data, options) {
  const res = await axios.post(`${API_URL}/applicant/driver-license/${id}`, data, {
    ...options,
    timeout: bre_timeout,
    'axios-retry': {
      retries: 3,
      retryCondition: () => true,
    },
  });

  return res.data;
}

async function verifyVoterID(id, data, options) {
  const res = await axios.post(`${API_URL}/applicant/voter/${id}`, data, {
    ...options,
    timeout: bre_timeout,
    'axios-retry': {
      retries: 3,
      retryCondition: () => true,
    },
  });

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
  console.log('dedupe response', res);
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

async function checkBre201(id, options) {
  const res = await axios.post(
    `${API_URL}/applicant/bre-201/${id}`,
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

async function pushToSalesforce(id, options) {
  const res = await axios.get(`${API_URL}/lead/salesforce-push/${id}`, {
    ...options,
  });
  return res.data;
}

async function getLeadById(id, options) {
  if (!id) return;
  const res = await axios.get(`${API_URL}/lead/${id}`, options);
  return res.data;
}

// UPLOAD DOCUMENT

async function uploadDoc(data, options) {
  const res = await axios.post(`${API_URL}/doc/upload/document`, data, options);
  return res.data;
}

async function editDoc(id, data, options) {
  const res = await axios.patch(`${API_URL}/doc/edit/${id}`, data, options);
  return res.data;
}

async function getApplicantById(id, options) {
  const res = await axios.get(`${API_URL}/applicant/${id}`, options);
  return res.data;
}

async function reUploadDoc(id, data, options) {
  const res = await axios.post(`${API_URL}/doc/upload/document/re-upload/${id}`, data, options);
  return res.data;
}

async function getUploadOtp(id, options) {
  const res = await axios.get(`${API_URL}/doc/send-lo-selfie-sms/${id}`, options, requestOptions);
  return res;
}

async function verifyUploadOtp(id, otp, options) {
  const res = await axios.post(`${API_URL}/doc/verify-lo-selfie-sms/${id}`, { otp }, options);
  return res;
}

async function getUserById(id, options) {
  const res = await axios.get(`${API_URL}/account/${id}`, options);
  return res.data;
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

async function getEmailOtp(id, options) {
  const res = await axios.get(`${API_URL}/personal/send-email/${id}`, options);
  return res;
}

async function verifyEmailOtp(id, otp, options) {
  const res = await axios.post(`${API_URL}/personal/verify-email/${id}`, { otp }, options);
  return res;
}

async function editFieldsById(id, page, values, options) {
  if (!id) return;
  const { data } = await axios.patch(`${API_URL}/${page}/edit/${id}`, values, options);
  return data;
}

async function addApi(page, values, options) {
  const { data } = await axios.post(`${API_URL}/${page}/add`, values, options);
  return data;
}

async function getMobileOtp(id, options) {
  const res = await axios.get(`${API_URL}/applicant/send-sms/${id}`, options, requestOptions);
  return res;
}

async function verifyMobileOtp(id, otp, options) {
  const res = await axios.post(`${API_URL}/applicant/verify-sms/${id}`, { otp }, options);
  return res;
}

async function editAddressById(id, data, options) {
  if (!id) return;
  const res = await axios.patch(`${API_URL}/address/edit/${id}`, data, options);
  return res;
}

// L&T
export async function getLnTChargesQRCode(leadId, options) {
  const { data } = await axios.post(`${API_URL}/lt-charges/payment-qr/${leadId}`, {}, options);
  return data;
}

const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds

export async function checkPaymentStatus(leadId, options) {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);
  const { data } = await axios.post(
    `${API_URL}/lt-charges/payment-verify/${leadId}`,
    {},
    {
      ...options,
      signal: controller.signal,
    },
  );

  return data;
}

export async function checkIfLntExists(leadId, options) {
  const { data } = await axios.get(`${API_URL}/lt-charges/check-lead-payment/${leadId}`, options);
  return data;
}

export async function addLnTCharges(leadId, options) {
  const { data } = await axios.post(
    `${API_URL}/lt-charges/add/`,
    {
      lead_id: leadId,
    },
    options,
  );
  return data;
}

export async function doesLnTChargesExist(leadId) {
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

export async function makePaymentByCash(id, options) {
  try {
    const { data } = await axios.patch(
      `${API_URL}/lt-charges/edit/${id}`,
      {
        method: 'Cash',
        status: 'Completed',
      },
      options,
    );
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function editLnTCharges(id, values) {
  try {
    const { data } = await axios.patch(`${API_URL}/lt-charges/edit/${id}`, values);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function makePaymentByLink(id, values, options) {
  try {
    const { data } = await axios.post(
      `${API_URL}/lt-charges/invoice-create/${id}`,
      values,
      options,
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getDashboardLeadById(id, options) {
  try {
    const { data } = await axios.get(`${API_URL}/dashboard/lead/${id}`, options);
    return data;
  } catch (err) {
    return err;
  }
}

export async function getDashboardLeadList(
  {
    // dd-mm-yyyy
    fromDate,
    toDate,
  },
  options,
) {
  fromDate = moment(fromDate).format('DD-MM-YYYY');
  toDate = moment(toDate).format('DD-MM-YYYY');

  try {
    const { data } = await axios.get(
      `${API_URL}/dashboard/lead-list/l?fromDate=${fromDate}&toDate=${toDate}`,
      options,
    );
    // const { data } = await axios.get(`${API_URL}/dashboard/lead-list/l`, values);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export {
  API_URL,
  pingAPI,
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
  checkBre201,
  pushToSalesforce,
  getLeadById,
  uploadDoc,
  getApplicantById,
  getUploadOtp,
  verifyUploadOtp,
  reUploadDoc,
  getUserById,
  editDoc,
};
