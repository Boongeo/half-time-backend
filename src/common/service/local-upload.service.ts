import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from '../interfaces/upload.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalUploadService implements UploadService {
  private uploadPath: string;

  constructor(private readonly configService: ConfigService) {
    const relativePath = this.configService.get<string>(
      'file-upload.uploadPath',
    ); // 기본 경로 추가
    this.uploadPath = path.resolve(process.cwd(), relativePath); // 프로젝트 루트 기준 설정

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuid()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer); // 파일 저장
      return filePath; // 저장된 파일 경로 반환
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload file to disk',
        error.stack,
      );
    }
  }
}
