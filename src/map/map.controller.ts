import { Controller, UseInterceptors } from '@nestjs/common';
import { Map } from './map.model';
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
import { MapService } from './map.service';
import { query } from 'express';

@ApiTags('Map')
@Controller('Map')
export class MapController {
    constructor(
        private mapService: MapService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.mapService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<Object> {
        return this.mapService.findOne(params.id);
    }

    @Post()
    create(@Body() type: Map): Promise<Object> {
        return this.mapService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: Map): Promise<Object> {
        return this.mapService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.mapService.remove(params.id);
    }
}