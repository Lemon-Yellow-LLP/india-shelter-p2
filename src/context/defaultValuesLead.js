export const defaultValuesLead = {
  lead: {
    lo_id: null,
    loan_type: '',
    purpose_of_loan: '',
    property_type: '',
    applied_amount: '500000',
    extra_params: {
      progress: 0,
    },
  },

  property_details: {
    property_identification_is: '',
    property_value_estimate: '',
    owner_name: '',
    plot_house_flat: '',
    project_society_colony: '',
    pincode: null,
    city: '',
    state: '',
    geo_lat: '',
    geo_long: '',
    extra_params: {
      progress: 0,
      required_fields_status: {
        property_identification_is: false,
        property_value_estimate: false,
        owner_name: false,
        plot_house_flat: false,
        project_society_colony: false,
        pincode: false,
      },
    },
  },

  reference_details: {
    reference_1_type: '',
    reference_1_full_name: '',
    reference_1_phone_number: '',
    reference_1_address: '',
    reference_1_pincode: '',
    reference_1_city: '',
    reference_1_state: '',
    reference_1_email: '',
    reference_2_type: '',
    reference_2_full_name: '',
    reference_2_phone_number: '',
    reference_2_address: '',
    reference_2_pincode: '',
    reference_2_city: '',
    reference_2_state: '',
    reference_2_email: '',
    extra_params: {
      progress: 0,
      required_fields_status: {
        reference_1_type: false,
        reference_1_full_name: false,
        reference_1_phone_number: false,
        reference_1_address: false,
        reference_1_pincode: false,
        reference_2_type: false,
        reference_2_full_name: false,
        reference_2_phone_number: false,
        reference_2_address: false,
        reference_2_pincode: false,
      },
    },
  },

  lt_charges: [
    {
      mobile_number: '',
      status: null,
    },
  ],

  applicants: [
    {
      applicant_details: {
        applicant_type: 'Primary Applicant',
        lead_id: null,
        is_primary: true,
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: null,
        mobile_number: '',
        is_mobile_verified: false,
        bre_101_response: null,
        extra_params: {
          progress: 0,
          banking_progress: 0,
          is_existing: false,
          is_existing_done: false,
          upload_progress: 0,
          qualifier_api_progress: 0,
          upload_required_fields_status: {
            customer_photo: false,
            id_proof: false,
            address_proof: false,
            property_paper: false,
            salary_slip: false,
            form_60: false,
            property_image: false,
            upload_selfie: false,
            other_doc: false,
          },
          required_fields_status: {
            loan_type: false,
            applied_amount: true,
            first_name: false,
            date_of_birth: false,
            purpose_of_loan: false,
            property_type: false,
            mobile_number: false,
          },
          qualifier: false,
          eligibilty: false,
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
        father_husband_name: '',
        mother_name: '',
        marital_status: null,
        religion: '',
        preferred_language: '',
        qualification: '',
        email: '',
        is_email_verified: false,
        extra_params: {
          same_as_id_type: false,
          progress: 13,
          is_existing_done: false,
          required_fields_status: {
            how_would_you_like_to_proceed: false,
            id_type: false,
            id_number: false,
            selected_address_proof: false,
            address_proof_number: false,
            first_name: false,
            gender: false,
            date_of_birth: true,
            mobile_number: true,
            father_husband_name: false,
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
        permanent_type_of_residence: '',
        permanent_flat_no_building_name: '',
        permanent_street_area_locality: '',
        permanent_town: '',
        permanent_landmark: '',
        permanent_pincode: '',
        permanent_city: '',
        permanent_state: '',
        permanent_no_of_year_residing: null,
        extra_params: {
          permanent_address_same_as_current: false,
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
            permanent_flat_no_building_name: false,
            permanent_street_area_locality: false,
            permanent_town: false,
            permanent_landmark: false,
            permanent_pincode: false,
            permanent_no_of_year_residing: false,
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
    },
  ],
};
