import { TypeService } from './type.service';
import { Controller } from '@nestjs/common';
import { Type } from './type.model';
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

@ApiTags('type')
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.typeService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Type> {
    return this.typeService.findOne(params.id);
  }

  @Post()
  create(@Body() type: Type): Promise<Type> {
    return this.typeService.create(type);
  }

  // @Put(':id')
  // @ApiParam({ name: 'id' })
  // update(@Param() params, @Body() type: Type): Promise<Type> {
  //   return this.typeService.update(params.id, type);
  // }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: Type): Promise<Type> {
    return this.typeService.update(params.id, type);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.typeService.remove(params.id);
  }
}
