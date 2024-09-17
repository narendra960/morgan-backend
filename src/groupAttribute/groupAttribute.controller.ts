import { Controller, UseInterceptors } from '@nestjs/common';
import { GroupAttribute } from './groupAttribute.model';
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
import { GroupAttributeService } from './groupAttribute.service';
import { query } from 'express';

@ApiTags('GroupAttribute')
@Controller('GroupAttribute')
export class GroupAttributeController {
    constructor(
        private groupAttributeService: GroupAttributeService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupAttributeService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<GroupAttribute> {
        return this.groupAttributeService.findOne(params.id);
    }

    @Post()
    create(@Body() type: GroupAttribute): Promise<GroupAttribute> {
        return this.groupAttributeService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: GroupAttribute): Promise<GroupAttribute> {
        return this.groupAttributeService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.groupAttributeService.remove(params.id);
    }
}