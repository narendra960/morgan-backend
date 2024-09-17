import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClusterTag } from './clusterTag.model';
import { ClusterTagService } from './clusterTag.service';

@Module({
    imports: [SequelizeModule.forFeature([ClusterTag])],
    providers: [ClusterTagService],
    exports: [SequelizeModule, ClusterTagService]
})
export class ClusterTagModule {}