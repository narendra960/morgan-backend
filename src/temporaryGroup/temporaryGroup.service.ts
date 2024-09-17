import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TemporaryGroup } from './temporaryGroup.model';

@Injectable()
@Injectable()
export class TemporaryGroupService {
    constructor(@InjectModel(TemporaryGroup) private groupTemporaryModel: typeof TemporaryGroup) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupTemporaryModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<TemporaryGroup> {
        return this.groupTemporaryModel.findOne({
            where: {
                groupTempId: id
            }
        });
    }

    async create(temporaryGroupData: any): Promise<TemporaryGroup> {
        const temporaryGroup = await this.groupTemporaryModel.create(temporaryGroupData);
        return temporaryGroup;
    }

    async update(id: string, temporaryGroupData: any): Promise<TemporaryGroup> {
        const temporaryGroup = await this.groupTemporaryModel.findOne({ where: { groupTempId: id } });
        return await temporaryGroup.update(temporaryGroupData);
    }

    async remove(id: string): Promise<void> {
        await this.groupTemporaryModel.destroy({ where: { groupTempId: id } });
    }
    
}

