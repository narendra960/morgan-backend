import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupAttribute } from './groupAttribute.model';
import { GroupAttributeService } from './groupAttribute.service';

@Module({
    imports: [SequelizeModule.forFeature([GroupAttribute])],
    providers: [GroupAttributeService],
    exports: [SequelizeModule, GroupAttributeService]
})
export class GroupAttributeModule {}