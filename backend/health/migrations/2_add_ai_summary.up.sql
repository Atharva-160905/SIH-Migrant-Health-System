ALTER TABLE medical_records 
ADD COLUMN patient_summary TEXT,
ADD COLUMN doctor_summary TEXT,
ADD COLUMN summary_generated_at TIMESTAMP;

CREATE INDEX idx_medical_records_summary ON medical_records(summary_generated_at);
