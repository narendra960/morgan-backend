import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserMaps } from './userMaps.model';
import { MapService } from 'src/map/map.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class userMapsService {
  constructor(
    @InjectModel(UserMaps) private userMapModel: typeof UserMaps,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(MapService) private readonly mapService: MapService,
  ) {}

  // async findAll(payload) {
  //   const { page, limit, offset } = payload;
  //   const userMapsData = await this.userMapModel.findAndCountAll({
  //     limit: Number(limit) ? Number(limit) : 100,
  //     offset: Number(offset) ? Number(offset) : 0,
  //   });
  //   return {
  //     data: userMapsData.rows,
  //     total: userMapsData.count,
  //     count: userMapsData.count,
  //   };
  // }

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const userMaps = await this.userMapModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    return await this.makeEntry(userMaps.rows);
  }

  async findOne(id: string): Promise<UserMaps> {
    return await this.userMapModel
      .findOne({
        where: { userMapsId: id },
      })
      .then(async (userMaps) => {
        return this.mapService
          .findAllByUserMaps(userMaps.mapId)
          .then(async (map) => {
            let maps = [];
            if (map) {
              await map.forEach((ele) => {
                maps.push(ele);
              });
            }
            return {
              userMapsId: userMaps.userMapsId,
              userId: userMaps.userId,
              lastDeploy: userMaps.lastDeploy,
              url: userMaps.url,
              mapPvpType: userMaps.mapPvpType,
              mapTier: userMaps.mapTier,
              mapId: userMaps.mapId,
            };
          })
          .catch((err) => {
            return err;
            ``;
          });
      })
      .catch((err) => {
        return err;
      });
  }

  async makeEntry(userMaps: UserMaps[]) {
    let result = [];
    for (let i = 0; i < userMaps.length; i++) {
      await this.mapService
        .findAllByUserMaps(userMaps[i].mapId)
        .then(async (maps) => {
          let mapdata = [];
          if (maps.length > 0) {
            await maps.forEach((ele) => {
              mapdata.push(ele);
            });
          }

          result.push({
            userMapsId: userMaps[i].userMapsId,
            userId: userMaps[i].userId,
            lastDeploy: userMaps[i].lastDeploy,
            url: userMaps[i].url,
            mapPvpType: userMaps[i].mapPvpType,
            mapTier: userMaps[i].mapTier,
            mapId: userMaps[i].mapId,
            map: mapdata[0],
          });
        });
    }
    return { data: result };
  }

  async create(userMapData: any): Promise<Object> {
    let user = await this.userMapModel.create(userMapData);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userMapModel.destroy({ where: { userMapsId: id } });
  }

  async update(id: string, userMapsData: any): Promise<UserMaps> {
    const userMaps = await this.userMapModel.findOne({
      where: { userMapsId: id },
    });
    return await userMaps.update(userMapsData);
  }
}
