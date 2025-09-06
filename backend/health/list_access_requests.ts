import { api } from "encore.dev/api";
import { healthDB } from "./db";
import { AccessRequestWithNames } from "./types";

export interface ListAccessRequestsRequest {
  patient_id: number;
}

export interface ListAccessRequestsResponse {
  requests: AccessRequestWithNames[];
}

// Lists access requests for a patient.
export const listAccessRequests = api<ListAccessRequestsRequest, ListAccessRequestsResponse>(
  { expose: true, method: "GET", path: "/patients/:patient_id/access-requests" },
  async ({ patient_id }) => {
    const requests = await healthDB.queryAll<AccessRequestWithNames>`
      SELECT 
        ar.*,
        d.first_name || ' ' || d.last_name as doctor_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM access_requests ar
      JOIN doctors d ON ar.doctor_id = d.id
      JOIN patients p ON ar.patient_id = p.id
      WHERE ar.patient_id = ${patient_id}
      ORDER BY ar.requested_at DESC
    `;

    return { requests };
  }
);
