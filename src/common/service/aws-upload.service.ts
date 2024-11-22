import { UploadService } from '../interfaces/upload.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class AwsUploadService implements UploadService {
  uploadFile(file: Express.Multer.File): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
