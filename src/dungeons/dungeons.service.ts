import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dungeons } from './dungeons.model';
import { Groups } from "../groups/groups.model"
import { Sequelize, QueryTypes } from "sequelize"
import { Type } from 'src/type/type.model';
import { DungeonTagsService } from 'src/dungeonTags/dungeonTags.service';
import { DungeonAttributeService } from 'src/dungeonAttribute/dungeonAttribute.service';
import { DungeonTags } from 'src/dungeonTags/dungeonTags.model';
import { DungeonAttribute } from 'src/dungeonAttribute/dungeonAttribute.model';

@Injectable()
export class DungeonsService {
  constructor(@InjectModel(Dungeons) private dungeonsModel: typeof Dungeons,
    @Inject(DungeonTagsService)
    private readonly dungeonTagService: DungeonTagsService,
    @Inject(DungeonAttributeService)
    private readonly dungeonAttributeService: DungeonAttributeService,
    @InjectModel(DungeonTags) private readonly dungeonTagModel: typeof DungeonTags,
    @InjectModel(DungeonAttribute) private dungeonAttributeModel: typeof DungeonAttribute
  ) { }

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.dungeonsModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    const dungeonsData = await this.makeEntry(types.rows)
    return {
      data: dungeonsData.data,
      total: types.count,
      count: types.count,
    };
  }

  async makeEntry(dungeons: Dungeons[]) {
    let result = [];
    for (let i = 0; i < dungeons.length; i++) {
      await this.dungeonAttributeService
        .findAllByDungeon(dungeons[i].dungeonsId)
        .then(async (attribute) => {
          let attributes = [];
          if (attribute.length > 0) {
            await attribute.forEach((ele) => {
              attributes.push(ele);
            });
          }
          await this.dungeonTagService
            .findAllByDungeon(dungeons[i].dungeonsId)
            .then(async (tag) => {
              let tags = [];
              if (tag.length > 0) {
                await tag.forEach((ele) => {
                  tags.push(ele);
                });
              }
              result.push({
                dungeonsId: dungeons[i].dungeonsId,
                mapId: dungeons[i].mapId,
                type: dungeons[i].type,
                groupId: dungeons[i].groupId,
                dungeonName: dungeons[i].dungeonName,
                dungeonDescription: dungeons[i].dungeonDescription,
                dungeonUrl: dungeons[i].dungeonUrl,
                attributes: attribute,
                tags: tags,
                tier: dungeons[i].tier,
              });
            })
            .catch((err) => {
              return err;
            });
        })
        .catch((err) => {
          console.log(err, "err")
          return err;
        });
    }
    return { data: result };
  }

  async findOne(id: string): Promise<Dungeons> {
    return await this.dungeonsModel
      .findOne({ where: { dungeonsId: id } })
      .then(async (dungeons) => {
        return await this.dungeonAttributeService
          .findAllByDungeon(dungeons.dungeonsId)
          .then(async (attribute) => {
            let attributes = [];
            let attributeIds = [];
            if (attribute) {
              await attribute.forEach((ele) => {
                attributes.push(ele);
                attributeIds.push(ele['attributeId'])
              });
            }
            return await this.dungeonTagService
              .findAllByDungeon(dungeons.dungeonsId)
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
                  dungeonsId: dungeons.dungeonsId,
                  mapId: dungeons.mapId,
                  type: dungeons.type,
                  groupId: dungeons.groupId,
                  dungeonName: dungeons.dungeonName,
                  dungeonDescription: dungeons.dungeonDescription,
                  dungeonUrl: dungeons.dungeonUrl,
                  tier: dungeons.tier,
                  tags: tag,
                  attributeId: attributeIds,
                  attributes: attributes,
                  tagId: tagIds,
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

  async create(dungeonsData: any): Promise<Object> {
    const rawQuery = "select groupId from `Groups` g LEFT JOIN Types t on g.groupType=t.typeId where t.textString IN('Culture','Monster')"
    const groupIds = await this.dungeonsModel.sequelize.query(rawQuery, {
      type: QueryTypes.SELECT,
    });

    if (groupIds.length == 0) {
      throw new HttpException("You should at least have a group which has a Culture or Monster type", HttpStatus.BAD_REQUEST);
    }
    const randomIndex = Math.floor(Math.random() * groupIds.length);

    const groupId: any = groupIds[randomIndex];

    const dungeons = await this.dungeonsModel.create({
      groupId: groupId.groupId,
      type: dungeonsData.type,
      mapId: dungeonsData.mapId,
      dungeonName: dungeonsData.dungeonName,
      dungeonDescription: dungeonsData.dungeonDescription,
      dungeonUrl: dungeonsData.dungeonUrl,
      tier: dungeonsData.tier
    });

    const attributes = await Promise.all(
      dungeonsData.attributes.map(async (attribute) => {
        const dungeonAttribute = await this.dungeonAttributeModel.create({
          dungeonsId: dungeons.dungeonsId,
          attributesId: attribute.attributeId,
          value: attribute.value
        });
        return {
          dungeonsId: dungeonAttribute.dungeonsId,
          attributeId: attribute.attributeId,
          value: dungeonAttribute.value
        };
      })
    ).catch(async err => {
      await this.dungeonsModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    })

    const tags = await Promise.all(
      dungeonsData.tags.map(async (tagId) => {
        const dungeonTag = await this.dungeonTagModel.create({
          dungeonsId: dungeons.dungeonsId,
          tagsId: tagId
        });
        return {
          dungeonsId: dungeonTag.dungeonsId,
          tagId: tagId
        };
      })
    ).catch(async err => {
      await this.dungeonsModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      await this.dungeonAttributeModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    })
    const response = {
      data: [
        {
          dungeonsId: dungeons.dungeonsId,
          mapId: dungeons.mapId,
          type: dungeons.type,
          groupId: dungeons.groupId,
          dungeonName: dungeons.dungeonName,
          dungeonDescription: dungeons.dungeonDescription,
          dungeonUrl: dungeons.dungeonUrl,
          attributes: attributes,
          tags: tags,
          tier: dungeons.tier
        }
      ]
    };
  
    return response;
  }

  async update(id: string, dungeonsData: any): Promise<Object> {
    const dungeons = await this.dungeonsModel.findOne({ where: { dungeonsId: id } });
    await this.dungeonTagModel.destroy({ where: { dungeonsId: id } });
    await this.dungeonAttributeModel.destroy({ where: { dungeonsId: id } });

    await Promise.all(
      dungeonsData.attributes.map(async (attribute) => {
        await this.dungeonAttributeModel.create({
          dungeonsId: id,
          attributesId: attribute.attributeId,
          value: attribute.value
        })
      })
    ).catch(async err => {
      await this.dungeonsModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    })

    await Promise.all(
      dungeonsData.tags.map(async (tagId) => {
        await this.dungeonTagModel.create({
          dungeonsId: id,
          tagsId: tagId
        })
      })
    ).catch(async err => {
      await this.dungeonsModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      await this.dungeonAttributeModel.destroy({ where: { dungeonsId: dungeons.dungeonsId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    })

    const attributes = await this.dungeonAttributeModel.findAll({ where: { dungeonsId: id } });
    const tags = await this.dungeonTagModel.findAll({ where: { dungeonsId: id } });

    const updatedDungeon = await dungeons.update({
      type: dungeonsData.type,
      mapId: dungeonsData.mapId,
      dungeonName: dungeonsData.dungeonName,
      dungeonDescription: dungeonsData.dungeonDescription,
      dungeonUrl: dungeonsData.dungeonUrl,
      tier: dungeonsData.tier
    });

    const response = {
      data: [
        {
          dungeonsId: updatedDungeon.dungeonsId,
          mapId: updatedDungeon.mapId,
          type: updatedDungeon.type,
          groupId: updatedDungeon.groupId,
          dungeonName: updatedDungeon.dungeonName,
          dungeonDescription: updatedDungeon.dungeonDescription,
          dungeonUrl: updatedDungeon.dungeonUrl,
          attributes: attributes.map(attribute => ({
            dungeonsId: attribute.dungeonsId,
            attributeId: attribute.attributeId,
            value: attribute.value
          })),
          tags: tags.map(tag => ({
            dungeonsId: tag.dungeonsId,
            tagId: tag.tagId
          })),
          tier: updatedDungeon.tier
        }
      ]
    };
  
    return response;
  }

  async remove(id: string): Promise<void> {
    await this.dungeonTagModel.destroy({ where: { dungeonsId: id } });
    await this.dungeonAttributeModel.destroy({ where: { dungeonsId: id } });
    await this.dungeonsModel.destroy({ where: { dungeonsId: id } });
  }
}
