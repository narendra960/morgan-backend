import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserMaps } from './userMaps.model';
import { userMapsService } from './userMaps.service';
import { MapModule } from 'src/map/map.module';
import { MapService } from 'src/map/map.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { MapTagModule } from 'src/mapTag/mapTag.module';

@Module({
  imports: [SequelizeModule.forFeature([UserMaps]), UserModule, MapModule, MapTagModule],
  providers: [userMapsService, UserService, MapService],
  exports: [SequelizeModule, userMapsService],
})
export class userMapsModule {}
