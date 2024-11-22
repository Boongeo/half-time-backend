import { Module } from '@nestjs/common';
import { LocalUploadService } from './service/local-upload.service';

@Module({
  providers: [
    {
      provide: 'UploadService',
      useClass: LocalUploadService,
    },
  ],
  exports: ['UploadService'],
})
export class CommonModule {}
