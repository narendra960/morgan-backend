import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { EntryTag } from './entryTag.model';
import { EntryTagService } from './entryTag.service';

@Module({
  imports: [SequelizeModule.forFeature([EntryTag])],
  providers: [EntryTagService],
  exports: [SequelizeModule],
})
export class EntryTagModule {}
