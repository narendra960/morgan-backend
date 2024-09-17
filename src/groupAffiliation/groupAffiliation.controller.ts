import { Controller, UseInterceptors } from '@nestjs/common';
import { GroupAffiliation } from './groupAffiliation.model';
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
import { GroupAffiliationService } from './groupAffiliation.service';
import { query } from 'express';

@ApiTags('GroupAffiliation')
@Controller('GroupAffiliation')

export class GroupAffiliationController {
    constructor(
        private groupAffiliationService: GroupAffiliationService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupAffiliationService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<GroupAffiliation> {
        return this.groupAffiliationService.findOne(params.id);
    }

    @Post()
    create(@Body() type: GroupAffiliation): Promise<GroupAffiliation> {
        return this.groupAffiliationService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: GroupAffiliation): Promise<GroupAffiliation> {
        return this.groupAffiliationService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.groupAffiliationService.remove(params.id);
    }
}