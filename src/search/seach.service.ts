import { Inject, Injectable } from '@nestjs/common';
import { TypeService } from '../type/type.service';
import { ZoneService } from '../zone/zone.service';
import { RegionService } from '../region/region.service';
import { EntryService } from '../entry/entry.service';
import { Op, QueryTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { EntryAttribute } from 'src/entryAttribute/entryAttribute.model';
import { Attribute } from 'src/attribute/attribute.model';
import { ZoneAttribute } from 'src/zoneAttribute/zoneAttribute.model';
import { Zone } from 'src/zone/zone.model';
import { Entry } from 'src/entry/entry.model';
import { Region } from 'src/region/region.model';
import { RegionAttribute } from 'src/regionAttribute/regionAttribute.model';
@Injectable()
export class SearchService {
  @InjectModel(Entry) private entryModel: typeof Entry;
  @InjectModel(Zone) private zoneModel: typeof Zone;
  @InjectModel(Region) private regionModel: typeof Region;
  @InjectModel(ZoneAttribute)
  private zoneAttributeModel: typeof ZoneAttribute;
  @InjectModel(EntryAttribute)
  private attribute: typeof Attribute;
  @Inject(TypeService)
  private readonly typeService: TypeService;
  @Inject(ZoneService)
  private readonly zoneService: ZoneService;
  @Inject(RegionService)
  private readonly regionService: RegionService;
  @Inject(EntryService)
  private readonly entryService: EntryService;
  @InjectModel(EntryAttribute)
  private entryAttributeModel: typeof EntryAttribute;
  @InjectModel(RegionAttribute)
  private regionAttributeModel: typeof RegionAttribute;

  async search(keyword: string) {
    let result = [];
    keyword = keyword ? keyword : '';
    result.push({
      type: await this.typeService.search(keyword),
    });
    result.push({
      zone: await this.zoneService.search(keyword),
    });
    result.push({
      region: await this.regionService.search(keyword),
    });
    result.push({
      entry: await this.entryService.search(keyword),
    });
    return result;
  }

  async searchByObject(payload: { object: string; textString: string }) {
    let { object, textString } = payload;
    object = object ? object : '';
    textString = textString ? textString : '';
    const entries = this.entryService.searchByObject(object, textString);
    return entries;
  }

  async searchRegions(textString: string) {
    textString = textString ? textString : '';
    return await this.regionService.search(textString);
  }

  async searchEntity(payload: { type: string; textString: string }) {
    let { type, textString } = payload;
    const entries = await this.entryService.searchEntity(type, textString);
    return entries;
  }

  async searchByEntity(payload: { entity: string; textString: string }) {
    let { entity, textString } = payload;
    const entries = await this.entryService.searchByEntity(entity, textString);
    return entries;
  }

  async makePhrasesRes(entries) {
    // console.log(entries);
    if (entries.length > 0) {
      let result = [];
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].entry) {
          result.push(entries[i].entry);
        } else if (entries[i].region) {
          result.push(entries[i].region);
        } else if (entries[i].zone) {
          result.push(entries[i].zone);
        }
      }
      return result;
    } else {
      return { data: [] };
    }
  }

  async searchByAttri(
    attributeId: string,
    attributeValue: string,
    tagvalues: string,
  ) {
    // console.log(tagvalues);
    let tagsArray = Array.isArray(tagvalues) ? tagvalues : [tagvalues];
    console.log(tagsArray);
    let entry: any;
    let zone: any;
    let region: any;
    if (Array.isArray(tagsArray) && tagsArray.length > 0 && tagvalues) {
      entry = await this.entryAttributeModel.findAll({
        // attributes: ['entryId'],
        include: [
          {
            model: this.entryModel,
            attributes: ['entryId', 'InquiryPhases', 'tags'],

            where: {
              tags: {
                [Op.in]: tagsArray,
              },
            },
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });
      zone = await this.zoneAttributeModel.findAll({
        // attributes: ['entryId'],
        include: [
          {
            model: this.zoneModel,
            attributes: ['zoneId', 'InquiryPhases', 'tags'],
            where: {
              tags: {
                [Op.in]: tagsArray,
              },
            },
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });

      region = await this.regionAttributeModel.findAll({
        // attributes: ['entryId'],
        include: [
          {
            model: this.regionModel,
            attributes: ['regionId', 'InquiryPhases', 'tags'],
            where: {
              tags: {
                [Op.in]: tagsArray,
              },
            },
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });
    } else {
      entry = await this.entryAttributeModel.findAll({
        include: [
          {
            model: this.entryModel,
            attributes: ['entryId', 'InquiryPhases', 'tags'],
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });
      zone = await this.zoneAttributeModel.findAll({
        // attributes: ['entryId'],
        include: [
          {
            model: this.zoneModel,
            attributes: ['zoneId', 'InquiryPhases', 'tags'],
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });

      region = await this.regionAttributeModel.findAll({
        // attributes: ['entryId'],
        include: [
          {
            model: this.regionModel,
            attributes: ['regionId', 'InquiryPhases', 'tags'],
          },
        ],
        where: {
          attributeId: attributeId,
          value: {
            [Op.lte]: attributeValue,
          },
        },
      });
    }

    let entryData = await this.makePhrasesRes(entry);
    let zoneData = await this.makePhrasesRes(zone);
    let regionData = await this.makePhrasesRes(region);
    let res = { entry: entryData, zone: zoneData, region: regionData };
    return { data: res };
    // return this.makeEntry(entry);
  }

  async searchByAttribute(payload: {
    attributeId: string;
    attributeValue: string;
    tag: string;
  }) {
    let { attributeId, attributeValue, tag } = payload;
    console.log(payload);
    const entries = await this.searchByAttri(attributeId, attributeValue, tag);
    return entries;
  }
}
