import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Entry } from './entry.model';
import { Op, QueryTypes } from 'sequelize';
import { EntryTagService } from 'src/entryTag/entryTag.service';
import { EntryTag } from 'src/entryTag/entryTag.model';
import { EntryAttributeService } from 'src/entryAttribute/entryAttribute.service';
import { EntryAttribute } from 'src/entryAttribute/entryAttribute.model';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry) private entryModel: typeof Entry,

    @Inject(EntryTagService)
    private readonly entryTagService: EntryTagService,
    @Inject(EntryAttributeService)
    private readonly entryAttributeService: EntryAttributeService,
    @InjectModel(EntryTag) private entryTagModel: typeof EntryTag,
    @InjectModel(EntryAttribute)
    private entryAttributeModel: typeof EntryAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const entries = await this.entryModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.entryTagModel,
          attributes: ['tagId'],
        },
        {
          model: this.entryAttributeModel,
          attributes: ['attributeId'],
        },
      ],
    });
    const entryData = await this.makeEntry(entries.rows);
    return {
      data: entryData.data,
      total: entries.count,
      count: entries.count,
    };
  }

  async findAllWithoutMakeEntry(payload) {
    const { page, limit, offset } = payload;
    const entries = await this.entryModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.entryTagModel,
          attributes: ['tagId'],
        },
        {
          model: this.entryAttributeModel,
          attributes: ['attributeId'],
        },
      ],
    });
    return { data: entries.rows };
  }

  async makeEntry(entries: Entry[]) {
    if (entries.length > 0) {
      let result = [];
      for (let i = 0; i < entries.length; i++) {
        await this.entryAttributeService
          .findAllByEntry(entries[i].entryId)
          .then(async (attribute) => {
            let attributes = [];
            if (attribute.length > 0) {
              await attribute.forEach(async (ele) => {
                await attributes.push(ele);
              });
            }
            await this.entryTagService
              .findAllByEntry(entries[i].entryId)
              .then(async (tag) => {
                let tags = [];
                if (tag.length > 0) {
                  await tag.forEach(async (ele) => {
                    await tags.push(ele);
                  });
                }
                result.push({
                  entryId: entries[i].entryId,
                  textString: entries[i].textString,
                  type: entries[i].type,
                  regionId: entries[i].regionId,
                  object: entries[i].object,
                  historicdatetime: entries[i].historicdatetime,
                  summarydescription: entries[i].summarydescription,
                  possessorEntity: entries[i].possessorEntity,
                  possessorRegion: entries[i].possessorRegion,
                  possessorZone: entries[i].possessorZone,
                  possessorEntry: entries[i].possessorEntry,
                  InquiryPhases: entries[i].InquiryPhases,
                  location: entries[i].location,
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
    } else {
      return { data: [] };
    }
  }

  async findOne(id: string) {
    return await this.entryModel
      .findOne({ where: { entryId: id } })
      .then(async (entry) => {
        return await this.entryAttributeService
          .findAllByEntry(entry.entryId)
          .then(async (attribute) => {
            let attributes = [];
            let attributeIds = [];
            if (attribute) {
              await attribute.forEach((ele) => {
                attributes.push(ele);
                attributeIds.push(ele['attributeId']);
              });
            }
            return await this.entryTagService
              .findAllByEntry(entry.entryId)
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
                  entryId: entry.entryId,
                  textString: entry.textString,
                  type: entry.type,
                  regionId: entry.regionId,
                  object: entry.object,
                  historicdatetime: entry.historicdatetime,
                  summarydescription: entry.summarydescription,
                  possessorEntity: entry.possessorEntity,
                  possessorRegion: entry.possessorRegion,
                  possessorZone: entry.possessorZone,
                  possessorEntry: entry.possessorEntry,
                  InquiryPhases: entry.InquiryPhases,
                  location: entry.location,
                  tags: tag,
                  attributeId: attributeIds,
                  attributes: attributes,
                  attributeValue: attributes[0].Value,
                  tagId: tagIds,
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

  async create(entryData: any): Promise<Object> {
    try {
      if (
        entryData.possessorEntity == '' &&
        entryData.possessorEntity == null
      ) {
        entryData.possessorRegion = '';
        entryData.possessorZone = '';
      }
      const user = await this.entryModel.create({
        textString: entryData.textString,
        type: entryData.type,
        regionId: entryData.regionId,
        object: entryData.object,
        historicdatetime: entryData.historicdatetime
          .slice(0, 19)
          .replace('T', ' '),
        summarydescription: entryData.summarydescription,
        possessorEntity: entryData.possessorEntity,
        possessorRegion: entryData.possessorRegion,
        possessorZone: entryData.possessorZone,
        possessorEntry: entryData.possessorEntry,
        InquiryPhases: entryData.InquiryPhases,
        location: entryData.location,
      });

      await Promise.all(
        entryData.attributes.map(async (attribute) => {
          await this.entryAttributeModel.create({
            entryId: user.entryId,
            attributeId: attribute.attributeId,
            value: attribute.value,
          });
        }),
      ).catch(async (err) => {
        await this.entryModel.destroy({ where: { entryId: user.entryId } });
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });

      await Promise.all(
        entryData.tags.map(async (tagId) => {
          await this.entryTagModel.create({
            entryId: user.entryId,
            tagId: tagId,
          });
        }),
      ).catch(async (err) => {
        await this.entryAttributeModel.destroy({
          where: { entryId: user.entryId },
        });
        await this.entryModel.destroy({ where: { entryId: user.entryId } });
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });

      const attributes = await this.entryAttributeModel.findAll({
        where: { entryId: user.entryId },
      });

      const tags = await this.entryTagModel.findAll({
        where: { entryId: user.entryId },
      });

      const response = {
        data: [
          {
            entryId: user.entryId,
            textString: user.textString,
            type: user.type,
            regionId: user.regionId,
            object: user.object,
            historicdatetime: user.historicdatetime,
            summarydescription: user.summarydescription,
            possessorEntity: user.possessorEntity,
            possessorRegion: user.possessorRegion,
            possessorZone: user.possessorZone,
            possessorEntry: user.possessorEntry,
            InquiryPhases: user.InquiryPhases,
            location: user.location,
            attributes: attributes.map((attribute) => ({
              attributeId: attribute.attributeId,
              entryId: attribute.entryId,
              Value: attribute.value,
            })),
            tags: tags.map((tag) => ({
              tagId: tag.tagId,
              entryId: tag.entryId,
            })),
          },
        ],
      };

      return response;
    } catch (error) {
      console.log(error, 'error');
      return error.message;
    }
  }

  async update(id: string, entryData: any): Promise<Object> {
    const user = await this.entryModel.findOne({ where: { entryId: id } });
    if (entryData.possessorEntity == '' && entryData.possessorEntity == null) {
      entryData.possessorRegion = '';
      entryData.possessorZone = '';
    }
    // await this.entryTagService
    //   .remove(id)
    //   .then(async () => {
    //     await this.entryTagService.create(id, entryData.tagId);
    //   })
    //   .catch((err) => {
    //     return err;
    //   });
    await this.entryTagModel.destroy({ where: { entryId: id } });
    await this.entryAttributeModel.destroy({ where: { entryId: id } });

    await Promise.all(
      entryData.tags.map(async (tagId) => {
        await this.entryTagModel.create({
          entryId: id,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    await Promise.all(
      entryData.attributes.map(async (attribute) => {
        await this.entryAttributeModel.create({
          entryId: id,
          attributeId: attribute.attributeId,
          value: attribute.value,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const attributes = await this.entryAttributeModel.findAll({
      where: { entryId: id },
    });

    const tags = await this.entryTagModel.findAll({
      where: { entryId: id },
    });

    const updatedEntry = await user.update({
      textString: entryData.textString,
      type: entryData.type,
      regionId: entryData.regionId,
      object: entryData.object,
      historicdatetime: entryData.historicdatetime
        ? entryData.historicdatetime.slice(0, 19).replace('T', ' ')
        : entryData.historicdatetime,
      summarydescription: entryData.summarydescription,
      possessorEntity: entryData.possessorEntity,
      possessorRegion: entryData.possessorRegion,
      possessorZone: entryData.possessorZone,
      possessorEntry: entryData.possessorEntry,
      InquiryPhases: entryData.InquiryPhases,
      location: entryData.location,
    });

    const response = {
      data: [
        {
          entryId: updatedEntry.entryId,
          textString: updatedEntry.textString,
          type: updatedEntry.type,
          regionId: updatedEntry.regionId,
          object: updatedEntry.object,
          historicdatetime: updatedEntry.historicdatetime,
          summarydescription: updatedEntry.summarydescription,
          possessorEntity: updatedEntry.possessorEntity,
          possessorRegion: updatedEntry.possessorRegion,
          possessorZone: updatedEntry.possessorZone,
          possessorEntry: updatedEntry.possessorEntry,
          InquiryPhases: updatedEntry.InquiryPhases,
          location: updatedEntry.location,
          attributes: attributes.map((attribute) => ({
            attributeId: attribute.attributeId,
            entryId: attribute.entryId,
            Value: attribute.value,
          })),
          tags: tags.map((tag) => ({
            tagId: tag.tagId,
            entryId: tag.entryId,
          })),
        },
      ],
    };

    return response;
  }

  async remove(id: string): Promise<void> {
    await this.entryTagModel.destroy({ where: { entryId: id } });
    await this.entryAttributeModel.destroy({ where: { entryId: id } });
    await this.entryModel.destroy({ where: { entryId: id } });
  }

  async searchByZone(possessorZone: string) {
    let zone = possessorZone ? possessorZone : '';
    const entries = await this.entryModel.findAndCountAll({
      where: {
        possessorZone: zone,
      },
    });
    return await this.makeEntry(entries.rows);
  }

  async searchByRegion(regionId: string) {
    let region = regionId ? regionId : '';
    const entries = await this.entryModel.findAll({
      where: {
        possessorRegion: region,
      },
    });
    return await this.makeEntry(entries);
  }

  async searchByType(type: string) {
    let typeId = type ? type : '';
    const entries = await this.entryModel.findAll({
      where: {
        type: typeId,
      },
    });
    return await this.makeEntry(entries);
  }

  async searchBytextString(payload: { textString: string }) {
    let { textString } = payload;
    console.log('text', textString);
    const entries = await this.entryModel.findAll({
      where: {
        textString: textString,
      },
    });
    return await this.makeEntry(entries);
  }

  async SearchByPossessorEntity(possessorEntity: string) {
    let entity = possessorEntity ? possessorEntity : '';
    const entries = await this.entryModel.findAll({
      where: {
        possessorEntity: entity,
      },
    });
    return await this.makeEntry(entries);
  }

  async SearchByPossessorEntry(possessorEntry: string) {
    let entry = possessorEntry ? possessorEntry : '';
    const entries = await this.entryModel.findAll({
      where: {
        possessorEntry: entry,
      },
    });
    return await this.makeEntry(entries);
  }

  async SearchByPossessorRegion(possessorRegion: string) {
    let region = possessorRegion ? possessorRegion : '';
    const entries = await this.entryModel.findAll({
      where: {
        possessorRegion: region,
      },
    });
    return await this.makeEntry(entries);
  }

  async SearchByPossessorZone(possessorZone: string) {
    const entries = await this.entryModel.findAll({
      where: {
        possessorZone: possessorZone,
      },
    });
    return this.makeEntry(entries);
  }

  async search(keyword: string) {
    const entries = await this.entryModel.findAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
    });
    return this.makeEntry(entries);
  }

  async searchByObject(object: string, keyword: string) {
    const entries = await this.entryModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { object: { [Op.like]: `%${object}%` } },
              { object: null },
            ],
          },
          {
            textString: {
              [Op.like]: `%${keyword}%`, // Correct the use of percentage signs
            },
          },
        ],
      },
    });
    return this.makeEntry(entries);
  }

  async searchEntity(type: string, keyword: string) {
    const entry = await this.entryModel.sequelize.query(
      `select a.entryId as id from Entries as a left join Types as b on a.type = b.typeId where b.textString like '%%${
        type ? type : ''
      }%%' and a.textString like '%%${keyword ? keyword : ''}%%' limit 1`,
      { type: QueryTypes.SELECT },
    );
    if (entry[0]) {
      return this.findOne(entry[0]['id']);
    } else {
      return {};
    }
  }

  async searchByEntity(entity: string, keyword: string) {
    const entry = await this.entryModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { possessorEntity: { [Op.like]: `%${entity}%` } },
              { possessorEntity: null },
            ],
          },
          {
            textString: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    });
    return this.makeEntry(entry);
    // if (entry) {
    //   return this.findOne(entry.entryId);
    // } else {
    //   return {};
    // }
  }
}
