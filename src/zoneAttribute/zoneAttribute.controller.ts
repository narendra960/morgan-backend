import { ZoneAttributeService } from './zoneAttribute.service';
import { Controller } from '@nestjs/common';
import { ZoneAttribute } from './zoneAttribute.model';
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

@ApiTags('zoneattribute')
@Controller('zoneattribute')
export class ZoneAttributeController {
  constructor(private zoneAttributeSerivce: ZoneAttributeService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.zoneAttributeSerivce.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<ZoneAttribute> {
    return this.zoneAttributeSerivce.findOne(params.id);
  }

  @Post()
  create(@Body() zoneAttribute: ZoneAttribute): Promise<ZoneAttribute> {
    return this.zoneAttributeSerivce.create(zoneAttribute);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(
    @Param() params,
    @Body() zoneAttribute: ZoneAttribute,
  ): Promise<ZoneAttribute> {
    return this.zoneAttributeSerivce.update(params.id, zoneAttribute);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.zoneAttributeSerivce.remove(params.id);
  }
}
