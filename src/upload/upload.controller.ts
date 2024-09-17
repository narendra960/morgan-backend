import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  UploadedFiles,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  InternalServerErrorException,
  Response,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Entry } from 'src/entry/entry.model';
import { Image } from 'src/image/image.model';
import { UploadService } from './upload.service';

@ApiTags('image')
@Controller('')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageDescription: { type: 'string' },
        imageCategory: { type: 'string' },
        imageSubcategory: { type: 'string' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['imageCategory', 'imageSubcategory', 'files'],
    },
  })
  async uploadFile(
    @UploadedFiles() values,
    @Body('imageDescription') imageDescription: string,
    @Body('imageCategory') imageCategory: string,
    @Body('imageSubcategory') imageSubcategory: string,
  ) {
    try {
      let files = values;
      if (!Array.isArray(values)) {
        files = [values];
      }
      const images = await this.uploadService.uploadFile(
        files,
        imageDescription,
        imageCategory,
        imageSubcategory,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Images uploaded successfully',
        data: {
          images,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('upload/:category/:subcategory')
  @ApiOperation({ summary: 'Get images by category + subcategory' })
  @ApiParam({ name: 'category', type: 'string' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [Image] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No images found for category',
  })
  async getImageByCategoryAndSub(
    @Param('category') category: string,
    @Param('subcategory') subcategory: string,
    @Query('limit') limit?: number,
  ): Promise<Image[]> {
    try {
      const images = await this.uploadService.getImagesByCategoryAndSub(
        category,
        subcategory,
        limit,
      );
      if (!images || images.length === 0) {
        throw new NotFoundException(
          `No images found for category: ${category} and subcategory: ${subcategory}`,
        );
      }
      return images;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('upload/:category')
  @ApiOperation({ summary: 'Get images by category' })
  @ApiParam({ name: 'category', type: 'string' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [Image] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No images found for category',
  })
  async getImageByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ): Promise<Image[]> {
    try {
      const images = await this.uploadService.getImagesByCategory(
        category,
        limit,
      );
      if (!images || images.length === 0) {
        throw new NotFoundException(
          `No images found for category: ${category}`,
        );
      }
      return images;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // @Get('/zoneimages')
  // @ApiOperation({ summary: 'Get Zone images' })
  // @ApiQuery({ name: 'limit', required: false })
  // @ApiResponse({ status: HttpStatus.OK, type: [Image] })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'No images found for category',
  // })
  // async getZoneImages(
  //   @Query('limit') limit?: number,
  //   @Query('page') page?: number,
  //   @Query('offset') offset?: string,
  // ) {
  //   try {
  //     const images = await this.uploadService.getZoneImages(
  //       limit,
  //       page,
  //       offset,
  //     );
  //     if (!images || images.length === 0) {
  //       throw new NotFoundException(`No images found`);
  //     }
  //     return { data: images, count: images.length, total: images.length };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // @Get('/regionimages')
  // @ApiOperation({ summary: 'Get Region images' })
  // @ApiQuery({ name: 'limit', required: false })
  // @ApiResponse({ status: HttpStatus.OK, type: [Image] })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'No images found for category',
  // })
  // async getRegionImages(
  //   @Query('limit') limit?: number,
  //   @Query('page') page?: number,
  //   @Query('offset') offset?: string,
  // ) {
  //   try {
  //     const images = await this.uploadService.getRegionImages(
  //       limit,
  //       page,
  //       offset,
  //     );
  //     if (!images || images.length === 0) {
  //       throw new NotFoundException(`No images found`);
  //     }
  //     return { data: images, count: images.length, total: images.length };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // @Get('/entryimages')
  // @ApiOperation({ summary: 'Get Entry images' })
  // @ApiQuery({ name: 'limit', required: false })
  // @ApiResponse({ status: HttpStatus.OK, type: [Image] })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'No images found for category',
  // })
  // async getEntryImages(
  //   @Query('limit') limit?: number,
  //   @Query('page') page?: number,
  //   @Query('offset') offset?: string,
  // ) {
  //   try {
  //     const images = await this.uploadService.getEntryImages(
  //       limit,
  //       page,
  //       offset,
  //     );
  //     if (!images || images.length === 0) {
  //       throw new NotFoundException(`No images found`);
  //     }
  //     return { data: images, count: images.length, total: images.length };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  @Get('/zoneimages')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findZoneImages(@Query() query) {
    return this.uploadService.findZones(query);
  }

  @Get('/regionimages')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findRegionImages(@Query() query) {
    return this.uploadService.findRegion(query);
  }

  @Get('/entryimages')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findEntryImages(@Query() query) {
    return this.uploadService.findEntry(query);
  }
}
