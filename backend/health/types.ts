export interface User {
  id: number;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Patient {
  id: number;
  user_id: number;
  medical_id: string;
  qr_code: string;
  first_name: string;
  last_name: string;
  date_of_birth?: Date;
  gender?: string;
  blood_type?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  allergies?: string;
  medical_conditions?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Doctor {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  license_number: string;
  specialization?: string;
  hospital_affiliation?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AccessRequest {
  id: number;
  patient_id: number;
  doctor_id: number;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  requested_at: Date;
  responded_at?: Date;
  expires_at?: Date;
}

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id?: number;
  title: string;
  description?: string;
  record_type: 'prescription' | 'lab_result' | 'diagnosis' | 'treatment' | 'vaccination' | 'other';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Alert {
  id: number;
  doctor_id: number;
  patient_id: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PatientWithDoctor extends Patient {
  doctor_name?: string;
}

export interface MedicalRecordWithDoctor extends MedicalRecord {
  doctor_name?: string;
}

export interface AccessRequestWithNames extends AccessRequest {
  patient_name: string;
  doctor_name: string;
}

export interface AlertWithNames extends Alert {
  patient_name: string;
  doctor_name: string;
}
