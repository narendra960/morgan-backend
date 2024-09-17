import { ApiTags } from "@nestjs/swagger";
import { Controller } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ClusterPermission } from "./clusterPermission.model";


@ApiTags('ClusterPermission')
@Controller('ClusterPermission')
export class ClusterPermissionService {
    constructor(@InjectModel(ClusterPermission) private clusterPermissionModel: typeof ClusterPermission) {}

    async create(data: any): Promise<ClusterPermission> {
        const response = await this.clusterPermissionModel.create(data);
        return response
    }
}