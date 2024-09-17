import { Controller, UseInterceptors } from '@nestjs/common';
import { Groups } from './groups.model';
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
import { GroupsService } from './groups.service';
import { query } from 'express';

@ApiTags('Groups')
@Controller('Groups')
export class GroupsController {
    constructor(
        private groupsService: GroupsService
    ) { }

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupsService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<Groups> {
        return this.groupsService.findOne(params.id);
    }

    @Post()
    create(@Body() type: Groups): Promise<Groups> {
        return this.groupsService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: Groups): Promise<Groups> {
        return this.groupsService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.groupsService.remove(params.id);
    }

    @Get(':keyword')
    @ApiParam({ name: 'keyword' })
    search(@Param() params) {
        return this.groupsService.search(params.keyword)
    }
}