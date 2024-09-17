import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClusterPermissionService } from "./clusterPermission.service";
import {
    Post,
    Delete,
    Get,
    Patch,
} from '@nestjs/common/decorators/http/request-mapping.decorator';

import {
    Body,
    Param,
    Query,
    Res,
    UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ClusterPermission } from "./clusterPermission.model";


@ApiTags('ClusterPermission')
@Controller('ClusterPermission')
export class ClusterPermissionController {
    constructor(private clusterPermissionService: ClusterPermissionService) {}

    @Post()
    create(@Body() type: ClusterPermission) {
        return this.clusterPermissionService.create(type)
    }
}