import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './tag.model';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [SequelizeModule.forFeature([Tag])],
  providers: [TagService],
  controllers: [TagController],
  exports: [SequelizeModule],
})
export class TagModule {}
