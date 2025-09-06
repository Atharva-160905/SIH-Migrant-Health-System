import { api, APIError } from "encore.dev/api";
import { medicalFilesBucket } from "./files";

export interface UploadFileRequest {
  file_name: string;
  content_type: string;
}

export interface UploadFileResponse {
  upload_url: string;
  file_url: string;
}

// Generates a signed upload URL for medical files.
export const uploadFile = api<UploadFileRequest, UploadFileResponse>(
  { expose: true, method: "POST", path: "/storage/upload-url" },
  async (req) => {
    const fileName = `${Date.now()}-${req.file_name}`;
    
    try {
      const { url: uploadUrl } = await medicalFilesBucket.signedUploadUrl(fileName, {
        ttl: 3600, // 1 hour
      });

      const { url: downloadUrl } = await medicalFilesBucket.signedDownloadUrl(fileName, {
        ttl: 365 * 24 * 3600, // 1 year
      });

      return {
        upload_url: uploadUrl,
        file_url: downloadUrl,
      };
    } catch (error) {
      throw APIError.internal("Failed to generate upload URL");
    }
  }
);
