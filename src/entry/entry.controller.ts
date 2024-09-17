import { EntryService } from './entry.service';
import { Controller, HttpCode } from '@nestjs/common';
import { Entry } from './entry.model';
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
import { EntryTag } from 'src/entryTag/entryTag.model';

@ApiTags('entry')
@Controller('entry')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.entryService.findAll(query);
  }

  @Get('/wme')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAllWithoutMakeEntry(@Query() query) {
    return this.entryService.findAllWithoutMakeEntry(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Entry> {
    return this.entryService.findOne(params.id);
  }

  @Post()
  create(@Body() entry: Entry): Promise<Object> {
    return this.entryService.create(entry);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() entry: Entry): Promise<Object> {
    return this.entryService.update(params.id, entry);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.entryService.remove(params.id);
  }

  @HttpCode(200)
  @Get('regions/:regionId')
  @ApiParam({ name: 'regionId', required: true })
  SearchByRegion(@Param() params) {
    return this.entryService.searchByRegion(params.regionId);
  }

  @HttpCode(200)
  @Get('zones/:zoneId')
  @ApiParam({ name: 'zoneId', required: true })
  async SearchByZone(@Param() params) {
    return await this.entryService.searchByZone(params.zoneId);
  }

  @HttpCode(200)
  @Get('types/:typeId')
  @ApiParam({ name: 're', required: true })
  async SearchByType(@Param() params) {
    return await this.entryService.searchByType(params.typeId);
  }

  @HttpCode(200)
  @Get('possessorEntity/:possessorEntity')
  @ApiParam({ name: 'possessorEntity', required: true })
  async SearchByPossessorEntity(@Param() params) {
    return await this.entryService.SearchByPossessorEntity(
      params.possessorEntity,
    );
  }
  @HttpCode(200)
  @Get('possessorEntry/:possessorEntry')
  @ApiParam({ name: 'possessorEntry', required: true })
  async SearchByPossessorEntry(@Param() params) {
    return await this.entryService.SearchByPossessorEntry(
      params.possessorEntry,
    );
  }
  @HttpCode(200)
  @Get('possessorZone/:possessorZone')
  @ApiParam({ name: 'possessorZone', required: true })
  async SearchByPossessorZone(@Param() params) {
    return await this.entryService.SearchByPossessorZone(params.possessorZone);
  }
  @HttpCode(200)
  @Get('possessorRegion/:possessorRegion')
  @ApiParam({ name: 'possessorRegion', required: true })
  async SearchByPossessorRegion(@Param() params) {
    return await this.entryService.SearchByPossessorRegion(
      params.possessorRegion,
    );
  }
}
