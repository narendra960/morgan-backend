import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from './region.model';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { RegionTagModule } from 'src/regionTag/regionTag.module';
import { RegionTagService } from 'src/regionTag/regionTag.service';
import { RegionAttributeModule } from 'src/regionAttribute/regionAttribute.module';
import { RegionAttributeService } from 'src/regionAttribute/regionAttribute.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Region]),
    RegionTagModule,
    RegionAttributeModule,
  ],
  providers: [RegionService, RegionTagService, RegionAttributeService],
  controllers: [RegionController],
  exports: [SequelizeModule, RegionService],
})
export class RegionModule {}
