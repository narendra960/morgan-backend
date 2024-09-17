import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GroupAffiliation } from './groupAffiliation.model';

@Injectable()
export class GroupAffiliationService {
    constructor(@InjectModel(GroupAffiliation) private groupAffiliationModel: typeof GroupAffiliation) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupAffiliationModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<GroupAffiliation> {
        return this.groupAffiliationModel.findOne({
            where: {
                affiliatedGroupId: id
            }
        });
    }

    async create(groupAffiliationData: any): Promise<GroupAffiliation> {
        const groupAffiliation = await this.groupAffiliationModel.create(groupAffiliationData);
        return groupAffiliation;
    }

    async update(id: string, groupAffiliationData: any): Promise<GroupAffiliation> {
        const groupAffiliation = await this.groupAffiliationModel.findOne({ where: { affiliatedGroupId: id } });
        return await groupAffiliation.update(groupAffiliationData);
    }

    async remove(id: string): Promise<void> {
        await this.groupAffiliationModel.destroy({ where: { affiliatedGroupId: id } });
    }
}

