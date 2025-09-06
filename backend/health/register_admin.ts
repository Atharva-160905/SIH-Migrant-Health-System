import { api, APIError } from "encore.dev/api";
import { healthDB } from "./db";
import bcrypt from "bcrypt";

export interface RegisterAdminRequest {
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterAdminResponse {
  user_id: number;
}

// Registers a new admin in the system.
export const registerAdmin = api<RegisterAdminRequest, RegisterAdminResponse>(
  { expose: true, method: "POST", path: "/admin/register" },
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

    // Create user
    const user = await healthDB.queryRow<{ id: number }>`
      INSERT INTO users (email, phone, role, password_hash)
      VALUES (${req.email}, ${req.phone || null}, 'admin', ${passwordHash})
      RETURNING id
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
    }

    return {
      user_id: user.id,
    };
  }
);
