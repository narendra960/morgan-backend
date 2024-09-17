import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { RegionTag } from './regionTag.model';
import { RegionTagService } from './regionTag.service';

@Module({
  imports: [SequelizeModule.forFeature([RegionTag])],
  providers: [RegionTagService],
  exports: [SequelizeModule],
})
export class RegionTagModule {}
