import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from '../image/image.model';
import { FindOptions } from 'sequelize';

@Injectable()
export class UploadService {
  private readonly s3: S3;

  constructor(@InjectModel(Image) private imageModel: typeof Image) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(
    files: Express.Multer.File | Express.Multer.File[],
    imageDescription: string,
    imageCategory: string,
    imageSubcategory: string,
  ): Promise<Image[]> {
    try {
      let filesArray: Express.Multer.File[];

    if (!Array.isArray(files)) {
      filesArray = [files];
    } else {
      filesArray = files;
    }

    if (filesArray.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const upload = async (file: Express.Multer.File): Promise<Image> => {
      const key = `${uuidv4()}_${file.originalname}`;
      const params = {
        ACL: 'public-read',
        ContentType: file.mimetype,
        Bucket: 'bucket-superplate',
        Key: key,
        Body: file.buffer,
      };
      await this.s3.upload(params).promise();
      const imageUrl = `https://bucket-superplate.s3.amazonaws.com/${key}`;
      return this.imageModel.create({
        imageDescription,
        imageUrl,
        imageCategory,
        imageSubcategory,
      });
    };

    const promises = filesArray.map(upload);
    const images = await Promise.all(promises);

    return images;
    } catch(error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getImagesByCategoryAndSub(
    category: string,
    subcategory: string,
    limit?: number,
  ): Promise<Image[]> {
    const options: FindOptions = {
      where: { imageCategory: category, imageSubcategory: subcategory },
    };
    if (limit) {
      options.limit = limit;
    }
    const images = await this.imageModel.findAll(options);
    return images;
  }

  async getImagesByCategory(
    category: string,
    limit?: number,
  ): Promise<Image[]> {
    const options: FindOptions = {
      where: { imageCategory: category },
    };
    if (limit) {
      options.limit = limit;
    }
    const images = await this.imageModel.findAll(options);
    return images;
  }

  async getZoneImages(page?: number, limit?: number, offset?: string) {
    const options: FindOptions = {
      where: { imageCategory: 'zone' },
    };
    if (limit) {
      options.limit = +limit;
    }
    if (page && limit && offset) {
      options.offset = (page - 1) * limit + Number(offset);
    }
    try {
      const images = await this.imageModel.findAll(options);
      return images;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRegionImages(page?: number, limit?: number, offset?: string) {
    const options: FindOptions = {
      where: { imageCategory: 'region' },
    };
    if (limit) {
      options.limit = +limit;
    }
    if (page && limit && offset) {
      options.offset = (page - 1) * limit + Number(offset);
    }
    try {
      const images = await this.imageModel.findAll(options);
      return images;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getEntryImages(page?: number, limit?: number, offset?: string) {
    const options: FindOptions = {
      where: { imageCategory: 'entry' },
    };
    if (limit) {
      options.limit = +limit;
    }
    if (page && limit && offset) {
      options.offset = (page - 1) * limit + Number(offset);
    }
    try {
      const images = await this.imageModel.findAll(options);
      return images;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findZones(payload) {
    const { page, limit, offset } = payload;
    const types = await this.imageModel.findAndCountAll({
      where: { imageCategory: 'zone' },
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findRegion(payload) {
    const { page, limit, offset } = payload;
    const types = await this.imageModel.findAndCountAll({
      where: { imageCategory: 'region' },
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }

  async findEntry(payload) {
    const { page, limit, offset } = payload;
    const types = await this.imageModel.findAndCountAll({
      where: { imageCategory: 'entry' },
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return { data: types.rows, total: types.count, count: types.count };
  }
}
