import { RegionService } from './region.service';
import { Controller } from '@nestjs/common';
import { Region } from './region.model';
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
import { RegionTag } from 'src/regionTag/regionTag.model';

@ApiTags('region')
@Controller('region')
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.regionService.findAll(query);
  }

  @Get('/wme')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAllWithoutMakeEntry(@Query() query) {
    return this.regionService.findAllWithoutMakeEntry(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Region> {
    return this.regionService.findOne(params.id);
  }

  @Post()
  create(@Body() region: Region): Promise<Object> {
    return this.regionService.create(region);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() region: Region): Promise<Object> {
    return this.regionService.update(params.id, region);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.regionService.remove(params.id);
  }
}
