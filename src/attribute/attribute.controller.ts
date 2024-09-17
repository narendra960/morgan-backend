import { AttributeService } from './attribute.service';
import { Controller } from '@nestjs/common';
import { Attribute } from './attribute.model';
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

@ApiTags('attribute')
@Controller('attribute')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.attributeService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Attribute> {
    return this.attributeService.findOne(params.id);
  }

  @Post()
  create(@Body() attribute: Attribute): Promise<Attribute> {
    return this.attributeService.create(attribute);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() attribute: Attribute): Promise<Attribute> {
    return this.attributeService.update(params.id, attribute);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.attributeService.remove(params.id);
  }
}
