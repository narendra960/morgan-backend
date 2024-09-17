import { TokenService } from './token.service';
import { Controller } from '@nestjs/common';
import { Token } from './token.model';
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

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(@Query() query) {
    const tokens = await this.tokenService.findAll(query);
    const groupedTokens = tokens.data.reduce((acc, token) => {
        if (!acc[token.userId]) {
          acc[token.userId] = {
            tokenId: token.tokenId,
            userId: token.userId,
            tokens: [token.token],
          };
        } else {
          acc[token.userId].tokens.push(token.token);
        }
        return acc;
      }, {});
    

      const data = Object.values(groupedTokens);
      return { data };
    
    //   return { data, total: tokens.total, count: tokens.count };
    
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<{ tokenId: string; userId: string; token: string; }> {
    return this.tokenService.findOne(params.id);
  }

  @Post()
  create(@Body() token: Token): Promise<Token> {
    return this.tokenService.create(token);
  }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() token: Token): Promise<{ tokenId: string; userId: string; token: string; }> {
    return this.tokenService.update(params.id, token);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  remove(@Param() params): Promise<void> {
    return this.tokenService.remove(params.id);
  }
}
