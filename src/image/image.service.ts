import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Image } from './image.model';
import * as AWS from 'aws-sdk';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image) private imageModel: typeof Image) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.imageModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findOne(id: string): Promise<Image> {
    return this.imageModel.findOne({
      where: {
        imageId: id,
      },
    });
  }

  async create(imageData: any): Promise<Image> {
    const user = await this.imageModel.create(imageData);
    return user;
  }

  async update(id: string, imageData: any): Promise<Image> {
    const user = await this.imageModel.findOne({ where: { imageId: id } });
    return await user.update(imageData);
  }

  async remove(id: string): Promise<void> {
    await this.imageModel.destroy({ where: { imageId: id } });
  }

  async search(keyword: string): Promise<Image[]> {
    return await this.imageModel.findAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
    });
  }
}
