import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import { medicalFilesBucket } from "../storage/files";

export interface DeleteMedicalRecordRequest {
  record_id: number;
  user_id: number;
  user_role: 'patient' | 'doctor';
}

export interface DeleteMedicalRecordResponse {
  success: boolean;
}

// Deletes a medical record and its associated file.
export const deleteMedicalRecord = api<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>(
  { expose: true, method: "DELETE", path: "/medical-records/:record_id" },
  async (req) => {
    // First, get the record to check permissions and file info
    const record = await healthDB.queryRow<{
      id: number;
      patient_id: number;
      doctor_id?: number;
      file_url?: string;
    }>`
      SELECT id, patient_id, doctor_id, file_url 
      FROM medical_records 
      WHERE id = ${req.record_id}
    `;

    if (!record) {
      throw APIError.notFound("Medical record not found");
    }

    // Check permissions
    if (req.user_role === 'patient') {
      // Patients can only delete their own records
      if (record.patient_id !== req.user_id) {
        throw APIError.permissionDenied("You can only delete your own medical records");
      }
    } else if (req.user_role === 'doctor') {
      // Doctors can only delete records they created
      if (record.doctor_id !== req.user_id) {
        throw APIError.permissionDenied("You can only delete medical records you created");
      }
    } else {
      throw APIError.permissionDenied("Invalid user role");
    }

    // Delete the file from storage if it exists
    if (record.file_url) {
      try {
        await medicalFilesBucket.remove(record.file_url);
      } catch (error) {
        console.warn(`Failed to delete file ${record.file_url}:`, error);
        // Continue with record deletion even if file deletion fails
      }
    }

    // Delete the record from database
    await healthDB.exec`
      DELETE FROM medical_records WHERE id = ${req.record_id}
    `;

    return { success: true };
  }
);
