import { Controller, UseInterceptors } from '@nestjs/common';
import { DungeonTags } from './dungeonTags.model';
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
import { DungeonTagsService } from './dungeonTags.service';

@ApiTags('DungeonTags')
@Controller('DungeonTags')
export class DungeonTagsController {
    constructor(
        private dungeonTagsService: DungeonTagsService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.dungeonTagsService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<DungeonTags> {
        return this.dungeonTagsService.findOne(params.id);
    }

    @Post()
    create(@Body() type: DungeonTags): Promise<DungeonTags> {
        return this.dungeonTagsService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: DungeonTags): Promise<DungeonTags> {
        return this.dungeonTagsService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.dungeonTagsService.remove(params.id);
    }
}