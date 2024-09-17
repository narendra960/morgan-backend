import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { GroupAttribute } from './groupAttribute.model';

@Injectable()
export class GroupAttributeService {
    constructor(@InjectModel(GroupAttribute) private groupAttributeModel: typeof GroupAttribute) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupAttributeModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<GroupAttribute> {
        return this.groupAttributeModel.findOne({
            where: {
                attributeId: id
            }
        });
    }

    async create(groupAttributeData: any): Promise<GroupAttribute> {
        const groupAttribute = await this.groupAttributeModel.create(groupAttributeData);
        return groupAttribute;
    }

    async update(id: string, groupAttributeData: any): Promise<GroupAttribute> {
        const groupAttribute = await this.groupAttributeModel.findOne({ where: { attributeId: id } });
        return await groupAttribute.update(groupAttributeData);
    }

    async remove(id: string): Promise<void> {
        await this.groupAttributeModel.destroy({ where: { attributeId: id } });
    }
    
    async findAllByGroup(groupId: string) {
        return this.groupAttributeModel.sequelize.query(
            `SELECT
            a.attributeId,
            a.attributeName,
            ga.value
            FROM
            GroupAttributes as ga
            LEFT JOIN Attributes AS a ON ga.attributesId = a.attributeId
            WHERE
            ga.groupId = '${groupId}'`,
            { type: QueryTypes.SELECT }
        )
    }
}

