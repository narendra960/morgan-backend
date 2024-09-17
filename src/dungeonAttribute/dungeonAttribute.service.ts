import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { DungeonAttribute } from './dungeonAttribute.model';

@Injectable()
export class DungeonAttributeService {
    constructor(@InjectModel(DungeonAttribute) private dungeonAttributeModel: typeof DungeonAttribute) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.dungeonAttributeModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<DungeonAttribute> {
        return this.dungeonAttributeModel.findOne({
            where: {
                attributeId: id
            }
        });
    }

    async findAllByDungeon(dungeonId: string) {
        return this.dungeonAttributeModel.sequelize.query(
          `SELECT
          a.attributeId,
          a.attributeName,
          da.value
        FROM
          DungeonAttributes AS da
          LEFT JOIN Attributes AS a ON da.attributesId = a.attributeId 
        WHERE
          da.dungeonsId = '${dungeonId}'`,
          { type: QueryTypes.SELECT },
        );
      }

    async create(dungeonAttributeData: any): Promise<DungeonAttribute> {
        const dungeonAttribute = await this.dungeonAttributeModel.create(dungeonAttributeData);
        return dungeonAttribute;
    }

    async update(id: string, dungeonAttributeData: any): Promise<DungeonAttribute> {
        const dungeonAttribute = await this.dungeonAttributeModel.findOne({ where: { attributeId: id } });
        return await dungeonAttribute.update(dungeonAttributeData);
    }

    async remove(id: string): Promise<void> {
        await this.dungeonAttributeModel.destroy({ where: { attributeId: id } });
    }
    
}

