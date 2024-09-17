import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GroupTags } from './groupTags.model';
import { QueryTypes } from 'sequelize';

@Injectable()
export class GroupTagsService {
    constructor(@InjectModel(GroupTags) private groupTagsModel: typeof GroupTags) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupTagsModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
        });
        return { data: types.rows, total: types.count, count: types.count };
    }

    async findOne(id: string): Promise<GroupTags> {
        return this.groupTagsModel.findOne({
            where: {
                tagId: id
            }
        });
    }

    async create(groupTagData: any): Promise<GroupTags> {
        const groupTag = await this.groupTagsModel.create(groupTagData);
        return groupTag;
    }

    async update(id: string, groupTagData: any): Promise<GroupTags> {
        const groupTag = await this.groupTagsModel.findOne({ where: { tagId: id } });
        return await groupTag.update(groupTagData);
    }

    async remove(id: string): Promise<void> {
        await this.groupTagsModel.destroy({ where: { tagId: id } });
    }

    async findAllByGroup(groupId) {
        return this.groupTagsModel.sequelize.query(
            `select t.tagId, t.tagString from GroupTags as gt left join Tags as t on gt.tagsId = t.tagId where gt.groupId = '${groupId}'`,
            { type: QueryTypes.SELECT }
        )
    }
}

