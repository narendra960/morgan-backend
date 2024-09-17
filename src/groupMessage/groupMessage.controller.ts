import { Controller, UseInterceptors } from '@nestjs/common';
import { GroupMessage } from './groupMessage.model';
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
import { GroupMessageService } from './groupMessage.service';
import { query } from 'express';

@ApiTags('GroupMessage')
@Controller('GroupMessage')
export class GroupMessageController {
    constructor(
        private groupMessageService: GroupMessageService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.groupMessageService.findAll(query)
    }

    @Get(':serverAddress')
    @ApiParam({ name: 'serverAddress' })
    findOne(@Param() params): Promise<GroupMessage> {
        return this.groupMessageService.findOne(params.serverAddress);
    }

    @Post()
    create(@Body() type: GroupMessage): Promise<GroupMessage> {
        return this.groupMessageService.create(type);
    }

    @Patch(':serverAddress')
    @ApiParam({ name: 'serverAddress' })
    update(@Param() params, @Body() type: GroupMessage): Promise<GroupMessage> {
        return this.groupMessageService.update(params.serverAddress, type);
    }

    @Delete(':serverAddress')
    @ApiParam({ name: 'serverAddress' })
    remove(@Param() params): Promise<void> {
        return this.groupMessageService.remove(params.serverAddress);
    }
}