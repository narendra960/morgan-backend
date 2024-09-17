import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { RegionAttribute } from './regionAttribute.model';

@Injectable()
export class RegionAttributeService {
  constructor(
    @InjectModel(RegionAttribute)
    private regionAttributeModel: typeof RegionAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.regionAttributeModel.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findAllByRegion(regionId: string) {
    return this.regionAttributeModel.sequelize.query(
      `SELECT
      a.attributeId,
      a.attributeName,
      ra.Value
    FROM
      RegionAttributes AS ra
      LEFT JOIN Attributes AS a ON ra.attributeId = a.attributeId 
    WHERE
      ra.regionId = '${regionId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<RegionAttribute> {
    return this.regionAttributeModel.findOne({
      where: {
        raId: id,
      },
    });
  }

  async create(regionAttributeData: any): Promise<RegionAttribute> {
    const user = await this.regionAttributeModel.create(regionAttributeData);
    return user;
  }

  async update(id: string, regionAttributeData: any): Promise<RegionAttribute> {
    const user = await this.regionAttributeModel.findOne({
      where: { raId: id },
    });
    return await user.update(regionAttributeData);
  }

  async remove(id: string): Promise<void> {
    await this.regionAttributeModel.destroy({ where: { raId: id } });
  }

  async removeByRegionId(regionId: string): Promise<void> {
    await this.regionAttributeModel.destroy({ where: { regionId } });
  }
}
