import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from '../interfaces/upload.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalUploadService implements UploadService {
  private readonly uploadPath: string;
  private readonly relativeUploadPath: string;

  constructor(private readonly configService: ConfigService) {
    this.relativeUploadPath = this.configService.get<string>(
      'file-upload.uploadPath',
    ); // 상대경로
    this.uploadPath = path.resolve(this.relativeUploadPath);

    console.log('Absolute uploadPath:', this.uploadPath);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log('relativeUploadPath:', this.relativeUploadPath);
    console.log('Absolute uploadPath:', this.uploadPath);

    // 한글 파일 이름 처리 (UUID로 변경 또는 URL-safe 방식)
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const fileName = `${uuid()}-${sanitizedFileName}`;
    const absoluteFilePath = path.join(this.uploadPath, fileName);
    const relativeFilePath = path.join(this.relativeUploadPath, fileName);

    try {
      fs.writeFileSync(absoluteFilePath, file.buffer); // 파일 저장
      return relativeFilePath; // 상대 경로 반환
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload file to disk',
        error.stack,
      );
    }
  }

  private sanitizeFileName(filename: string): string {
    return filename.replace(/[^\w.\-가-힣]/g, '_').normalize('NFC');
  }
}
