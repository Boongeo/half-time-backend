export interface UploadService {
  uploadFile(file: Express.Multer.File): Promise<string>; // 업로드된 파일 URL/경로 반환
}
