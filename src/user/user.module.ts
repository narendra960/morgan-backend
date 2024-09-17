import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service'
import { EmailService } from 'src/Email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { Character } from 'src/character/character.model';

@Module({
    imports: [SequelizeModule.forFeature([User]), SequelizeModule.forFeature([Character]), JwtModule],
    providers: [UserService, EmailService],
    exports: [SequelizeModule, UserService, EmailService]
})
export class UserModule {}