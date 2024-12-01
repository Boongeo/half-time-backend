import { UploadService } from '../interfaces/upload.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class AwsUploadService implements UploadService {
  async: any;
  updateFile(profileImage: Express.Multer.File, profileImage2: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  uploadFile(file: Express.Multer.File): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
