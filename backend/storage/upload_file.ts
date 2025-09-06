import { api, APIError } from "encore.dev/api";
import { medicalFilesBucket } from "./files";
import crypto from 'crypto';

export interface UploadFileRequest {
  file_name: string;
  content_type: string;
}

export interface UploadFileResponse {
  upload_url: string;
  file_url: string;
  file_path: string;
}

// Generates a signed upload URL for medical files.
export const uploadFile = api<UploadFileRequest, UploadFileResponse>(
  { expose: true, method: "POST", path: "/storage/upload-url" },
  async (req) => {
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png'
      ];
      
      if (!allowedTypes.includes(req.content_type)) {
        throw APIError.invalidArgument("File type not allowed. Only PDF, JPG, JPEG, and PNG files are supported.");
      }

      // Generate unique file name with timestamp and random string
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const fileExtension = getFileExtension(req.file_name);
      const uniqueFileName = `${timestamp}-${randomString}-${sanitizeFileName(req.file_name)}`;
      
      // Generate signed upload URL
      const { url: uploadUrl } = await medicalFilesBucket.signedUploadUrl(uniqueFileName, {
        ttl: 3600, // 1 hour
      });

      // Generate a long-lived download URL for storing in database
      const { url: downloadUrl } = await medicalFilesBucket.signedDownloadUrl(uniqueFileName, {
        ttl: 365 * 24 * 3600, // 1 year
      });

      return {
        upload_url: uploadUrl,
        file_url: downloadUrl,
        file_path: uniqueFileName,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error('Upload URL generation error:', error);
      throw APIError.internal("Failed to generate upload URL");
    }
  }
);

function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot !== -1 ? fileName.substring(lastDot) : '';
}

function sanitizeFileName(fileName: string): string {
  // Remove or replace invalid characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100); // Limit length
}
