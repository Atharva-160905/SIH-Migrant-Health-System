import { api } from "encore.dev/api";
import { healthDB } from "./db";
import { MedicalRecordWithDoctor } from "./types";

export interface ListMedicalRecordsRequest {
  patient_id: number;
}

export interface ListMedicalRecordsResponse {
  records: MedicalRecordWithDoctor[];
}

// Lists medical records for a patient.
export const listMedicalRecords = api<ListMedicalRecordsRequest, ListMedicalRecordsResponse>(
  { expose: true, method: "GET", path: "/patients/:patient_id/medical-records" },
  async ({ patient_id }) => {
    const records = await healthDB.queryAll<MedicalRecordWithDoctor>`
      SELECT 
        mr.*,
        d.first_name || ' ' || d.last_name as doctor_name
      FROM medical_records mr
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.patient_id = ${patient_id}
      ORDER BY mr.created_at DESC
    `;

    return { records };
  }
);
