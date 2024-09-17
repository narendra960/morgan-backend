import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { memoryStorage } from 'multer';
import { Image } from 'src/image/image.model';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage()
    }),
    SequelizeModule.forFeature([Image])
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
