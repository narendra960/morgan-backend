import { EntryAttributeService } from './entryAttribute.service';
import { Controller } from '@nestjs/common';
import { EntryAttribute } from './entryAttribute.model';
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
} from '@nestjs/common/decorators/http/route-params.decorator';

@ApiTags('entryattribute')
@Controller('entryattribute')
export class EntryAttributeController {
  constructor(private entryAttributeSerivce: EntryAttributeService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.entryAttributeSerivce.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<EntryAttribute> {
    return this.entryAttributeSerivce.findOne(params.id);
  }

  @Post()
  create(@Body() entryattribute: EntryAttribute): Promise<EntryAttribute> {
    return this.entryAttributeSerivce.create(entryattribute);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(
    @Param() params,
    @Body() entryattribute: EntryAttribute,
  ): Promise<EntryAttribute> {
    return this.entryAttributeSerivce.update(params.id, entryattribute);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.entryAttributeSerivce.remove(params.id);
  }
}
