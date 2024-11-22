import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { UploadService } from '../interfaces/upload.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalUploadService implements UploadService {
  private readonly uploadPath: string;
  private readonly relativeUploadPath: string;

  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.relativeUploadPath = this.configService.get<string>(
      'file-upload.uploadPath',
    );
    this.uploadPath = path.resolve(this.relativeUploadPath);
    console.log('Absolute uploadPath:', this.uploadPath);

    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    this.logger.debug('Original filename:', file.originalname);

    try {
      const fileExtension = path.extname(file.originalname);

      const nameWithoutExt = path.basename(file.originalname, fileExtension);
      const normalizedName = this.normalizeFileName(nameWithoutExt);

      const fileName = `${uuid()}_${normalizedName}${fileExtension}`;

      const absoluteFilePath = path.join(this.uploadPath, fileName);
      const relativeFilePath = path.join(this.relativeUploadPath, fileName);

      this.logger.debug('Saving file:', {
        originalName: file.originalname,
        normalizedName: fileName,
        absolutePath: absoluteFilePath,
        relativePath: relativeFilePath,
      });

      await fs.promises.writeFile(absoluteFilePath, file.buffer);

      return relativeFilePath;
    } catch (error) {
      console.error('File upload error:', error);
      throw new InternalServerErrorException(
        '파일 업로드 중 오류가 발생했습니다.',
        error.stack,
      );
    }
  }

  private normalizeFileName(filename: string): string {
    let normalized = filename
      .normalize('NFD')
      .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ.\-]/g, '')
      .replace(/\s+/g, '_')
      .normalize('NFC')
      .slice(0, 200);

    if (!normalized) {
      normalized = 'unnamed_file';
    }

    return normalized;
  }
}
