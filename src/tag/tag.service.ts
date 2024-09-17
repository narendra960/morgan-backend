import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './tag.model';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const tags = await this.tagModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: tags.rows, total: tags.count, count: tags.count };
  }

  async findOne(id: string): Promise<Tag> {
    return this.tagModel.findOne({
      where: {
        tagId: id,
      },
    });
  }

  async create(tagData: any): Promise<Tag> {
    const user = await this.tagModel.create(tagData);
    return user;
  }

  async update(id: string, tagData: any): Promise<Tag> {
    const user = await this.tagModel.findOne({
      where: { tagId: id },
    });
    return await user.update(tagData);
  }

  async remove(id: string): Promise<void> {
    await this.tagModel.destroy({ where: { tagId: id } });
  }
}
