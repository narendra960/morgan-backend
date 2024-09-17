import { Controller, UseInterceptors } from '@nestjs/common';
import { Dungeons } from './dungeons.model';
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
import { DungeonsService } from './dungeons.service';
import { query } from 'express';

@ApiTags('Dungeons')
@Controller('Dungeons')
export class DungeonsController {
    constructor(
        private dungeonsService: DungeonsService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.dungeonsService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<Dungeons> {
        return this.dungeonsService.findOne(params.id);
    }

    @Post()
    create(@Body() type: Dungeons): Promise<Object> {
        return this.dungeonsService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: Dungeons): Promise<Object> {
        return this.dungeonsService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.dungeonsService.remove(params.id);
    }
}