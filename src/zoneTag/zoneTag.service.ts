import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { ZoneTag } from './zoneTag.model';

@Injectable()
export class ZoneTagService {
  constructor(
    @InjectModel(ZoneTag)
    private zoneTagModel: typeof ZoneTag,
  ) {}

  async findAll(zoneId) {
    return this.zoneTagModel.sequelize.query(
      `select t.tagId, t.tagString from ZoneTags as zt left join Tags as t on zt.tagId = t.tagId  where zt.zoneId = '${zoneId}'`,
      { type: QueryTypes.SELECT },
    );
  }

  async findOne(id: string): Promise<ZoneTag> {
    return this.zoneTagModel.findOne({
      where: {
        etId: id,
      },
    });
  }

  async create(zoneId: string, tagId: any): Promise<ZoneTag[]> {
    const response = [];
    if (tagId) {
      tagId.map((element) => {
        response.push(
          this.zoneTagModel.create({
            zoneId: zoneId,
            tagId: element,
          }),
        );
      });
    }
    return response;
  }

  async update(id: string, entryTagData: any): Promise<ZoneTag> {
    const user = await this.zoneTagModel.findOne({
      where: { etId: id },
    });
    return await user.update(entryTagData);
  }

  async remove(id: string): Promise<void> {
    await this.zoneTagModel.destroy({ where: { zoneId: id } });
  }
}
