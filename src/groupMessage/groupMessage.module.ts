import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupMessage } from './groupMessage.model';
import { GroupMessageService } from './groupMessage.service';

@Module({
    imports: [SequelizeModule.forFeature([GroupMessage])],
    providers: [GroupMessageService],
    exports: [SequelizeModule, GroupMessageService]
})
export class GroupMessageModule {}