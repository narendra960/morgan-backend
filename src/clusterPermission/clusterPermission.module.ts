import { SequelizeModule } from "@nestjs/sequelize";
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ClusterPermission } from "./clusterPermission.model";
import { CharacterModule } from "src/character/character.module";
import { MapModule } from "src/map/map.module";
import { ClusterModule } from "src/cluster/cluster.module";
import { ClusterPermissionService } from "./clusterPermission.service";
import { CharacterService } from "src/character/character.service";
import { MapService } from "src/map/map.service";
import { ClusterService } from "src/cluster/cluster.service";
import { UserModule } from "src/user/user.module";
import { MapTagModule } from "src/mapTag/mapTag.module";
import { ClusterTagModule } from "src/clusterTag/clusterTag.module";




@Module({
    imports: [SequelizeModule.forFeature([ClusterPermission]), CharacterModule, MapModule, ClusterModule, UserModule, MapTagModule, ClusterTagModule],
    providers: [ClusterPermissionService, CharacterService, MapService, ClusterService],
    exports: [SequelizeModule, ClusterPermissionService]
})
export class ClusterPermissionModule {}