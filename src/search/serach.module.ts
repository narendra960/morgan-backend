import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { SearchController } from './search.controller';
import { SearchService } from './seach.service';
import { TypeModule } from 'src/type/type.module';
import { EntryModule } from 'src/entry/entry.module';
import { ZoneModule } from 'src/zone/zone.module';
import { RegionModule } from 'src/region/region.module';
import { ZoneAttributeModule } from 'src/zoneAttribute/zoneAttribute.module';
import { EntryAttributeModule } from 'src/entryAttribute/entryAttribute.module';
import { RegionAttributeModule } from 'src/regionAttribute/regionAttribute.module';

@Module({
  imports: [
    TypeModule,
    EntryModule,
    ZoneModule,
    RegionModule,
    ZoneAttributeModule,
    EntryAttributeModule,
    RegionAttributeModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
