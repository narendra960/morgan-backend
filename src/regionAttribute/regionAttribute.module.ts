import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { RegionAttributeController } from './regionAttribute.controller';
import { RegionAttribute } from './regionAttribute.model';
import { RegionAttributeService } from './regionAttribute.service';

@Module({
  imports: [SequelizeModule.forFeature([RegionAttribute])],
  providers: [RegionAttributeService],
  controllers: [RegionAttributeController],
  exports: [SequelizeModule],
})
export class RegionAttributeModule {}
