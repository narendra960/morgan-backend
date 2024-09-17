import { Controller } from '@nestjs/common';
import { ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClusterService } from './cluster.service';
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
import { Cluster } from './cluster.model';

class statusDto {
  @ApiProperty()
  status: boolean;
}

@ApiTags('Cluster')
@Controller('Cluster')
export class ClusterController {
  constructor(private clusterService: ClusterService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.clusterService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Object> {
    return this.clusterService.findOne(params.id);
  }

  @Patch('accept/:id')
  @ApiParam({ name: 'id' })
  accept(@Param() params) {
    return this.clusterService.accept(params.id);
  }

  @Patch('status/:id')
  @ApiParam({ name: 'id' })
  status(@Param() params, @Body() status: statusDto) {
    return this.clusterService.status(params.id, status);
  }

  @Post()
  create(@Body() type: Cluster): Promise<Object> {
    return this.clusterService.create(type);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: Cluster) {
    return this.clusterService.update(params.id, type);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.clusterService.remove(params.id);
  }
}
