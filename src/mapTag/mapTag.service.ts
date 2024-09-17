import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { MapTag } from './mapTag.model';

@Injectable()
export class MapTagService {
    constructor(@InjectModel(MapTag) private mapTagModel: typeof MapTag) { }

    // async findAll(payload) {
    //     const { page, limit, offset } = payload;
    //     const types = await this.mapTagModel.findAndCountAll({
    //         limit: Number(limit) ? Number(limit) : 100,
    //         offset: Number(offset) ? Number(offset) : 0,
    //     });
    //     return { data: types.rows, total: types.count, count: types.count };
    // }

    // async findOne(id: string): Promise<MapTag> {
    //     return this.mapTagModel.findOne({
    //         where: {
    //             tagId: id
    //         }
    //     });
    // }

    async create(dapTagData: any): Promise<MapTag> {
        const dapTag = await this.mapTagModel.create(dapTagData);
        return dapTag;
    }

    async update(id: string, dapTagData: any): Promise<MapTag> {
        const dapTag = await this.mapTagModel.findOne({ where: { tagId: id } });
        return await dapTag.update(dapTagData);
    }

    async findAllByMap(mapId){
        let data = await this.mapTagModel.sequelize.query(
            `SELECT t.tagId, t.tagString FROM MapTags AS mt LEFT JOIN Tags AS t ON mt.tagId = t.tagId WHERE mt.mapId = '${mapId}'`,
            { type: QueryTypes.SELECT }
        )
        return data;
    }
    
    // async remove(id: string): Promise<void> {
    //     await this.mapTagModel.destroy({ where: { tagId: id } });
    // }
    
}

