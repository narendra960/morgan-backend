import { Controller, UseInterceptors } from '@nestjs/common';
import { GroupUnrealAsset } from './groupUnrealAsset.model';
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
import { GroupUnrealAssetService } from './groupUnrealAsset.service';
import { query } from 'express';

@ApiTags('GroupUnrealAsset')
@Controller('GroupUnrealAsset')
export class GroupUnrealAssetController {
    constructor(
        private groupUnrealAssetService: GroupUnrealAssetService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupUnrealAssetService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<GroupUnrealAsset> {
        return this.groupUnrealAssetService.findOne(params.id);
    }

    @Post()
    create(@Body() type: GroupUnrealAsset): Promise<GroupUnrealAsset> {
        return this.groupUnrealAssetService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: GroupUnrealAsset): Promise<GroupUnrealAsset> {
        return this.groupUnrealAssetService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.groupUnrealAssetService.remove(params.id);
    }
}