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
    this.uploadPath = path.resolve(this.relativeUploadPath); // 절대경로로 변환

    console.log('Absolute uploadPath:', this.uploadPath);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }


  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log('relativeUploadPath:', this.relativeUploadPath);
    console.log('Absolute uploadPath:', this.uploadPath);
    const fileName = `${uuid()}-${file.originalname}`;
    const absoluteFilePath = path.join(this.uploadPath, fileName); // 절대 경로로 파일 저장
    const relativeFilePath = path.join(this.relativeUploadPath, fileName); // 상대 경로 생성

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
}
