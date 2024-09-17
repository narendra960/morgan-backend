import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Groups } from './groups.model';
import { GroupsService } from './groups.service';
import { Dungeons } from 'src/dungeons/dungeons.model';
import { GroupAttributeModule } from 'src/groupAttribute/groupAttribute.module';
import { GroupTagsService } from 'src/groupTags/groupTags.service';
import { GroupAttributeService } from 'src/groupAttribute/groupAttribute.service';
import { GroupTagsModule } from 'src/groupTags/groupTags.module';

@Module({
    imports: [SequelizeModule.forFeature([Groups]), GroupAttributeModule, GroupTagsModule],
    providers: [GroupsService, GroupTagsService, GroupAttributeService],
    exports: [SequelizeModule, GroupsService]
})
export class GroupsModule {}