import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { DungeonTags } from './dungeonTags.model';
import { DungeonTagsService } from './dungeonTags.service';

@Module({
    imports: [SequelizeModule.forFeature([DungeonTags])],
    providers: [DungeonTagsService],
    exports: [SequelizeModule, DungeonTagsService]
})
export class DungeonTagsModule {}