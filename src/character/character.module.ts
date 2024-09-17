import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Character } from './character.model';
import { CharacterService } from './character.service';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [SequelizeModule.forFeature([Character]), UserModule],
    providers: [CharacterService, UserService],
    exports: [SequelizeModule, CharacterService]
})
export class CharacterModule {}