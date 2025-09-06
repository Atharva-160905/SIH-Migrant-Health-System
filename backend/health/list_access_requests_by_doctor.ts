import { api } from "encore.dev/api";
import { healthDB } from "./db";
import { AccessRequestWithNames } from "./types";

export interface ListAccessRequestsByDoctorRequest {
  doctor_id: number;
}

export interface ListAccessRequestsByDoctorResponse {
  requests: AccessRequestWithNames[];
}

// Lists all access requests made by a doctor.
export const listAccessRequestsByDoctor = api<ListAccessRequestsByDoctorRequest, ListAccessRequestsByDoctorResponse>(
  { expose: true, method: "GET", path: "/doctors/:doctor_id/access-requests" },
  async ({ doctor_id }) => {
    const requests = await healthDB.queryAll<AccessRequestWithNames>`
      SELECT 
        ar.*,
        d.first_name || ' ' || d.last_name as doctor_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM access_requests ar
      JOIN doctors d ON ar.doctor_id = d.id
      JOIN patients p ON ar.patient_id = p.id
      WHERE ar.doctor_id = ${doctor_id}
      ORDER BY ar.requested_at DESC
    `;

    return { requests };
  }
);
