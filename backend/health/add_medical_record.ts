import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface AddMedicalRecordRequest {
  patient_id: number;
  doctor_id?: number;
  title: string;
  description?: string;
  record_type: 'prescription' | 'lab_result' | 'diagnosis' | 'treatment' | 'vaccination' | 'other';
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

export interface AddMedicalRecordResponse {
  record_id: number;
}

// Adds a new medical record for a patient.
export const addMedicalRecord = api<AddMedicalRecordRequest, AddMedicalRecordResponse>(
  { expose: true, method: "POST", path: "/medical-records" },
  async (req) => {
    // If doctor is specified, check if they have access
    if (req.doctor_id) {
      const accessRequest = await healthDB.queryRow`
        SELECT status FROM access_requests 
        WHERE patient_id = ${req.patient_id} 
        AND doctor_id = ${req.doctor_id} 
        AND status = 'approved'
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      `;

      if (!accessRequest) {
        throw APIError.permissionDenied("Doctor does not have access to this patient");
      }
    }

    // Create medical record
    const record = await healthDB.queryRow<{ id: number }>`
      INSERT INTO medical_records (
        patient_id, doctor_id, title, description, record_type,
        file_url, file_name, file_size
      )
      VALUES (
        ${req.patient_id}, ${req.doctor_id || null}, ${req.title}, ${req.description || null},
        ${req.record_type}, ${req.file_url || null}, ${req.file_name || null}, ${req.file_size || null}
      )
      RETURNING id
    `;

    if (!record) {
      throw APIError.internal("Failed to create medical record");
    }

    return {
      record_id: record.id,
    };
  }
);
