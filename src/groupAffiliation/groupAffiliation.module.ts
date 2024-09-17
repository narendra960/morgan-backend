import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupAffiliation } from './groupAffiliation.model';
import { GroupAffiliationService } from './groupAffiliation.service';

@Module({
    imports: [SequelizeModule.forFeature([GroupAffiliation])],
    providers: [GroupAffiliationService],
    exports: [SequelizeModule, GroupAffiliationService]
})
export class GroupAffiliationModule {}