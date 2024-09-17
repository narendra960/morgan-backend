import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountFriend } from './accountFriend.model';
import { AccountFriendService } from './accountFriend.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([AccountFriend]), UserModule],
  providers: [AccountFriendService, UserService],
  exports: [SequelizeModule],
})
export class AccountFriendModule {}
