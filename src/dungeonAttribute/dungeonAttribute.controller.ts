import { Controller, UseInterceptors } from '@nestjs/common';
import { DungeonAttribute } from './dungeonAttribute.model';
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
import { DungeonAttributeService } from './dungeonAttribute.service';

@ApiTags('DungeonAttribute')
@Controller('DungeonAttribute')
export class DungeonAttributeController {
    constructor(
        private dungeonAttributeService: DungeonAttributeService
    ) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.dungeonAttributeService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<DungeonAttribute> {
        return this.dungeonAttributeService.findOne(params.id);
    }

    @Post()
    create(@Body() type: DungeonAttribute): Promise<DungeonAttribute> {
        return this.dungeonAttributeService.create(type);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type: DungeonAttribute): Promise<DungeonAttribute> {
        return this.dungeonAttributeService.update(params.id, type);
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.dungeonAttributeService.remove(params.id);
    }
}