import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import bcrypt from "bcrypt";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  profile?: {
    id: number;
    first_name?: string;
    last_name?: string;
    medical_id?: string;
    license_number?: string;
  };
}

// Authenticates a user and returns their profile information.
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    // Get user by email
    const user = await healthDB.queryRow<{
      id: number;
      email: string;
      role: string;
      password_hash: string;
    }>`
      SELECT id, email, role, password_hash FROM users WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(req.password, user.password_hash);
    if (!isValidPassword) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    let profile = undefined;

    // Get role-specific profile
    if (user.role === 'patient') {
      profile = await healthDB.queryRow<{
        id: number;
        first_name: string;
        last_name: string;
        medical_id: string;
      }>`
        SELECT id, first_name, last_name, medical_id 
        FROM patients WHERE user_id = ${user.id}
      `;
    } else if (user.role === 'doctor') {
      profile = await healthDB.queryRow<{
        id: number;
        first_name: string;
        last_name: string;
        license_number: string;
      }>`
        SELECT id, first_name, last_name, license_number 
        FROM doctors WHERE user_id = ${user.id}
      `;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile,
    };
  }
);
