import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { EntryTag } from './entryTag.model';

@Injectable()
export class EntryTagService {
  constructor(
    @InjectModel(EntryTag)
    private entryTagModel: typeof EntryTag,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.entryTagModel.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findAllByEntry(entryId) {
    return this.entryTagModel.sequelize.query(
      `select t.tagId, t.tagString from EntryTags as et left join Tags as t on et.tagId = t.tagId  where et.entryId = '${entryId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<EntryTag> {
    return this.entryTagModel.findOne({
      where: {
        etId: id,
      },
    });
  }

  async create(entryId: string, tagId: any): Promise<EntryTag[]> {
    const response = [];
    if (tagId) {
      tagId.map((element) => {
        response.push(
          this.entryTagModel.create({
            entryId: entryId,
            tagId: element,
          }),
        );
      });
    }
    return response;
  }

  async update(id: string, entryTagData: any): Promise<EntryTag> {
    const user = await this.entryTagModel.findOne({
      where: { etId: id },
    });
    return await user.update(entryTagData);
  }

  async remove(id: string): Promise<void> {
    await this.entryTagModel.destroy({ where: { entryId: id } });
  }
}
