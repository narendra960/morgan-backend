import { Controller, UseInterceptors } from '@nestjs/common';
import { Image } from './image.model';
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

import { ImageService } from './image.service';
import { UploadService } from 'src/upload/upload.service';

@ApiTags('image')
@Controller('image')
export class ImageContoller {
  constructor(
    private imageService: ImageService,
    uploadService: UploadService,
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.imageService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Image> {
    return this.imageService.findOne(params.id);
  }

  @Post()
  create(@Body() type: Image): Promise<Image> {
    return this.imageService.create(type);
  }

  // @Put(':id')
  // @ApiParam({ name: 'id' })
  // update(@Param() params, @Body() type: Type): Promise<Type> {
  //   return this.imageService.update(params.id, type);
  // }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: Image): Promise<Image> {
    return this.imageService.update(params.id, type);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.imageService.remove(params.id);
  }
}
