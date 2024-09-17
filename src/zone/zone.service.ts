import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ZoneAttributeService } from 'src/zoneAttribute/zoneAttribute.service';
import { ZoneTag } from 'src/zoneTag/zoneTag.model';
import { ZoneTagService } from 'src/zoneTag/zoneTag.service';
import { Zone } from './zone.model';
import { ZoneAttribute } from 'src/zoneAttribute/zoneAttribute.model';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(Zone) private zoneModel: typeof Zone,
    @Inject(ZoneTagService)
    private readonly zoneTagService: ZoneTagService,
    @Inject(ZoneAttributeService)
    private readonly zoneAttributeService: ZoneAttributeService,
    @InjectModel(ZoneTag) private zoneTagModel: typeof ZoneTag,
    @InjectModel(ZoneAttribute)
    private zoneAttributeModel: typeof ZoneAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const zones = await this.zoneModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.zoneTagModel,
          attributes: ['tagId'],
        },
        {
          model: this.zoneAttributeModel,
          attributes: ['attributeId'],
        },
      ],
    });
    console.log('================================', zones);
    const zoneData = await this.makeEntry(zones.rows);
    return {
      data: zoneData.data,
      total: zones.count,
      count: zones.count,
    };
  }

  async findAllWithoutMakeEntry(payload) {
    const { page, limit, offset } = payload;
    const zones = await this.zoneModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: zones.rows };
  }

  async makeEntry(zones: Zone[]) {
    let result = [];
    for (let i = 0; i < zones.length; i++) {
      await this.zoneAttributeService
        .findAllByZone(zones[i].zoneId)
        .then(async (attribute) => {
          let attributes = [];
          if (attribute.length > 0) {
            await attribute.forEach((ele) => {
              attributes.push(ele);
            });
          }
          await this.zoneTagService
            .findAll(zones[i].zoneId)
            .then(async (tag) => {
              let tags = [];
              if (tag.length > 0) {
                await tag.forEach((ele) => {
                  tags.push(ele);
                });
              }
              result.push({
                zoneId: zones[i].zoneId,
                textString: zones[i].textString,
                type: zones[i].type,
                mapArrayList: zones[i].mapArrayList,
                attributes: attributes,
                InquiryPhases: zones[i].InquiryPhases,
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

  async findOne(id: string) {
    return await this.zoneModel
      .findOne({ where: { zoneId: id } })
      .then(async (zone) => {
        return await this.zoneAttributeService
          .findAllByZone(zone.zoneId)
          .then(async (attribute) => {
            let attributes = [];
            let attributeIds = [];
            if (attribute) {
              await attribute.forEach((ele) => {
                attributes.push(ele);
                attributeIds.push(ele['attributeId']);
              });
            }
            return await this.zoneTagService
              .findAll(zone.zoneId)
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
                  zoneId: zone.zoneId,
                  textString: zone.textString,
                  type: zone.type,
                  mapArrayList: zone.mapArrayList,
                  attributeValue: attributes[0].Value,
                  attributes: attributes,
                  attributeId: attributeIds,
                  InquiryPhases: zone.InquiryPhases,
                  tagId: tagIds,
                  tags: tags,
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

  async create(zoneData: any): Promise<Object> {
    const user = await this.zoneModel.create({
      textString: zoneData.textString,
      type: zoneData.type,
      mapArrayList: zoneData.mapArrayList,
      InquiryPhases: zoneData.InquiryPhases,
    });

    await Promise.all(
      zoneData.attributes.map(async (attribute) => {
        await this.zoneAttributeModel.create({
          zoneId: user.zoneId,
          attributeId: attribute.attributeId,
          value: attribute.value,
        });
      }),
    ).catch(async (err) => {
      await this.zoneModel.destroy({ where: { zoneId: user.zoneId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    await Promise.all(
      zoneData.tags.map(async (tagId) => {
        await this.zoneTagModel.create({
          zoneId: user.zoneId,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      await this.zoneModel.destroy({ where: { zoneId: user.zoneId } });
      await this.zoneAttributeModel.destroy({ where: { zoneId: user.zoneId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const attributes = await this.zoneAttributeModel.findAll({
      where: { zoneId: user.zoneId },
    });

    const tags = await this.zoneTagModel.findAll({
      where: { zoneId: user.zoneId },
    });

    const response = {
      data: [
        {
          zoneId: user.zoneId,
          textString: user.textString,
          type: user.type,
          mapArrayList: user.mapArrayList,
          attributes: attributes.map((attribute) => ({
            attributeId: attribute.attributeId,
            zoneId: attribute.zoneId,
            Value: attribute.value,
          })),
          tags: tags.map((tag) => ({
            tagId: tag.tagId,
            zoneId: tag.zoneId,
          })),
        },
      ],
    };

    return response;
  }

  async update(id: string, zoneData: any): Promise<Object> {
    const user = await this.zoneModel.findOne({ where: { zoneId: id } });
    await this.zoneTagModel.destroy({ where: { zoneId: id } });
    await this.zoneAttributeModel.destroy({ where: { zoneId: id } });

    await Promise.all(
      zoneData.tags.map(async (tagId) => {
        await this.zoneTagModel.create({
          zoneId: id,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    await Promise.all(
      zoneData.attributes.map(async (attribute) => {
        await this.zoneAttributeModel.create({
          zoneId: id,
          attributeId: attribute.attributeId,
          value: attribute.value,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const attributes = await this.zoneAttributeModel.findAll({
      where: { zoneId: id },
    });

    const tags = await this.zoneTagModel.findAll({
      where: { zoneId: id },
    });

    const updatedZone = await user.update({
      textString: zoneData.textString,
      type: zoneData.type,
      mapArrayList: zoneData.mapArrayList,
      InquiryPhases: zoneData.InquiryPhases,
    });

    const response = {
      data: [
        {
          zoneId: updatedZone.zoneId,
          textString: updatedZone.textString,
          type: updatedZone.type,
          InquiryPhases: updatedZone.InquiryPhases,
          mapArrayList: updatedZone.mapArrayList,
          attributes: attributes.map((attribute) => ({
            attributeId: attribute.attributeId,
            zoneId: attribute.zoneId,
            Value: attribute.value,
          })),
          tags: tags.map((tag) => ({
            tagId: tag.tagId,
            zoneId: tag.zoneId,
          })),
        },
      ],
    };

    return response;
  }

  async remove(id: string): Promise<void> {
    await this.zoneTagService.remove(id);
    await this.zoneAttributeService.remove(id);
    await this.zoneModel.destroy({ where: { zoneId: id } });
  }

  async search(keyword: string) {
    const result = await this.zoneModel.findAndCountAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
      include: [
        {
          model: this.zoneTagModel,
          attributes: ['tagId'],
        },
        {
          model: this.zoneAttributeModel,
          attributes: ['attributeId'],
        },
      ],
    });
    return await this.makeEntry(result.rows);
  }
}
