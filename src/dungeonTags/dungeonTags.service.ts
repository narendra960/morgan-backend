import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { DungeonTags } from './dungeonTags.model';

@Injectable()
export class DungeonTagsService {
    constructor(@InjectModel(DungeonTags) private dungeonTagsModel: typeof DungeonTags) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.dungeonTagsModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<DungeonTags> {
        return this.dungeonTagsModel.findOne({
            where: {
                tagId: id
            }
        });
    }

    async create(dungeonTagsData: any): Promise<DungeonTags> {
        const dungeonTags = await this.dungeonTagsModel.create(dungeonTagsData);
        return dungeonTags;
    }

    async update(id: string, dungeonTagsData: any): Promise<DungeonTags> {
        const dungeonTags = await this.dungeonTagsModel.findOne({ where: { tagId: id } });
        return await dungeonTags.update(dungeonTagsData);
    }

    async findAllByDungeon(dungeonId) {
        return this.dungeonTagsModel.sequelize.query(
            `select t.tagId, t.tagString from DungeonTags as dt left join Tags as t on dt.tagsId = t.tagId where dt.dungeonsId = '${dungeonId}'`,
            { type: QueryTypes.SELECT }
        )
    }
    
    async remove(id: string): Promise<void> {
        await this.dungeonTagsModel.destroy({ where: { tagId: id } });
    }
    
}

