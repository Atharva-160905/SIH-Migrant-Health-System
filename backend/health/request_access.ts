import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface RequestAccessRequest {
  patient_id: number;
  doctor_id: number;
  reason?: string;
}

export interface RequestAccessResponse {
  request_id: number;
}

// Creates an access request from a doctor to a patient.
export const requestAccess = api<RequestAccessRequest, RequestAccessResponse>(
  { expose: true, method: "POST", path: "/access/request" },
  async (req) => {
    // Check if patient exists
    const patient = await healthDB.queryRow`
      SELECT id FROM patients WHERE id = ${req.patient_id}
    `;

    if (!patient) {
      throw APIError.notFound("Patient not found");
    }

    // Check if doctor exists
    const doctor = await healthDB.queryRow`
      SELECT id FROM doctors WHERE id = ${req.doctor_id}
    `;

    if (!doctor) {
      throw APIError.notFound("Doctor not found");
    }

    // Check if there's already a pending request
    const existingRequest = await healthDB.queryRow`
      SELECT id FROM access_requests 
      WHERE patient_id = ${req.patient_id} 
      AND doctor_id = ${req.doctor_id} 
      AND status = 'pending'
    `;

    if (existingRequest) {
      throw APIError.alreadyExists("Access request already pending");
    }

    // Create access request
    const accessRequest = await healthDB.queryRow<{ id: number }>`
      INSERT INTO access_requests (patient_id, doctor_id, reason, expires_at)
      VALUES (${req.patient_id}, ${req.doctor_id}, ${req.reason || null}, ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
      RETURNING id
    `;

    if (!accessRequest) {
      throw APIError.internal("Failed to create access request");
    }

    return {
      request_id: accessRequest.id,
    };
  }
);
