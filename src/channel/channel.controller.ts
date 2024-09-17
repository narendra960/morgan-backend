import { channelService } from "./channel.service";
import { Controller, UseInterceptors } from '@nestjs/common';
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
import { Channel } from "./channel.model";



@ApiTags('Channel')
@Controller('Channel')
export class ChannelController {
    constructor(private channelService: channelService) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.channelService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<Channel> {
        return this.channelService.findOne(params.id)
    }

    @Post()
    create(@Body() type: Channel): Promise<Channel> {
        return this.channelService.create(type)
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: Channel): Promise<Channel> {
        return this.channelService.update(params.id, type)
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.channelService.remove(params.id)
    }
}