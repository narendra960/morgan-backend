import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize';
import { DungeonAttribute } from './dungeonAttribute.model';
import { DungeonAttributeService } from './dungeonAttribute.service';

@Module({
    imports: [SequelizeModule.forFeature([DungeonAttribute])],
    providers: [DungeonAttributeService],
    exports: [SequelizeModule, DungeonAttributeService]
})
export class DungeonAttributeModule {}