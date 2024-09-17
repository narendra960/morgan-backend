import { Controller, UseInterceptors, Render } from '@nestjs/common';
import { User } from './user.model';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
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
import { UserService } from './user.service';
import { Users } from 'aws-sdk/clients/budgets';
import { Character } from 'src/character/character.model';

class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

class forgotPasswordDto {
  @ApiProperty()
  email: string;
}

class verifyTokenDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  password: string;
}
@ApiTags('Users')
@Controller('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() type: User): Promise<Object> {
    return this.userService.create(type);
  }

  // @Post('without-password')
  // async withoutHashescreate(@Body() type: User): Promise<Object> {
  //   return this.userService.withoutHashescreate(type);
  // }

  @Patch(':id')
  @ApiParam({ name: 'id' })
  update(@Param() params, @Body() type: User): Promise<User> {
    return this.userService.update(params.id, type);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  findOne(@Param() params): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() type: LoginDto): Promise<Object> {
    return this.userService.login(type);
  }

  @Post('forgotPassword')
  @ApiBody({ type: forgotPasswordDto })
  async forgotPassword(@Body() type: forgotPasswordDto): Promise<Object> {
    return this.userService.forgotPassword(type);
  }

  @Post('verifyToken')
  @ApiBody({ type: verifyTokenDto })
  async resetPassword(@Body() type: verifyTokenDto): Promise<Object> {
    return this.userService.resetPassword(type);
  }

  @Get('/verifyToken/resetPassword')
  @Render('index')
  root() {
    return { message: 'Hello world 04500!' };
  }

  @Get('/all-character/:id')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiParam({ name: 'id' })
  getAllCharacter(@Param() params, @Query() query) {
    return this.userService.getAllCharacter(params.id, query);
  }
}
