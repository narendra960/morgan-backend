import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channel } from './channel.model';
import { GroupsModule } from 'src/groups/groups.module';
import { channelService } from './channel.service';
import { GroupsService } from 'src/groups/groups.service';
import { GroupAttributeModule } from 'src/groupAttribute/groupAttribute.module';
import { GroupTagsService } from 'src/groupTags/groupTags.service';
import { GroupTagsModule } from 'src/groupTags/groupTags.module';



@Module({
    imports: [SequelizeModule.forFeature([Channel]), GroupsModule, GroupAttributeModule, GroupTagsModule],
    providers: [channelService, GroupsService, GroupTagsService],
    exports: [SequelizeModule, channelService]
})
export class channelModule {}