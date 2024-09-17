import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import {Dungeons } from './dungeons.model';
import { DungeonsService } from './dungeons.service';
import { Groups } from 'src/groups/groups.model';
import { DungeonTagsModule } from 'src/dungeonTags/dungeonTags.module';
import { DungeonAttributeModule } from 'src/dungeonAttribute/dungeonAttribute.module';
import { DungeonTagsService } from 'src/dungeonTags/dungeonTags.service';
import { DungeonAttributeService } from 'src/dungeonAttribute/dungeonAttribute.service';

@Module({
    imports: [SequelizeModule.forFeature([Dungeons]), DungeonTagsModule, DungeonAttributeModule],
    providers: [DungeonsService, DungeonTagsService, DungeonAttributeService],
    exports: [SequelizeModule, DungeonsService]
})
export class DungeonsModule {}