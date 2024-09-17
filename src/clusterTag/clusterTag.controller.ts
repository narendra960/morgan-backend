import { Controller, UseInterceptors } from '@nestjs/common';
import { ClusterTag } from './clusterTag.model';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ClusterTagService } from './clusterTag.service';

@ApiTags('ClusterTag')
@Controller('ClusterTag')
export class ClusterTagController {
    constructor(
        private clusterTagService: ClusterTagService
    ) {}

    // @Get()
    // @ApiQuery({ name: 'limit', required: false, type: Number })
    // @ApiQuery({ name: 'page', required: false, type: Number })
    // @ApiQuery({ name: 'offset', required: false, type: Number })
    // findAll(@Query() query) {
    //     return this.clusterTagService.findAll(query)
    // }

    // @Delete(':id')
    // @ApiParam({ name: 'id' })
    // remove(@Param() params): Promise<void> {
    //     return this.clusterTagService.remove(params.id);
    // }
}