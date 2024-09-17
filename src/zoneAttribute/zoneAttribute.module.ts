import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZoneAttributeController } from './zoneAttribute.controller';
import { ZoneAttribute } from './zoneAttribute.model';
import { ZoneAttributeService } from './zoneAttribute.service';

@Module({
  imports: [SequelizeModule.forFeature([ZoneAttribute])],
  providers: [ZoneAttributeService],
  controllers: [ZoneAttributeController],
  exports: [SequelizeModule],
})
export class ZoneAttributeModule {}
