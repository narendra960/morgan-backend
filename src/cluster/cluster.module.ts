import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cluster } from './cluster.model';
import { ClusterService } from './cluster.service';
import { UserModule } from 'src/user/user.module';
import { MapModule } from 'src/map/map.module';
import { MapService } from 'src/map/map.service';
import { UserService } from 'src/user/user.service';
import { MapTagModule } from 'src/mapTag/mapTag.module';
import { ClusterTagModule } from 'src/clusterTag/clusterTag.module';
import { ClusterTagService } from 'src/clusterTag/clusterTag.service';

@Module({
    imports: [SequelizeModule.forFeature([Cluster]), UserModule, MapModule, MapTagModule, ClusterTagModule],
    providers: [ClusterService, UserService, MapService, ClusterTagService],
    exports: [SequelizeModule, ClusterService]
})

export class ClusterModule {}