import { RegionAttributeService } from './regionAttribute.service';
import { Controller } from '@nestjs/common';
import { RegionAttribute } from './regionAttribute.model';
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

@ApiTags('regionattribute')
@Controller('regionattribute')
export class RegionAttributeController {
  constructor(private regionAttributeSerivce: RegionAttributeService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.regionAttributeSerivce.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<RegionAttribute> {
    return this.regionAttributeSerivce.findOne(params.id);
  }

  @Post()
  create(@Body() entryattribute: RegionAttribute): Promise<RegionAttribute> {
    return this.regionAttributeSerivce.create(entryattribute);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(
    @Param() params,
    @Body() entryattribute: RegionAttribute,
  ): Promise<RegionAttribute> {
    return this.regionAttributeSerivce.update(params.id, entryattribute);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.regionAttributeSerivce.remove(params.id);
  }
}
