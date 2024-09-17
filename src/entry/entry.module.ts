import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Entry } from './entry.model';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { EntryTagModule } from 'src/entryTag/entryTag.module';
import { EntryTagService } from 'src/entryTag/entryTag.service';
import { EntryAttributeModule } from 'src/entryAttribute/entryAttribute.module';
import { EntryAttributeService } from 'src/entryAttribute/entryAttribute.service';
import { TagService } from 'src/tag/tag.service';
import { AttributeService } from 'src/attribute/attribute.service';
import { TagModule } from 'src/tag/tag.module';
import { AttributeModule } from 'src/attribute/attribute.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Entry]),
    EntryTagModule,
    EntryAttributeModule,
    TagModule,
    AttributeModule,
  ],
  providers: [
    EntryService,
    EntryTagService,
    EntryAttributeService,
    TagService,
    AttributeService,
  ],
  controllers: [EntryController],
  exports: [SequelizeModule, EntryService],
})
export class EntryModule {}
