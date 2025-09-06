import { api } from "encore.dev/api";
import { healthDB } from "./db";
import { AlertWithNames } from "./types";

export interface ListAlertsResponse {
  alerts: AlertWithNames[];
}

// Lists all alerts for admin review.
export const listAlerts = api<void, ListAlertsResponse>(
  { expose: true, method: "GET", path: "/alerts" },
  async () => {
    const alerts = await healthDB.queryAll<AlertWithNames>`
      SELECT 
        a.*,
        d.first_name || ' ' || d.last_name as doctor_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM alerts a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id
      ORDER BY 
        CASE a.severity
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        a.created_at DESC
    `;

    return { alerts };
  }
);
