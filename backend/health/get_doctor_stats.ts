import { api } from "encore.dev/api";
import { healthDB } from "./db";

export interface GetDoctorStatsRequest {
  doctor_id: number;
}

export interface DoctorStats {
  total_patients: number;
  total_records_added: number;
  total_alerts_raised: number;
  recent_activity: RecentActivity[];
}

export interface RecentActivity {
  type: 'record_added' | 'alert_raised' | 'access_granted';
  description: string;
  date: Date;
  patient_name?: string;
}

export interface GetDoctorStatsResponse {
  stats: DoctorStats;
}

// Gets statistics and recent activity for a doctor.
export const getDoctorStats = api<GetDoctorStatsRequest, GetDoctorStatsResponse>(
  { expose: true, method: "GET", path: "/doctors/:doctor_id/stats" },
  async ({ doctor_id }) => {
    // Get total patients with access
    const patientsResult = await healthDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM access_requests ar
      WHERE ar.doctor_id = ${doctor_id} 
      AND ar.status = 'approved'
      AND (ar.expires_at IS NULL OR ar.expires_at > CURRENT_TIMESTAMP)
    `;

    // Get total records added by this doctor
    const recordsResult = await healthDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM medical_records mr
      WHERE mr.doctor_id = ${doctor_id}
    `;

    // Get total alerts raised by this doctor
    const alertsResult = await healthDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM alerts a
      WHERE a.doctor_id = ${doctor_id}
    `;

    // Get recent activity
    const recentRecords = await healthDB.queryAll<{
      type: string;
      description: string;
      date: Date;
      patient_name: string;
    }>`
      SELECT 
        'record_added' as type,
        mr.title as description,
        mr.created_at as date,
        p.first_name || ' ' || p.last_name as patient_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      WHERE mr.doctor_id = ${doctor_id}
      ORDER BY mr.created_at DESC
      LIMIT 5
    `;

    const recentAlerts = await healthDB.queryAll<{
      type: string;
      description: string;
      date: Date;
      patient_name: string;
    }>`
      SELECT 
        'alert_raised' as type,
        a.title as description,
        a.created_at as date,
        p.first_name || ' ' || p.last_name as patient_name
      FROM alerts a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ${doctor_id}
      ORDER BY a.created_at DESC
      LIMIT 3
    `;

    const recentAccess = await healthDB.queryAll<{
      type: string;
      description: string;
      date: Date;
      patient_name: string;
    }>`
      SELECT 
        'access_granted' as type,
        'Access granted' as description,
        ar.responded_at as date,
        p.first_name || ' ' || p.last_name as patient_name
      FROM access_requests ar
      JOIN patients p ON ar.patient_id = p.id
      WHERE ar.doctor_id = ${doctor_id} AND ar.status = 'approved'
      ORDER BY ar.responded_at DESC
      LIMIT 3
    `;

    // Combine and sort recent activity
    const allActivity = [...recentRecords, ...recentAlerts, ...recentAccess]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const stats: DoctorStats = {
      total_patients: patientsResult?.count || 0,
      total_records_added: recordsResult?.count || 0,
      total_alerts_raised: alertsResult?.count || 0,
      recent_activity: allActivity.map(activity => ({
        type: activity.type as 'record_added' | 'alert_raised' | 'access_granted',
        description: activity.description,
        date: activity.date,
        patient_name: activity.patient_name,
      })),
    };

    return { stats };
  }
);
