import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Attribute } from 'src/attribute/attribute.model';
import { EntryAttribute } from './entryAttribute.model';

@Injectable()
export class EntryAttributeService {
  constructor(
    @InjectModel(EntryAttribute)
    private entryAttributeModel: typeof EntryAttribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.entryAttributeModel.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findAllByEntry(entryId: string) {
    return this.entryAttributeModel.sequelize.query(
      `SELECT
      a.attributeId,
      a.attributeName,
      ea.Value
    FROM
      EntryAttributes AS ea
      LEFT JOIN Attributes AS a ON ea.attributeId = a.attributeId 
    WHERE
      ea.entryId = '${entryId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<EntryAttribute> {
    return this.entryAttributeModel.findOne({
      where: {
        eaId: id,
      },
    });
  }

  async create(entryAttributeData: any): Promise<EntryAttribute> {
    const user = await this.entryAttributeModel.create(entryAttributeData);
    return user;
  }

  async update(id: string, entryAttributeData: any): Promise<EntryAttribute> {
    const user = await this.entryAttributeModel.findOne({
      where: { eaId: id },
    });
    return await user.update(entryAttributeData);
  }

  async remove(id: string): Promise<void> {
    await this.entryAttributeModel.destroy({ where: { eaId: id } });
  }
}
