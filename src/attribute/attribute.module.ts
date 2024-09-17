import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attribute } from './attribute.model';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';

@Module({
  imports: [SequelizeModule.forFeature([Attribute])],
  providers: [AttributeService],
  controllers: [AttributeController],
  exports: [SequelizeModule],
})
export class AttributeModule {}
