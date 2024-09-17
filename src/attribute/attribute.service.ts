import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attribute } from './attribute.model';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(Attribute) private attributeModel: typeof Attribute,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.attributeModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findOne(id: string): Promise<Attribute> {
    return this.attributeModel.findOne({
      where: {
        attributeId: id,
      },
    });
  }

  async create(attributeData: any): Promise<Attribute> {
    const user = await this.attributeModel.create(attributeData);
    return user;
  }

  async update(id: string, attributeData: any): Promise<Attribute> {
    const user = await this.attributeModel.findOne({
      where: { attributeId: id },
    });
    return await user.update(attributeData);
  }

  async remove(id: string): Promise<void> {
    await this.attributeModel.destroy({ where: { attributeId: id } });
  }
}
