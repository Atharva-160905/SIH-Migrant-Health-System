import { api, APIError } from "encore.dev/api";
import { medicalFilesBucket } from "./files";

export interface DownloadFileRequest {
  file_path: string;
}

export interface DownloadFileResponse {
  download_url: string;
  file_name: string;
  expires_at: Date;
}

// Generates a signed download URL for medical files.
export const downloadFile = api<DownloadFileRequest, DownloadFileResponse>(
  { expose: true, method: "GET", path: "/storage/download/:file_path" },
  async ({ file_path }) => {
    try {
      // Check if file exists
      const exists = await medicalFilesBucket.exists(file_path);
      if (!exists) {
        throw APIError.notFound("File not found");
      }

      // Get file attributes
      const attrs = await medicalFilesBucket.attrs(file_path);

      // Generate signed download URL with 1 hour expiration
      const { url } = await medicalFilesBucket.signedDownloadUrl(file_path, {
        ttl: 3600, // 1 hour
      });

      // Calculate expiration time
      const expiresAt = new Date(Date.now() + 3600 * 1000);

      return {
        download_url: url,
        file_name: attrs.name,
        expires_at: expiresAt,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error('Download URL generation error:', error);
      throw APIError.internal("Failed to generate download URL");
    }
  }
);
