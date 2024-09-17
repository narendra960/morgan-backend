import { OtherService } from './other.service';
import { Controller } from '@nestjs/common';
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

@ApiTags()
@Controller()
export class RegionController {
  constructor(private otherService: OtherService) {}

  @Post('/presignedUrl')
  @ApiParam({ name: 'key' })
  createPresignedUrl(@Param() params): Promise<String> {
    return this.otherService.createPresignedUrl(params.key);
  }

  //   @Get()
  //   @ApiQuery({ name: 'limit', required: false, type: Number })
  //   @ApiQuery({ name: 'page', required: false, type: Number })
  //   @ApiQuery({ name: 'offset', required: false, type: Number })
  //   findAll(@Query() query) {
  //     return this.regionService.findAll(query);
  //   }

  //   @Get(':id')
  //   @ApiParam({ name: 'id' })
  //   findOne(@Param() params): Promise<Region> {
  //     return this.regionService.findOne(params.id);
  //   }

  //   @Post()
  //   create(@Body() region: Region): Promise<RegionTag[]> {
  //     return this.regionService.create(region);
  //   }

  //   @Patch(':id')
  //   @ApiParam({ name: 'id' })
  //   update(@Param() params, @Body() region: Region): Promise<Region> {
  //     return this.regionService.update(params.id, region);
  //   }

  //   @Delete(':id')
  //   @ApiParam({ name: 'id' })
  //   remove(@Param() params): Promise<void> {
  //     return this.regionService.remove(params.id);
  //   }
}
