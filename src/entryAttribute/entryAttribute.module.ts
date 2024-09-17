import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { EntryAttributeController } from './entryAttribute.controller';
import { EntryAttribute } from './entryAttribute.model';
import { EntryAttributeService } from './entryAttribute.service';

@Module({
  imports: [SequelizeModule.forFeature([EntryAttribute])],
  providers: [EntryAttributeService],
  controllers: [EntryAttributeController],
  exports: [SequelizeModule],
})
export class EntryAttributeModule {}
