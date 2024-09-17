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
import { UserMaps } from './userMaps.model';
import { userMapsService } from './userMaps.service';

@ApiTags('UserMaps')
@Controller('UserMaps')
export class UserMapsController {
  constructor(private userMapsService: userMapsService) {}

  // @Get()
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'offset', required: false, type: Number })
  // findAll(@Query() query) {
  //   return this.userMapsService.findAll(query);
  // }

  // @Get(':id')
  // @ApiParam({ name: 'id' })
  // findOne(@Param() params): Promise<UserMaps> {
  //   return this.userMapsService.findOne(params.id);
  // }

  @Post()
  create(@Body() type: UserMaps): Promise<Object> {
    return this.userMapsService.create(type);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(@Query() query) {
    return this.userMapsService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<UserMaps> {
      return this.userMapsService.findOne(params.id)
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: UserMaps): Promise<UserMaps> {
    return this.userMapsService.update(params.id, type);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.userMapsService.remove(params.id);
  }
}
