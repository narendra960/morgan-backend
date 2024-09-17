import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { TemporaryGroup } from './temporaryGroup.model';
import { TemporaryGroupService } from './temporaryGroup.service';

@Module({
    imports: [SequelizeModule.forFeature([TemporaryGroup])],
    providers: [TemporaryGroupService],
    exports: [SequelizeModule, TemporaryGroupService]
})
export class TemporaryGroupModule {}