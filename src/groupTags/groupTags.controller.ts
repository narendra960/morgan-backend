import { Controller, UseInterceptors } from '@nestjs/common';
import { GroupTags } from './groupTags.model';
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
import { GroupTagsService } from './groupTags.service';
import { query } from 'express';

@ApiTags('GroupTags')
@Controller('GroupTags')
export class GroupTagsController {
    constructor(
        private groupTagsService: GroupTagsService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupTagsService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<GroupTags> {
        return this.groupTagsService.findOne(params.id);
    }

    @Post()
    create(@Body() type: GroupTags): Promise<GroupTags> {
        return this.groupTagsService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: GroupTags): Promise<GroupTags> {
        return this.groupTagsService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.groupTagsService.remove(params.id);
    }
}