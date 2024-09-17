import { Controller, UseInterceptors } from '@nestjs/common';
import { MailMessages } from './mailMessages.model';
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
import { MailMessageService } from './mailMessages.service';

@ApiTags('MailMessage')
@Controller('MailMessage')
export class MailMessageController {
    constructor(
        private mailMessageServide: MailMessageService
    ) { }

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.mailMessageServide.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<MailMessages> {
        return this.mailMessageServide.findOne(params.id);
    }

    @Post()
    create(@Body() type: MailMessages): Promise<MailMessages> {
        return this.mailMessageServide.create(type);
    }

    @Post(':id')
    @ApiParam({ name: 'id' })
    readMail(@Param() params): Promise<MailMessages> {
        return this.mailMessageServide.readMail(params.id);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<MailMessages> {
        return this.mailMessageServide.remove(params.id);
    }
}