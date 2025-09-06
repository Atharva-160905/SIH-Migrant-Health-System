import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import { Patient } from "./types";

export interface GetPatientDetailsRequest {
  patient_id: number;
  doctor_id: number;
}

export interface GetPatientDetailsResponse {
  patient: Patient;
  has_access: boolean;
}

// Gets detailed patient information for a doctor.
export const getPatientDetails = api<GetPatientDetailsRequest, GetPatientDetailsResponse>(
  { expose: true, method: "GET", path: "/patients/:patient_id/details" },
  async ({ patient_id, doctor_id }) => {
    // Check if patient exists
    const patient = await healthDB.queryRow<Patient>`
      SELECT * FROM patients WHERE id = ${patient_id}
    `;

    if (!patient) {
      throw APIError.notFound("Patient not found");
    }

    // Check if doctor has access
    const accessRequest = await healthDB.queryRow`
      SELECT status FROM access_requests 
      WHERE patient_id = ${patient_id} 
      AND doctor_id = ${doctor_id} 
      AND status = 'approved'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;

    const hasAccess = !!accessRequest;

    return {
      patient,
      has_access: hasAccess,
    };
  }
);
