import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('file-upload', () => {
  return {
    useS3: process.env.USE_S3 === 'true',
    uploadPath: process.env.UPLOAD_PATH,
    sensitiveUploadPath: process.env.SENSITIVE_UPLOAD_PATH,
  };
});
