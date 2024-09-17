import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { UploadService } from 'src/upload/upload.service';

import { Image } from './image.model';
import { ImageService } from './image.service';

@Module({
  imports: [SequelizeModule.forFeature([Image])],
  providers: [ImageService],
  exports: [SequelizeModule, ImageService],
})
export class ImageModule {}
