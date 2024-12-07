export interface UploadService {
  uploadFile(file: Express.Multer.File): Promise<string>;

  uploadSensitiveFile(file: Express.Multer.File): Promise<string>;

  updateFile(
    profileImage: Express.Multer.File,
    existingFilePath: string,
  ): Promise<string>;
}
