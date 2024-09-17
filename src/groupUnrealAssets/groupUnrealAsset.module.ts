import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupUnrealAsset } from './groupUnrealAsset.model';
import { GroupUnrealAssetService } from './groupUnrealAsset.service';

@Module({
    imports: [SequelizeModule.forFeature([GroupUnrealAsset])],
    providers: [GroupUnrealAssetService],
    exports: [SequelizeModule, GroupUnrealAssetService]
})
export class GroupUnrealAssetModule {}