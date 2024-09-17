import { ZoneService } from './zone.service';
import { Controller } from '@nestjs/common';
import { Zone } from './zone.model';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  Post,
  Put,
  Delete,
  Get,
  Patch,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ZoneTag } from 'src/zoneTag/zoneTag.model';

@ApiTags('zone')
@Controller('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.zoneService.findAll(query);
  }

  @Get('/wme')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAllWithoutMakeEntry(@Query() query) {
    return this.zoneService.findAllWithoutMakeEntry(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Zone> {
    return this.zoneService.findOne(params.id);
  }

  @Post()
  create(@Body() zone: Zone): Promise<Object> {
    return this.zoneService.create(zone);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() zone: Zone): Promise<Object> {
    return this.zoneService.update(params.id, zone);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.zoneService.remove(params.id);
  }
}
