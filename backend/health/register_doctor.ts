import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import bcrypt from "bcrypt";

export interface RegisterDoctorRequest {
  email: string;
  phone?: string;
  password: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialization?: string;
  hospital_affiliation?: string;
}

export interface RegisterDoctorResponse {
  user_id: number;
  doctor_id: number;
}

// Registers a new doctor in the system.
export const registerDoctor = api<RegisterDoctorRequest, RegisterDoctorResponse>(
  { expose: true, method: "POST", path: "/doctors/register" },
  async (req) => {
    // Check if email already exists
    const existingUser = await healthDB.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("User with this email already exists");
    }

    // Check if license number already exists
    const existingDoctor = await healthDB.queryRow`
      SELECT id FROM doctors WHERE license_number = ${req.license_number}
    `;

    if (existingDoctor) {
      throw APIError.alreadyExists("Doctor with this license number already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(req.password, 10);

    // Create user
    const user = await healthDB.queryRow<{ id: number }>`
      INSERT INTO users (email, phone, role, password_hash)
      VALUES (${req.email}, ${req.phone || null}, 'doctor', ${passwordHash})
      RETURNING id
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

    // Create doctor
    const doctor = await healthDB.queryRow<{ id: number }>`
      INSERT INTO doctors (
        user_id, first_name, last_name, license_number,
        specialization, hospital_affiliation, phone
      )
      VALUES (
        ${user.id}, ${req.first_name}, ${req.last_name}, ${req.license_number},
        ${req.specialization || null}, ${req.hospital_affiliation || null}, ${req.phone || null}
      )
      RETURNING id
    `;

    if (!doctor) {
      throw APIError.internal("Failed to create doctor");
    }

    return {
      user_id: user.id,
      doctor_id: doctor.id,
    };
  }
);
