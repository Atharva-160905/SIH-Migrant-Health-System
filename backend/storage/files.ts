import { Bucket } from "encore.dev/storage/objects";

export const medicalFilesBucket = new Bucket("medical-files", {
  public: false,
  versioned: true,
});
