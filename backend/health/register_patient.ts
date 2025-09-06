import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import { generateMedicalId, generateQRCode } from "./utils";
import bcrypt from "bcrypt";

export interface RegisterPatientRequest {
  email: string;
  phone?: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  allergies?: string;
  medical_conditions?: string;
}

export interface RegisterPatientResponse {
  user_id: number;
  patient_id: number;
  medical_id: string;
  qr_code: string;
}

// Registers a new patient in the system.
export const registerPatient = api<RegisterPatientRequest, RegisterPatientResponse>(
  { expose: true, method: "POST", path: "/patients/register" },
  async (req) => {
    // Check if email already exists
    const existingUser = await healthDB.queryRow`
      SELECT id FROM users WHERE email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(req.password, 10);

    // Generate unique medical ID and QR code
    const medicalId = generateMedicalId();
    const qrCode = generateQRCode(medicalId);

    // Create user
    const user = await healthDB.queryRow<{ id: number }>`
      INSERT INTO users (email, phone, role, password_hash)
      VALUES (${req.email}, ${req.phone || null}, 'patient', ${passwordHash})
      RETURNING id
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

    // Create patient
    const patient = await healthDB.queryRow<{ id: number }>`
      INSERT INTO patients (
        user_id, medical_id, qr_code, first_name, last_name,
        date_of_birth, gender, blood_type, emergency_contact_name,
        emergency_contact_phone, address, allergies, medical_conditions
      )
      VALUES (
        ${user.id}, ${medicalId}, ${qrCode}, ${req.first_name}, ${req.last_name},
        ${req.date_of_birth || null}, ${req.gender || null}, ${req.blood_type || null},
        ${req.emergency_contact_name || null}, ${req.emergency_contact_phone || null},
        ${req.address || null}, ${req.allergies || null}, ${req.medical_conditions || null}
      )
      RETURNING id
    `;

    if (!patient) {
      throw APIError.internal("Failed to create patient");
    }

    return {
      user_id: user.id,
      patient_id: patient.id,
      medical_id: medicalId,
      qr_code: qrCode,
    };
  }
);
