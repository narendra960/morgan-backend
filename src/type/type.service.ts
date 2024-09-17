import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Type } from './type.model';

@Injectable()
export class TypeService {
  constructor(@InjectModel(Type) private typeModel: typeof Type) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.typeModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findOne(id: string): Promise<Type> {
    return this.typeModel.findOne({
      where: {
        typeId: id,
      },
    });
  }

  async create(typeData: any): Promise<Type> {
    const user = await this.typeModel.create(typeData);
    return user;
  }

  async update(id: string, typeData: any): Promise<Type> {
    const user = await this.typeModel.findOne({ where: { typeId: id } });
    return await user.update(typeData);
  }

  async remove(id: string): Promise<void> {
    await this.typeModel.destroy({ where: { typeId: id } });
  }

  async search(keyword: string): Promise<Type[]> {
    return await this.typeModel.findAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
    });
  }
}
