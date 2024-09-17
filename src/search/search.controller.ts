import { Controller, HttpCode } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { Entry } from 'src/entry/entry.model';
import { Region } from 'src/region/region.model';
import { SearchService } from './seach.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @HttpCode(200)
  @Get()
  @ApiQuery({ name: 'textString', required: false, type: String })
  async Search(@Query() query) {
    return this.searchService.search(query.textString ? query.textString : '');
  }

  @HttpCode(200)
  @Get('object')
  @ApiQuery({ name: 'textString', required: false, type: String })
  @ApiQuery({ name: 'object', required: false, type: String })
  async SearchByObject(@Query() query) {
    return this.searchService.searchByObject(query);
  }

  @HttpCode(200)
  @Get('regions')
  @ApiQuery({ name: 'textString', required: false, type: String })
  async SearchRegions(@Query() query): Promise<Region[]> {
    return await this.searchService.searchRegions(
      query.textString ? query.textString : '',
    );
  }

  @HttpCode(200)
  @Get('entity')
  @ApiQuery({ name: 'textString', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  async SearchEntity(@Query() query) {
    return await this.searchService.searchEntity(query);
  }

  @HttpCode(200)
  @Get('phrases')
  @ApiQuery({ name: 'attributeId', required: false, type: String })
  @ApiQuery({ name: 'attributeValue', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  async SearchPhrases(@Query() query) {
    return await this.searchService.searchByAttribute(query);
  }
}
