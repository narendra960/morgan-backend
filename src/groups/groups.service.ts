import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Groups } from './groups.model';
import { GroupAttribute } from 'src/groupAttribute/groupAttribute.model';
import { GroupAttributeService } from 'src/groupAttribute/groupAttribute.service';
import { GroupTagsService } from 'src/groupTags/groupTags.service';
import { GroupTags } from 'src/groupTags/groupTags.model';
import { QueryTypes } from 'sequelize';

@Injectable()
export class GroupsService {
    constructor(@InjectModel(Groups) private groupsModel: typeof Groups,
        @InjectModel(GroupAttribute) private groupsAttributeModel: typeof GroupAttribute,
        @Inject(GroupAttributeService) private readonly groupAttributeService: GroupAttributeService,
        @Inject(GroupTagsService) private readonly groupTagService: GroupTagsService,
        @InjectModel(GroupTags) private groupTagModel: typeof GroupTags) { }

    async findAll(payload) {
        const { page, limit, offset } = payload;
        const types = await this.groupsModel.findAndCountAll({
            limit: Number(limit) ? Number(limit) : 100,
            offset: Number(offset) ? Number(offset) : 0,
            include: [
                {
                    model: this.groupsAttributeModel,
                    attributes: ['attributesId']
                },
                {
                    model: this.groupTagModel,
                    attributes: ['tagsId']
                }
            ]
        });
        const typesData = await this.makeEntry(types.rows);
        return {
          data: typesData.data,
          total: types.count,
          count: types.count,
        };

    }

    async findOne(id: string): Promise<Groups> {
        return await this.groupsModel
            .findOne({ where: { groupId: id } })
            .then(async (group) => {
                return await this.groupAttributeService
                    .findAllByGroup(group.groupId)
                    .then(async (attribute) => {
                        let attributes = [];
                        let attributeIds = [];
                        if (attribute) {
                            await attribute.forEach((ele) => {
                                attributes.push(ele);
                                attributeIds.push(ele['attributeId'])
                            });
                        }
                        return await this.groupTagService
                            .findAllByGroup(group.groupId)
                            .then(async (tags) => {
                                let tag = [];
                                let tagIds = [];
                                if (tags) {
                                    await tags.forEach((ele) => {
                                        tagIds.push(ele['tagId']);
                                        tag.push(ele);
                                    });
                                }
                                return {
                                    groupId: group.groupId,
                                    groupName: group.groupName,
                                    groupType: group.groupType,
                                    groupDescription: group.groupDescription,
                                    attributeId: attributeIds,
                                    attributes: attributes,
                                    tagId: tagIds,
                                    tags: tags,
                                    attributeValue: attributes[0].value,
                                };
                            })
                            .catch((err) => {
                                return err;
                            });
                    })
                    .catch((err) => {
                        return err;
                    });
            })
            .catch((err) => {
                return err;
            });
    }

    async create(groupsData: any): Promise<Groups> {
        const groups = await this.groupsModel.create({
            groupName: groupsData.groupName,
            groupDescription: groupsData.groupDescription,
            groupType: groupsData.groupType
        });

        await Promise.all(
            groupsData.attributes.map(async attribute => {
                await this.groupsAttributeModel.create({
                    groupId: groups.groupId,
                    attributesId: attribute.attributeId,
                    value: attribute.value
                })
            })
        ).catch(async err => {
            await this.groupsModel.destroy({ where: { groupId: groups.groupId } })
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        })

        await Promise.all(
            groupsData.tags.map(async tagId => {
                await this.groupTagModel.create({
                    groupId: groups.groupId,
                    tagsId: tagId
                })
            })
        ).catch(async err => {
            await this.groupsModel.destroy({ where: { groupId: groups.groupId } })
            await this.groupsAttributeModel.destroy({ where: { groupId: groups.groupId } })
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        })

        return groups;
    }

    async update(id: string, groupsData: any): Promise<Groups> {
        const groups = await this.groupsModel.findOne({ where: { groupId: id } });
        await this.groupTagModel.destroy({ where: { groupId: id } });
        await this.groupsAttributeModel.destroy({ where: { groupId: id } });


        await Promise.all(
            groupsData.attributes.map(async attribute => {
                await this.groupsAttributeModel.create({
                    groupId: id,
                    attributesId: attribute.attributeId,
                    value: attribute.value
                })
            })
        ).catch(async err => {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        })

        await Promise.all(
            groupsData.tags.map(async tagId => {
                await this.groupTagModel.create({
                    groupId: id,
                    tagsId: tagId
                })
            })
        ).catch(async err => {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        })
        return await groups.update({
            groupName: groupsData.groupName,
            groupDescription: groupsData.groupDescription,
            groupType: groupsData.groupType
        });
    }

    async remove(id: string): Promise<void> {
        await this.groupTagModel.destroy({ where: { groupId: id } });
        await this.groupsAttributeModel.destroy({ where: { groupId: id } });
        await this.groupsModel.destroy({ where: { groupId: id } });
    }

    async search(keyword: string): Promise<Groups[]> {
        return await this.groupsModel.findAll({
            where: {
                [Op.or]: [
                    {
                        groupName: {
                            [Op.like]: `%${keyword}%`
                        }
                    },
                    {
                        groupDescription: {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                ]
            }
        });
    }

    async makeEntry(groups: Groups[]) {
        let result = [];
        for (let i = 0; i < groups.length; i++) {
            await this.groupAttributeService
                .findAllByGroup(groups[i].groupId)
                .then(async (attribute) => {
                    let attributes = [];
                    let attributeIds = [];
                    if (attribute.length > 0) {
                        await attribute.forEach((ele) => {
                            attributes.push(ele);
                            attributeIds.push(ele['attributeId'])
                        });
                    }
                    await this.groupTagService
                        .findAllByGroup(groups[i].groupId)
                        .then(async (tag) => {
                            let tags = [];
                            let tagIds = [];
                            if (tag.length > 0) {
                                await tag.forEach((ele) => {
                                    tags.push(ele);
                                    tagIds.push(ele['tagId'])
                                });
                            }
                            result.push({
                                groupId: groups[i].groupId,
                                groupName: groups[i].groupName,
                                groupType: groups[i].groupType,
                                groupDescription: groups[i].groupDescription,
                                attributes: attribute,
                                tags: tags,
                            });
                        })
                        .catch((err) => {
                            return err;
                        });
                })
                .catch((err) => {
                    return err;
                });
        }
        return { data: result };
    }

    async findAllByChannel(channelId: string) {
        return this.groupsModel.sequelize.query(`
            select g.groupId, g.groupName, g.groupDescription from \`Groups\` g LEFT JOIN Channels c on g.groupId = c.groupId
            where c.groupId = '${channelId}'`, { type: QueryTypes.SELECT })
    }
}

