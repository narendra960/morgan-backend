import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { MapTag } from './mapTag.model';
import { MapTagService } from './mapTag.service';

@Module({
    imports: [SequelizeModule.forFeature([MapTag])],
    providers: [MapTagService],
    exports: [SequelizeModule, MapTagService]
})
export class MapTagModule {}