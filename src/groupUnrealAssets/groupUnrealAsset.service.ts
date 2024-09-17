import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GroupUnrealAsset } from './groupUnrealAsset.model';

@Injectable()
export class GroupUnrealAssetService {
    constructor(@InjectModel(GroupUnrealAsset) private groupUnrealAssetModel: typeof GroupUnrealAsset) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupUnrealAssetModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<GroupUnrealAsset> {
        return this.groupUnrealAssetModel.findOne({
            where: {
                unrealAssetId: id
            }
        });
    }

    async create(groupUnrealAsssetData: any): Promise<GroupUnrealAsset> {
        const groups = await this.groupUnrealAssetModel.create(groupUnrealAsssetData);
        return groups;
    }

    async update(id: string, groupUnrealAsssetData: any): Promise<GroupUnrealAsset> {
        const groups = await this.groupUnrealAssetModel.findOne({ where: { unrealAssetId: id } });
        return await groups.update(groupUnrealAsssetData);
    }

    async remove(id: string): Promise<void> {
        await this.groupUnrealAssetModel.destroy({ where: { unrealAssetId: id } });
    }
    
}

