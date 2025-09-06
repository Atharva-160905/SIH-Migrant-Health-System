import { api, APIError } from "encore.dev/api";
import { medicalFilesBucket } from "./files";

export interface DownloadFileRequest {
  file_path: string;
}

export interface DownloadFileResponse {
  download_url: string;
}

// Generates a signed download URL for medical files.
export const downloadFile = api<DownloadFileRequest, DownloadFileResponse>(
  { expose: true, method: "GET", path: "/storage/download/:file_path" },
  async ({ file_path }) => {
    try {
      const exists = await medicalFilesBucket.exists(file_path);
      if (!exists) {
        throw APIError.notFound("File not found");
      }

      const { url } = await medicalFilesBucket.signedDownloadUrl(file_path, {
        ttl: 3600, // 1 hour
      });

      return {
        download_url: url,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Failed to generate download URL");
    }
  }
);
