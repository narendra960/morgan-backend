import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zone } from './zone.model';
import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { ZoneTagService } from 'src/zoneTag/zoneTag.service';
import { ZoneTagModule } from 'src/zoneTag/zoneTag.module';
import { ZoneAttributeService } from 'src/zoneAttribute/zoneAttribute.service';
import { ZoneAttributeController } from 'src/zoneAttribute/zoneAttribute.controller';
import { ZoneAttributeModule } from 'src/zoneAttribute/zoneAttribute.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Zone]),
    ZoneTagModule,
    ZoneAttributeModule,
  ],
  providers: [ZoneService, ZoneTagService, ZoneAttributeService],
  controllers: [ZoneController],
  exports: [SequelizeModule, ZoneService],
})
export class ZoneModule {}
