export const newCoApplicantValues = {
  applicant_details: {
    applicant_type: 'Co Applicant',
    lead_id: null,
    is_primary: false,
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    mobile_number: '',
    is_mobile_verified: false,
    bre_101_response: null,
    extra_params: {
      progress: 57,
      banking_progress: 0,
      is_existing: false,
      is_existing_done: false,
      upload_progress: 0,
      qualifier_api_progress: 0,
      eligibility_api_progress: 0,
      previous_id_number: '',
      previous_address_proof_number: '',
      previous_pf_uan: '',
      previous_gst_number: '',
      PAN_status: null,
      DL_Status: null,
      Voter_Status: null,
      UAN_Status: null,
      GST_Status: null,
      pan_ran: null,
      dl_ran: null,
      voter_ran: null,
      pf_ran: null,
      gst_ran: null,
      upload_required_fields_status: {
        customer_photo: false,
        id_proof: false,
        address_proof: false,
        property_paper: false,
        salary_slip: false,
        form_60: false,
        property_image: false,
        upload_selfie: false,
      },
      required_fields_status: {
        loan_type: true,
        applied_amount: true,
        first_name: false,
        date_of_birth: false,
        purpose_of_loan: true,
        property_type: true,
        mobile_number: false,
      },
      qualifier: false,
      eligibility: false,
    },
  },
  personal_details: {
    how_would_you_like_to_proceed: null,
    id_type: null,
    id_number: '',
    selected_address_proof: null,
    address_proof_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: null,
    date_of_birth: null,
    mobile_number: '',
    father_name: '',
    mother_name: '',
    marital_status: null,
    spouse_name: '',
    religion: '',
    preferred_language: '',
    qualification: '',
    email: '',
    is_email_verified: false,
    extra_params: {
      same_as_id_type: false,
      progress: 20,
      is_existing_done: false,
      required_fields_status: {
        how_would_you_like_to_proceed: false,
        id_type: false,
        id_number: false,
        selected_address_proof: false,
        address_proof_number: false,
        first_name: true,
        gender: false,
        date_of_birth: true,
        mobile_number: true,
        father_name: false,
        mother_name: false,
        marital_status: false,
        religion: false,
        preferred_language: false,
        qualification: false,
      },
    },
  },
  address_detail: {
    current_type_of_residence: '',
    current_flat_no_building_name: '',
    current_street_area_locality: '',
    current_town: '',
    current_landmark: '',
    current_pincode: '',
    current_city: '',
    current_state: '',
    current_no_of_year_residing: null,
    additional_type_of_residence: '',
    additional_flat_no_building_name: '',
    additional_street_area_locality: '',
    additional_town: '',
    additional_landmark: '',
    additional_pincode: '',
    additional_city: '',
    additional_state: '',
    additional_no_of_year_residing: null,
    additional_type_of_residence: '',

    extra_params: {
      additional_address_same_as_current: false,
      progress: 0,
      is_existing_done: false,
      required_fields_status: {
        current_type_of_residence: false,
        current_flat_no_building_name: false,
        current_street_area_locality: false,
        current_town: false,
        current_landmark: false,
        current_pincode: false,
        current_no_of_year_residing: false,
        additional_flat_no_building_name: false,
        additional_street_area_locality: false,
        additional_town: false,
        additional_landmark: false,
        additional_pincode: false,
        additional_no_of_year_residing: false,
        additional_type_of_residence: false,
      },
    },
  },
  work_income_detail: {
    profession: '',
    company_name: '',
    total_income: '',
    pf_uan: '',
    no_current_loan: null,
    ongoing_emi: '',
    working_since: '',
    mode_of_salary: '',
    flat_no_building_name: '',
    street_area_locality: '',
    town: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    total_family_number: '',
    total_household_income: '',
    no_of_dependents: '',
    business_name: '',
    industries: '',
    gst_number: '',
    pention_amount: '',
    geo_lat: '',
    geo_long: '',
    extra_params: {
      extra_company_name: '',
      extra_industries: '',
      progress: 0,
      required_fields_status: {
        profession: false,
        flat_no_building_name: false,
        street_area_locality: false,
        landmark: false,
        pincode: false,
        no_current_loan: false,
        ongoing_emi: false,
        total_family_number: false,
        total_household_income: false,
        no_of_dependents: false,
      },
    },
  },
};
