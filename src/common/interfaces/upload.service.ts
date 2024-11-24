export interface UploadService {
  uploadFile(file: Express.Multer.File): Promise<string>;

  async;

  updateFile(
    profileImage: Express.Multer.File,
    existingFilePath: string,
  ): Promise<string>;
}
