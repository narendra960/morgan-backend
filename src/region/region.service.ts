import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { RegionAttributeService } from 'src/regionAttribute/regionAttribute.service';
import { RegionTag } from 'src/regionTag/regionTag.model';
import { RegionTagService } from 'src/regionTag/regionTag.service';
import { Region } from './region.model';
import { RegionAttribute } from 'src/regionAttribute/regionAttribute.model';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @Inject(RegionTagService)
    private readonly regionTagService: RegionTagService,
    @Inject(RegionAttributeService)
    private readonly regionAttributeService: RegionAttributeService,
    @InjectModel(RegionTag) private regionTagModel: typeof RegionTag,
    @InjectModel(RegionAttribute)
    private regionAttributeModel: typeof RegionAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const regions = await this.regionModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 10,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.regionTagModel,
          attributes: ['tagId'],
        },
        {
          model: this.regionAttributeModel,
          attributes: ['attributeId'],
        },
      ],
    });
    const regionData = await this.makeEntry(regions.rows);
    return {
      data: regionData.data,
      total: regions.count,
      count: regions.count,
    };
  }

  async findAllWithoutMakeEntry(payload) {
    const { page, limit, offset } = payload;
    const regions = await this.regionModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 10,
      offset: Number(offset) ? Number(offset) : 0,
      include: [
        {
          model: this.regionTagModel,
          attributes: ['tagId'],
        },
      ],
    });
    return { data: regions.rows };
  }

  async makeEntry(regions: Region[]) {
    if (regions.length > 0) {
      let result = [];
      for (let i = 0; i < regions.length; i++) {
        await this.regionAttributeService
          .findAllByRegion(regions[i].regionId)
          .then(async (attribute) => {
            let attributes = [];
            if (attribute.length > 0) {
              await attribute.forEach((ele) => {
                attributes.push(ele);
              });
            }
            await this.regionTagService
              .findAllByRegion(regions[i].regionId)
              .then(async (tag) => {
                let tags = [];
                if (tag.length > 0) {
                  await tag.forEach(async (ele) => {
                    await tags.push(ele);
                  });
                }
                result.push({
                  regionId: regions[i].regionId,
                  textString: regions[i].textString,
                  type: regions[i].type,
                  regionDimensions: regions[i].regionDimensions,
                  regionWorldPosition: regions[i].regionWorldPosition,
                  possessingZone: regions[i].possessingZone,
                  possessorMap: regions[i].possessorMap,
                  InquiryPhases: regions[i].InquiryPhases,
                  attributes: attributes,
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
    return await this.regionModel
      .findOne({ where: { regionId: id } })
      .then(async (region) => {
        return await this.regionAttributeService
          .findAllByRegion(region.regionId)
          .then(async (attribute) => {
            let attributes = [];
            let attributeIds = [];
            if (attribute) {
              await attribute.forEach((ele) => {
                attributes.push(ele);
                attributeIds.push(ele['attributeId']);
              });
            }
            return await this.regionTagService
              .findAllByRegion(region.regionId)
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
                  regionId: region.regionId,
                  textString: region.textString,
                  type: region.type,
                  regionDimensions: region.regionDimensions,
                  regionWorldPosition: region.regionWorldPosition,
                  possessingZone: region.possessingZone,
                  possessorMap: region.possessorMap,
                  InquiryPhases: region.InquiryPhases,
                  attributeId: attributeIds,
                  attributes: attributes,
                  tags: tag,
                  tagId: tagIds,
                  attributeValue: attributes[0].Value,
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

  async create(regionData: any): Promise<Object> {
    const user = await this.regionModel.create({
      textString: regionData.textString,
      type: regionData.type,
      regionDimensions: regionData.regionDimensions,
      regionWorldPosition: regionData.regionWorldPosition,
      possessingZone: regionData.possessingZone,
      possessorMap: regionData.possessorMap,
      InquiryPhases: regionData.InquiryPhases,
    });

    const attributes = await Promise.all(
      regionData.attributes.map(async (attribute) => {
        const regionAttribute = await this.regionAttributeModel.create({
          regionId: user.regionId,
          attributeId: attribute.attributeId,
          value: attribute.value,
        });

        const attributeData = {
          regionId: user.regionId,
          attributeId: attribute.attributeId,
          value: attribute.value,
        };
        return attributeData;
      }),
    ).catch(async (err) => {
      await this.regionModel.destroy({ where: { regionId: user.regionId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const tags = await Promise.all(
      regionData.tags.map(async (tagId) => {
        const regionTag = await this.regionTagModel.create({
          regionId: user.regionId,
          tagId: tagId,
        });
        const tagData = {
          regionId: user.regionId,
          tagId: tagId,
        };
        return tagData;
      }),
    ).catch(async (err) => {
      await this.regionModel.destroy({ where: { regionId: user.regionId } });
      await this.regionAttributeModel.destroy({
        where: { regionId: user.regionId },
      });
    });

    const response = {
      data: [
        {
          regionId: user.regionId,
          textString: user.textString,
          type: user.type,
          regionDimensions: user.regionDimensions,
          regionWorldPosition: user.regionWorldPosition,
          possessingZone: user.possessingZone,
          possessorMap: user.possessorMap,
          InquiryPhases: user.InquiryPhases,
          attributes: attributes,
          tags: tags,
        },
      ],
    };

    return response;
  }

  async update(id: string, regionData: any): Promise<Object> {
    const user = await this.regionModel.findOne({ where: { regionId: id } });
    await this.regionTagModel.destroy({ where: { regionId: id } });
    await this.regionAttributeModel.destroy({ where: { regionId: id } });

    await Promise.all(
      regionData.tags.map(async (tagId) => {
        await this.regionTagModel.create({
          regionId: id,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    await Promise.all(
      regionData.attributes.map(async (attribute) => {
        await this.regionAttributeModel.create({
          regionId: id,
          attributeId: attribute.attributeId,
          value: attribute.value,
        });
      }),
    ).catch(async (err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const updatedRegion = await user.update({
      textString: regionData.textString,
      type: regionData.type,
      regionDimensions: regionData.regionDimensions,
      regionWorldPosition: regionData.regionWorldPosition,
      possessingZone: regionData.possessingZone,
      possessorMap: regionData.possessorMap,
      InquiryPhases: regionData.InquiryPhases,
    });

    const attributes = await this.regionAttributeModel.findAll({
      where: { regionId: id },
    });

    const tags = await this.regionTagModel.findAll({
      where: { regionId: id },
    });

    const response = {
      data: [
        {
          regionId: updatedRegion.regionId,
          textString: updatedRegion.textString,
          type: updatedRegion.type,
          regionDimensions: updatedRegion.regionDimensions,
          regionWorldPosition: updatedRegion.regionWorldPosition,
          possessingZone: updatedRegion.possessingZone,
          possessorMap: updatedRegion.possessorMap,
          attributes: attributes.map((attribute) => ({
            regionId: attribute.regionId,
            attributeId: attribute.attributeId,
            value: attribute.value,
          })),
          tags: tags.map((tag) => ({
            regionId: tag.regionId,
            tagId: tag.tagId,
          })),
        },
      ],
    };

    return response;
  }

  async remove(id: string): Promise<void> {
    await this.regionTagService.remove(id);
    await this.regionAttributeService.removeByRegionId(id);
    await this.regionModel.destroy({ where: { regionId: id } });
  }

  async search(keyword: string): Promise<Region[]> {
    return await this.regionModel.findAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
    });
  }
}
