import { api } from "encore.dev/api";
import { healthDB } from "./db";

export interface MedicalRecordWithDoctor {
  id: number;
  patient_id: number;
  doctor_id?: number;
  title: string;
  description?: string;
  record_type: 'prescription' | 'lab_result' | 'diagnosis' | 'treatment' | 'vaccination' | 'other';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  patient_summary?: string;
  doctor_summary?: string;
  summary_generated_at?: Date;
  created_at: Date;
  updated_at: Date;
  doctor_name?: string;
}

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
