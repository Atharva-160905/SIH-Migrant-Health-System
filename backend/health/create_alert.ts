import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface CreateAlertRequest {
  doctor_id: number;
  patient_id: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
}

export interface CreateAlertResponse {
  alert_id: number;
}

// Creates a new alert from a doctor to admin.
export const createAlert = api<CreateAlertRequest, CreateAlertResponse>(
  { expose: true, method: "POST", path: "/alerts" },
  async (req) => {
    // Check if doctor has access to patient
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

    // Create alert
    const alert = await healthDB.queryRow<{ id: number }>`
      INSERT INTO alerts (doctor_id, patient_id, severity, title, description)
      VALUES (${req.doctor_id}, ${req.patient_id}, ${req.severity}, ${req.title}, ${req.description})
      RETURNING id
    `;

    if (!alert) {
      throw APIError.internal("Failed to create alert");
    }

    return {
      alert_id: alert.id,
    };
  }
);
