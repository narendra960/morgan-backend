import { Controller, UseInterceptors } from '@nestjs/common';
import { AccountFriend } from './accountFriend.model';
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
import { AccountFriendService } from './accountFriend.service';
import { AccountFriendResponseDTO } from './accountFriend.dto';

@ApiTags('AccountFriend')
@Controller('AccountFriend')
export class AccountFriendController {
  constructor(private readonly accountFriendService: AccountFriendService) {}


    @Get()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    findAll(@Query() query) {
        return this.accountFriendService.findAll(query)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    findOne(@Param() params): Promise<AccountFriendResponseDTO> {
        return this.accountFriendService.findByUserId(params.id);
    }

    @Post()
    async create(@Body() accountFriendData: AccountFriend): Promise<AccountFriend> {
        return this.accountFriendService.create(accountFriendData);
    }

    @Patch(':id')
    @ApiParam({ name: 'id' })
    update(@Param() params, @Body() type:AccountFriend) {
        return this.accountFriendService.update(params.id, type)
    }

    @Delete(':id')
    @ApiParam({ name: 'id' })
    remove(@Param() params): Promise<void> {
        return this.accountFriendService.remove(params.id);
    }
}