import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { RegionTag } from './regionTag.model';

@Injectable()
export class RegionTagService {
  constructor(
    @InjectModel(RegionTag)
    private regionTagModel: typeof RegionTag,
  ) {}

  async findAllByRegion(regionId) {
    return this.regionTagModel.sequelize.query(
      `select t.tagId, t.tagString from RegionTags as rt left join Tags as t on rt.tagId = t.tagId  where rt.regionId = '${regionId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<RegionTag> {
    return this.regionTagModel.findOne({
      where: {
        rtId: id,
      },
    });
  }

  async create(regionId: string, tagId: any): Promise<RegionTag[]> {
    const response = [];
    if (tagId) {
      tagId.map((element) => {
        response.push(
          this.regionTagModel.create({
            regionId: regionId,
            tagId: element,
          }),
        );
      });
    }
    return response;
  }

  async update(id: string, regionTagData: any): Promise<RegionTag> {
    const user = await this.regionTagModel.findOne({
      where: { rtId: id },
    });
    return await user.update(regionTagData);
  }

  async remove(id: string): Promise<void> {
    await this.regionTagModel.destroy({ where: { regionId: id } });
  }
}
