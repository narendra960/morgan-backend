import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { ZoneAttribute } from './zoneAttribute.model';

@Injectable()
export class ZoneAttributeService {
  constructor(
    @InjectModel(ZoneAttribute)
    private zoneAttributeModel: typeof ZoneAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.zoneAttributeModel.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findAllByZone(zoneId: string) {
    return this.zoneAttributeModel.sequelize.query(
      `SELECT
      a.attributeId,
      a.attributeName,
      za.Value
    FROM
      ZoneAttributes AS za
      LEFT JOIN Attributes AS a ON za.attributeId = a.attributeId 
    WHERE
      za.zoneId = '${zoneId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<ZoneAttribute> {
    return this.zoneAttributeModel.findOne({
      where: {
        zaId: id,
      },
    });
  }

  async create(regionAttributeData: any): Promise<ZoneAttribute> {
    console.log(regionAttributeData);
    
    const user = await this.zoneAttributeModel.create(regionAttributeData);
    return user;
  }

  async update(id: string, regionAttributeData: any): Promise<ZoneAttribute> {
    const user = await this.zoneAttributeModel.findOne({
      where: { zaId: id },
    });
    return await user.update(regionAttributeData);
  }

  async remove(id: string): Promise<void> {
    await this.zoneAttributeModel.destroy({ where: { zaId: id } });
  }
}
