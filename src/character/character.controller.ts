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

import { CharacterService } from './character.service';
import { Character } from './character.model';

@ApiTags('Character')
@Controller('Character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query() query) {
    return this.characterService.findAll(query);
  }

  @Get('/search')
  @ApiQuery({ name: 'name', required: false, type: String })
  findText(@Query() query) {
    return this.characterService.findText(query);
  }

  @Get('/user')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'user', required: false, type: String })
  findByUser(@Query() query) {
    return this.characterService.findByUser(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<Character> {
    return this.characterService.findOne(params.id);
  }

  @Post()
  create(@Body() type: Character): Promise<Character> {
    return this.characterService.create(type);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: Character): Promise<Character> {
    return this.characterService.update(params.id, type);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.characterService.remove(params.id);
  }
}
