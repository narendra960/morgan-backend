import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { RegionAttributeService } from 'src/regionAttribute/regionAttribute.service';
import { RegionTag } from 'src/regionTag/regionTag.model';
import { RegionTagService } from 'src/regionTag/regionTag.service';
import { Region } from '../region/region.model';
import { s3Client } from '../../config/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class OtherService {
  constructor(
    @InjectModel(Region) private regionModel: typeof Region,
    @Inject(RegionTagService)
    private readonly regionTagService: RegionTagService,
    @Inject(RegionAttributeService)
    private readonly regionAttributeService: RegionAttributeService,
  ) {}

  async createPresignedUrl(key) {
    const bucketParams = {
      Bucket: `gameapi`,
      Key: key,
      ContentType: 'image/jpeg',
    };
    try {
      // Create a command to put the object in the S3 bucket.
      const command = new PutObjectCommand(bucketParams);
      // Create the presigned URL.
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      return signedUrl;
    } catch (err) {
      return 'Error creating presigned URL: ' + err;
    }
  }

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const regions = await this.regionModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return await this.makeEntry(regions.rows);
  }

  async makeEntry(regions: Region[]) {
    if (regions.length > 0) {
      let result = [];
      for (let i = 0; i < regions.length; i++) {
        await this.regionAttributeService
          .findAllByRegion(regions[i].regionId)
          .then(async (attribute) => {
            let attributes = [];
            if (attribute.length > 0) {
              await attribute.forEach((ele) => {
                attributes.push(ele['attributeId']);
              });
            }
            await this.regionTagService
              .findAllByRegion(regions[i].regionId)
              .then(async (tags) => {
                let tag = [];
                if (tags.length > 0) {
                  await tags.forEach((ele) => {
                    tag.push(ele['tagId']);
                  });
                }
                result.push({
                  regionId: regions[i].regionId,
                  textString: regions[i].textString,
                  type: regions[i].type,
                  regionDimensions: regions[i].regionDimensions,
                  regionWorldPosition: regions[i].regionWorldPosition,
                  possessingZone: regions[i].possessingZone,
                  possessorMap: regions[i].possessorMap,
                  attributeId: attributes,
                  tagId: tag,
                });
              })
              .catch((err) => {
                return err;
              });
          })
          .catch((err) => {
            return err;
          });
      }
      return { data: result };
    } else {
      return { data: [] };
    }
  }

  async findOne(id: string) {
    return await this.regionModel
      .findOne({ where: { regionId: id } })
      .then(async (region) => {
        return await this.regionAttributeService
          .findAllByRegion(region.regionId)
          .then(async (attribute) => {
            let attributes = [];
            if (attribute) {
              await attribute.forEach((ele) => {
                attributes.push(ele['attributeId']);
              });
            }
            return await this.regionTagService
              .findAllByRegion(region.regionId)
              .then(async (tags) => {
                let tag = [];
                if (tags) {
                  await tags.forEach((ele) => {
                    tag.push(ele['tagId']);
                  });
                }
                return {
                  regionId: region.regionId,
                  textString: region.textString,
                  type: region.type,
                  regionDimensions: region.regionDimensions,
                  regionWorldPosition: region.regionWorldPosition,
                  possessingZone: region.possessingZone,
                  possessorMap: region.possessorMap,
                  attributeId: attributes,
                  tagId: tag,
                };
              })
              .catch((err) => {
                return err;
              });
          })
          .catch((err) => {
            return err;
          });
      })
      .catch((err) => {
        return err;
      });
  }

  async create(regionData: any): Promise<RegionTag[]> {
    const user = await this.regionModel.create({
      textString: regionData.textString,
      type: regionData.type,
      regionDimensions: regionData.regionDimensions,
      regionWorldPosition: regionData.regionWorldPosition,
      possessingZone: regionData.possessingZone,
      possessorMap: regionData.possessorMap,
    });
    return await this.regionTagService.create(user.regionId, regionData.tagId);
  }

  async update(id: string, regionData: any): Promise<Region> {
    const user = await this.regionModel.findOne({ where: { regionId: id } });
    await this.regionTagService
      .remove(id)
      .then(async () => {
        await this.regionTagService.create(id, regionData.tagId);
      })
      .catch((err) => {
        return err;
      });
    return await user.update({
      textString: regionData.textString,
      type: regionData.type,
      regionDimensions: regionData.regionDimensions,
      regionWorldPosition: regionData.regionWorldPosition,
      possessingZone: regionData.possessingZone,
      possessorMap: regionData.possessorMap,
    });
  }

  async remove(id: string): Promise<void> {
    await this.regionTagService.remove(id);
    await this.regionAttributeService.remove(id);
    await this.regionModel.destroy({ where: { regionId: id } });
  }

  async search(keyword: string): Promise<Region[]> {
    return await this.regionModel.findAll({
      where: {
        textString: {
          [Op.like]: `%%${keyword}%%`,
        },
      },
    });
  }
}
