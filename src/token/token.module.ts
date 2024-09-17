import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [SequelizeModule.forFeature([Token])],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [SequelizeModule],
})
export class TokenModule {}