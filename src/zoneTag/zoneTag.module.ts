import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneTag } from './zoneTag.model';
import { ZoneTagService } from './zoneTag.service';

@Module({
  imports: [SequelizeModule.forFeature([ZoneTag])],
  providers: [ZoneTagService],
  exports: [SequelizeModule, ZoneTagService],
})
export class ZoneTagModule {}
