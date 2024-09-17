import { Controller, UseInterceptors } from '@nestjs/common';
import { MapTag } from './mapTag.model';
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
import { MapTagService } from './mapTag.service';

@ApiTags('MapTag')
@Controller('MapTag')
export class MapTagController {
    constructor(
        private mapTagService: MapTagService
    ) {}

    // @Get()
    // @ApiQuery({ name: 'limit', required: false, type: Number })
    // @ApiQuery({ name: 'page', required: false, type: Number })
    // @ApiQuery({ name: 'offset', required: false, type: Number })
    // findAll(@Query() query) {
    //     return this.mapTagService.findAll(query)
    // }

    // @Get(':id')
    // @ApiParam({ name: 'id' })
    // findOne(@Param() params): Promise<MapTag> {
    //     return this.mapTagService.findOne(params.id);
    // }

    @Post()
    create(@Body() type: MapTag): Promise<MapTag> {
        return this.mapTagService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: MapTag): Promise<MapTag> {
        return this.mapTagService.update(params.id, type);
    }

    // @Delete(':id')
    // @ApiParam({ name: 'id' })
    // remove(@Param() params): Promise<void> {
    //     return this.mapTagService.remove(params.id);
    // }
}