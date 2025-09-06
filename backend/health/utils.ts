import crypto from 'crypto';

export function generateMedicalId(): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString('hex');
  return `MID${timestamp.slice(-6)}${random.toUpperCase()}`;
}

export function generateQRCode(medicalId: string): string {
  // In a real implementation, this would generate an actual QR code
  // For now, we'll return a placeholder URL
  return `https://health-system.com/qr/${medicalId}`;
}
