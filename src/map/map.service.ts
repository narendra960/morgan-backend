import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { Map } from './map.model';
import { MapTag } from '../mapTag/mapTag.model';
import { MapTagService } from '../mapTag/mapTag.service';
import { UserMaps } from 'src/userMaps/userMaps.model';

@Injectable()
export class MapService {
  constructor(
    @InjectModel(Map) private mapModel: typeof Map,
    @Inject(MapTagService)
    private readonly mapTagService: MapTagService,
    @InjectModel(MapTag) private readonly mapTagModel: typeof MapTag,
  ) {}

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.mapModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    // return { data: types.rows, total: types.count, count: types.count };
    const mapData = await this.mapResponse(types.rows);
        return {
          data: mapData.data,
          total: types.count,
          count: types.count,
        };
  }

  async findOne(id: string): Promise<Object> {
    try {
      const maps = await this.mapModel.findOne({ where: { mapId: id } });

      let tag = [];
      let tagIds = [];
      if (maps) {
        const tagsOfTypeCulture = await this.mapTagService.findAllByMap(id);
        if (tagsOfTypeCulture) {
          await tagsOfTypeCulture.forEach((ele) => {
            tagIds.push(ele['tagId']);
            tag.push(ele);
          });
        }
      }
      return {
        mapId: maps.mapId,
        mapName: maps.mapName,
        mapDescription: maps.mapDescription,
        mapPath: maps.mapPath,
        tagsOfTypeCulture: tag,
        populationLimit: maps.populationLimit,
        currentPopulation: maps.currentPopulation,
        currentMapStatus: maps.currentMapStatus,
        mapToken: maps.mapToken,
      };
    } catch (err) {
      console.log('err===', err);
      return err;
    }
  }

  async create(mapsData: any): Promise<Object> {
    try {
      //   const { tagsOfTypeCulture, ...rest } = mapsData;

      const map = await this.mapModel.create({
        mapName: mapsData.mapName,
        mapDescription: mapsData.mapDescription,
        mapPath: mapsData.mapPath,
        populationLimit: mapsData.populationLimit,
        currentPopulation: mapsData.currentPopulation,
        currentMapStatus: mapsData.currentMapStatus,
        mapToken: mapsData.mapToken,
      });

      const tagPromises = mapsData.tagsOfTypeCulture.map(async (tagId) => {
        return this.mapTagModel.create({
          mapId: map.mapId,
          tagId: tagId,
        });
      });

      const tagsOfTypeCulture = await Promise.all([...tagPromises]);

      const response = {
        data: [
          {
            mapId: map.mapId,
            mapName: mapsData.mapName,
            mapDescription: mapsData.mapDescription,
            mapPath: mapsData.mapPath,
            tags: tagsOfTypeCulture,
            populationLimit: mapsData.populationLimit,
            currentPopulation: mapsData.currentPopulation,
            currentMapStatus: mapsData.currentMapStatus,
            mapToken: mapsData.mapToken,
          },
        ],
      };
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: string, mapsData: any): Promise<Object> {
    const map = await this.mapModel.findOne({ where: { mapId: id } });
    await this.mapTagModel.destroy({ where: { mapId: id } });
    await Promise.all(
      mapsData.tagsOfTypeCulture.map(async (tagId) => {
        await this.mapTagModel.create({
          mapId: id,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      await this.mapModel.destroy({ where: { mapId: map.mapId } });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const tags = await this.mapTagModel.findAll({ where: { mapId: id } });

    const updatedMap = await map.update({
      mapName: mapsData.mapName,
      mapDescription: mapsData.mapDescription,
      mapPath: mapsData.mapPath,
      populationLimit: mapsData.populationLimit,
      currentPopulation: mapsData.currentPopulation,
      currentMapStatus: mapsData.currentMapStatus,
      mapToken: mapsData.mapToken,
    });

    const response = {
      data: [
        {
          mapId: updatedMap.mapId,
          mapName: updatedMap.mapName,
          mapDescription: updatedMap.mapDescription,
          mapPath: updatedMap.mapPath,
          tagsOfTypeCulture: tags.map((tag) => ({
            tagId: tag.tagId,
            mapId: tag.mapId,
          })),
          populationLimit: updatedMap.populationLimit,
          currentPopulation: updatedMap.currentMapStatus,
          currentMapStatus: updatedMap.currentMapStatus,
          mapToken: updatedMap.mapToken,
        },
      ],
    };

    return response;
  }

  async remove(id: string): Promise<void> {
    await this.mapTagModel.destroy({ where: { mapId: id } });
    await this.mapModel.destroy({ where: { mapId: id } });
  }

  async findAllByCluster(clusterId: string) {
    return this.mapModel.sequelize.query(
      `
            SELECT m.mapName, m.mapDescription, m.mapPath FROM Maps m 
            LEFT JOIN Clusters cl on cl.mapId = m.mapId
            where cl.clusterId = '${clusterId}'`,
      { type: QueryTypes.SELECT },
    );
  }
  // async findAllByUserMaps(userMapId: string) {
  //   return this.userMapaModel.sequelize.query(
  //     `
  //           select u.mapId, u.populationLimit, u.currentPopulation, u.mapToken from \`Maps\` m LEFT JOIN userMaps u on m.mapId = u.mapId
  //           where c.groupId = '${userMapId}'`,
  //     { type: QueryTypes.SELECT },
  //   );
  // }
  async findAllByUserMaps(userMpasId: string) {
    return this.mapModel.sequelize.query(
      `
            select m.mapId, m.populationLimit, m.currentPopulation , m.mapToken from \`Maps\` m LEFT JOIN UserMaps u on m.mapId = u.mapId
            where m.mapId = '${userMpasId}'`,
      { type: QueryTypes.SELECT },
    );
  }


  async mapResponse(maps: Map[]) {
    let result = [];
    for (let i = 0; i < maps.length; i++) {
      let tagData = await this.mapTagService.findAllByMap(maps[i].mapId);
      let tagsData = [];
      if (tagData.length > 0) {
        tagData.forEach((data) => {
          tagsData.push(data);
        });
      }
      result.push({
        mapId: maps[i].mapId,
        mapName: maps[i].mapName,
        mapDescription: maps[i].mapDescription,
        mapPath: maps[i].mapPath,
        tagsOfTypeCulture: tagsData,
        populationLimit: maps[i].populationLimit,
        currentPopulation: maps[i].currentPopulation,
        currentMapStatus: maps[i].currentMapStatus,
        mapToken: maps[i].mapToken,
      });
    }
    return { data: result };
  }
}
