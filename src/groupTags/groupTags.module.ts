import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupTags } from './groupTags.model';
import { GroupTagsService } from './groupTags.service';

@Module({
    imports: [SequelizeModule.forFeature([GroupTags])],
    providers: [GroupTagsService],
    exports: [SequelizeModule, GroupTagsService]
})
export class GroupTagsModule {}