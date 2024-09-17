import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { Map } from './map.model';
import { MapService } from './map.service';
import { MapTagModule } from '../mapTag/mapTag.module';
import {MapTagService } from '../mapTag/mapTag.service';

@Module({
    imports: [SequelizeModule.forFeature([Map]), MapTagModule],
    providers: [MapService, MapTagService],
    exports: [SequelizeModule, MapService]
})
export class MapModule {}