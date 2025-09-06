import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";

export interface RespondAccessRequestRequest {
  request_id: number;
  status: 'approved' | 'denied';
}

export interface RespondAccessRequestResponse {
  success: boolean;
}

// Responds to an access request (approve or deny).
export const respondAccessRequest = api<RespondAccessRequestRequest, RespondAccessRequestResponse>(
  { expose: true, method: "POST", path: "/access/respond" },
  async (req) => {
    // Check if request exists and is pending
    const accessRequest = await healthDB.queryRow`
      SELECT id, status FROM access_requests WHERE id = ${req.request_id}
    `;

    if (!accessRequest) {
      throw APIError.notFound("Access request not found");
    }

    if (accessRequest.status !== 'pending') {
      throw APIError.failedPrecondition("Access request has already been responded to");
    }

    // Update request status
    await healthDB.exec`
      UPDATE access_requests 
      SET status = ${req.status}, responded_at = CURRENT_TIMESTAMP
      WHERE id = ${req.request_id}
    `;

    return { success: true };
  }
);
