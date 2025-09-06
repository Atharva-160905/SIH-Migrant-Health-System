import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import { Patient } from "./types";

export interface SearchPatientRequest {
  medical_id: string;
}

export interface SearchPatientResponse {
  patient: {
    id: number;
    medical_id: string;
    first_name: string;
    last_name: string;
    date_of_birth?: Date;
    gender?: string;
  };
}

// Searches for a patient by their medical ID.
export const searchPatient = api<SearchPatientRequest, SearchPatientResponse>(
  { expose: true, method: "GET", path: "/patients/search/:medical_id" },
  async ({ medical_id }) => {
    const patient = await healthDB.queryRow<Patient>`
      SELECT * FROM patients WHERE medical_id = ${medical_id}
    `;

    if (!patient) {
      throw APIError.notFound("Patient not found");
    }

    return {
      patient: {
        id: patient.id,
        medical_id: patient.medical_id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
      },
    };
  }
);
