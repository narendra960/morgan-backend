import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './type.model';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  imports: [SequelizeModule.forFeature([Type])],
  providers: [TypeService],
  controllers: [TypeController],
  exports: [SequelizeModule, TypeService],
})
export class TypeModule {}
