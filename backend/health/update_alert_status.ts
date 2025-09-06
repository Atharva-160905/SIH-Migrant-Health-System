import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface UpdateAlertStatusRequest {
  alert_id: number;
  status: 'open' | 'in_progress' | 'resolved';
  admin_notes?: string;
}

export interface UpdateAlertStatusResponse {
  success: boolean;
}

// Updates the status of an alert.
export const updateAlertStatus = api<UpdateAlertStatusRequest, UpdateAlertStatusResponse>(
  { expose: true, method: "POST", path: "/alerts/:alert_id/status" },
  async (req) => {
    // Check if alert exists
    const alert = await healthDB.queryRow`
      SELECT id FROM alerts WHERE id = ${req.alert_id}
    `;

    if (!alert) {
      throw APIError.notFound("Alert not found");
    }

    // Update alert status
    await healthDB.exec`
      UPDATE alerts 
      SET status = ${req.status}, admin_notes = ${req.admin_notes || null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.alert_id}
    `;

    return { success: true };
  }
);
