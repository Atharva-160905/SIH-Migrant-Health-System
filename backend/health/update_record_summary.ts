import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface UpdateRecordSummaryRequest {
  record_id: number;
  patient_summary?: string;
  doctor_summary?: string;
}

export interface UpdateRecordSummaryResponse {
  success: boolean;
}

// Updates AI-generated summaries for a medical record.
export const updateRecordSummary = api<UpdateRecordSummaryRequest, UpdateRecordSummaryResponse>(
  { expose: true, method: "POST", path: "/medical-records/:record_id/summary" },
  async (req) => {
    // Check if record exists
    const record = await healthDB.queryRow`
      SELECT id FROM medical_records WHERE id = ${req.record_id}
    `;

    if (!record) {
      throw APIError.notFound("Medical record not found");
    }

    // Update summaries
    await healthDB.exec`
      UPDATE medical_records 
      SET 
        patient_summary = ${req.patient_summary || null},
        doctor_summary = ${req.doctor_summary || null},
        summary_generated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.record_id}
    `;

    return { success: true };
  }
);
