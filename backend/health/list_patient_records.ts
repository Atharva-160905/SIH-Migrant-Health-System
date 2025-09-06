import { api } from "encore.dev/api";
import { healthDB } from "./db";
import { Patient } from "./types";

export interface ListPatientRecordsRequest {
  doctor_id: number;
}

export interface PatientWithAccess extends Patient {
  access_granted_at: Date;
  access_expires_at?: Date;
}

export interface ListPatientRecordsResponse {
  patients: PatientWithAccess[];
}

// Lists all patients who have granted access to a doctor.
export const listPatientRecords = api<ListPatientRecordsRequest, ListPatientRecordsResponse>(
  { expose: true, method: "GET", path: "/doctors/:doctor_id/patients" },
  async ({ doctor_id }) => {
    const patients = await healthDB.queryAll<PatientWithAccess>`
      SELECT 
        p.*,
        ar.responded_at as access_granted_at,
        ar.expires_at as access_expires_at
      FROM patients p
      JOIN access_requests ar ON p.id = ar.patient_id
      WHERE ar.doctor_id = ${doctor_id} 
      AND ar.status = 'approved'
      AND (ar.expires_at IS NULL OR ar.expires_at > CURRENT_TIMESTAMP)
      ORDER BY ar.responded_at DESC
    `;

    return { patients };
  }
);
