import { Controller, UseInterceptors } from '@nestjs/common';
import { TemporaryGroup } from './temporaryGroup.model';
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
import { TemporaryGroupService } from './temporaryGroup.service';
import { query } from 'express';

@ApiTags('TemporaryGroup')
@Controller('TemporaryGroup')
export class TemporaryGroupController {
    constructor(
        private temporaryGroupService: TemporaryGroupService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.temporaryGroupService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<TemporaryGroup> {
        return this.temporaryGroupService.findOne(params.id);
    }

    @Post()
    create(@Body() type: TemporaryGroup): Promise<TemporaryGroup> {
        return this.temporaryGroupService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: TemporaryGroup): Promise<TemporaryGroup> {
        return this.temporaryGroupService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.temporaryGroupService.remove(params.id);
    }
}