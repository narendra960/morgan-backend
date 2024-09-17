import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cluster } from './cluster.model';
import { CharacterService } from 'src/character/character.service';
import { MapService } from 'src/map/map.service';
import { UserService } from 'src/user/user.service';
import { ClusterTagService } from '../clusterTag/clusterTag.service';
import { ClusterTag } from '../clusterTag/clusterTag.model';

@Injectable()
export class ClusterService {
  constructor(
    @InjectModel(Cluster) private clusterModel: typeof Cluster,
    @InjectModel(ClusterTag) private clusterTagModel: typeof ClusterTag,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(MapService) private readonly mapService: MapService,
    @Inject(ClusterTagService)
    private readonly clusterTagService: ClusterTagService,
  ) {}

  // async findAll(payload) {
  //     const { page, limit, offset } = payload;
  //     const cluster = await this.clusterModel.findAndCountAll({
  //         limit: Number(limit) ? Number(limit) : 100,
  //         offset: Number(offset) ? Number(offset) : 0
  //     });
  //     return await this.makeEntry(cluster.rows);
  // }

  async findAll(payload) {
    const { page, limit, offset } = payload;
    const types = await this.clusterModel.findAndCountAll({
      limit: Number(limit) ? Number(limit) : 100,
      offset: Number(offset) ? Number(offset) : 0,
    });
    // return { data: types.rows, total: types.count, count: types.count };
    const clusterData = await this.clusterResponse(types.rows);
    return {
      data: clusterData.data,
      total: types.count,
      count: types.count,
    };
  }

  // async makeEntry(cluster: Cluster[]) {
  //     let result = [];
  //     for (let i = 0; i < cluster.length; i++) {
  //         await this.userService.findAllByCluster(cluster[i].clusterId)
  //             .then(async (user) => {
  //                 console.log(user, "user user");
  //                 let users = [];
  //                 if (user.length > 0) {
  //                     await user.forEach((ele) => {
  //                         users.push(ele)
  //                     })
  //                 }
  //                 await this.mapService.findAllByCluster(cluster[i].clusterId)
  //                     .then(async (map) => {
  //                         let maps = [];
  //                         if (map.length > 0) {
  //                             await map.forEach((ele) => {
  //                                 maps.push(ele)
  //                             })
  //                         }
  //                         result.push({
  //                             clusterId: cluster[i].clusterId,
  //                             name: cluster[i].name,
  //                             clusterReport: cluster[i].clusterReport,
  //                             type: cluster[i].type,
  //                             isAccepted: cluster[i].isAccepted,
  //                             userId: cluster[i].userId,
  //                             user: users[0],
  //                             mapId: cluster[i].mapId,
  //                             map: maps[0]
  //                         })
  //                     }).catch((err) => {
  //                         return err;
  //                     })
  //             }).catch((err) => {
  //                 return err;
  //             })
  //     }

  //     return { data: result }
  // }

  async findOne(id: string): Promise<Object> {
    try {
      const clusters = await this.clusterModel.findOne({
        where: { clusterId: id },
      });
      let tag = [];
      let tagIds = [];
      if (clusters) {
        const filterTags = await this.clusterTagService.findAllByCluster(id);
        if (filterTags) {
          await filterTags.forEach((ele) => {
            tagIds.push(ele['tagId']);
            tag.push(ele);
          });
        }
      }
      return {
        clusterId: clusters.clusterId,
        name: clusters.name,
        clusterReport: clusters.clusterReport,
        type: clusters.type,
        userId: clusters.userId,
        mapId: clusters.mapId,
        defaultMapId: clusters.defaultMapId,
        SpawnableMaps: JSON.parse(clusters.SpawnableMaps),
        isAccepted: clusters.isAccepted,
        filterTags: tag,
        clusterVersion: clusters.clusterVersion,
        clusterToken: clusters.clusterToken,
      };
    } catch (err) {
      console.log('err===', err);
      return err;
    }
  }

  async create(clustersData: any): Promise<Object> {
    try {
      // const { tagsOfTypeCulture, ...rest } = mapsData;
      if (Array.isArray(clustersData.SpawnableMaps)) {
        clustersData.SpawnableMaps = JSON.stringify(clustersData.SpawnableMaps);
      }
      const cluster = await this.clusterModel.create({
        name: clustersData.name,
        clusterReport: clustersData.clusterReport,
        type: clustersData.type,
        userId: clustersData.userId,
        mapId: clustersData.mapId,
        defaultMapId: clustersData.defaultMapId,
        SpawnableMaps: clustersData.SpawnableMaps,
        isAccepted: clustersData.isAccepted,
        clusterVersion: clustersData.clusterVersion,
        clusterToken: clustersData.clusterToken,
      });

      const tagPromises = clustersData.filterTags.map(async (tagId) => {
        return this.clusterTagModel.create({
          clusterId: cluster.clusterId,
          tagId: tagId,
        });
      });

      const filterTags = await Promise.all([...tagPromises]);

      const response = {
        data: [
          {
            clusterId: cluster.clusterId,
            name: cluster.name,
            clusterReport: cluster.clusterReport,
            type: cluster.type,
            userId: cluster.userId,
            mapiId: cluster.mapId,
            defaultmapId: cluster.defaultMapId,
            SpawnableMaps: JSON.parse(cluster.SpawnableMaps),
            isAccepted: cluster.isAccepted, // done
            filterTags: filterTags,
            clusterVersion: cluster.clusterVersion, // done model added
            clusterToken: cluster.clusterToken,
          },
        ],
      };
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    await this.clusterTagModel.destroy({ where: { clusterId: id } });
    await this.clusterModel.destroy({ where: { clusterId: id } });
  }
  async removeAll(): Promise<void> {
    await this.clusterTagModel.destroy();
    await this.clusterModel.destroy();
  }

  async accept(id: string): Promise<void> {
    const cluster = await this.clusterModel.findOne({
      where: { clusterId: id },
    });
    await cluster.update({ isAccepted: true });
  }

  async status(id: string, status): Promise<void> {
    const cluster = await this.clusterModel.findOne({
      where: { clusterId: id },
    });
    await cluster.update({ status: status.status });
  }

  async update(id: string, clustersData: any): Promise<Object> {
    if (Array.isArray(clustersData.SpawnableMaps)) {
      clustersData.SpawnableMaps = JSON.stringify(clustersData.SpawnableMaps);
    }
    const cluster = await this.clusterModel.findOne({
      where: { clusterId: id },
    });
    await this.clusterTagModel.destroy({ where: { clusterId: id } });
    await Promise.all(
      clustersData.filterTags.map(async (tagId) => {
        await this.clusterTagModel.create({
          clusterId: id,
          tagId: tagId,
        });
      }),
    ).catch(async (err) => {
      await this.clusterModel.destroy({
        where: { clusterId: cluster.clusterId },
      });
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });

    const filterTags = await this.clusterTagModel.findAll({
      where: { clusterId: id },
    });

    const updatedCluster = await cluster.update({
      name: clustersData.name,
      clusterReport: clustersData.clusterReport,
      type: clustersData.type,
      userId: clustersData.userId,
      mapId: clustersData.mapId,
      defaultMapId: clustersData.defaultMapId,
      SpawnableMaps: clustersData.SpawnableMaps,
      isAccepted: clustersData.isAccepted,
      clusterVersion: clustersData.clusterVersion,
      clusterToken: clustersData.clusterToken,
    });

    const response = {
      data: [
        {
          clusterId: updatedCluster.clusterId,
          name: updatedCluster.name,
          clusterReport: updatedCluster.clusterReport,
          type: updatedCluster.type,
          userId: updatedCluster.userId,
          mapiId: updatedCluster.mapId,
          defaultmapId: updatedCluster.defaultMapId,
          SpawnableMaps: JSON.parse(updatedCluster.SpawnableMaps),
          isAccepted: updatedCluster.isAccepted,
          filterTags: filterTags,
          clusterVersion: updatedCluster.clusterVersion,
          clusterToken: updatedCluster.clusterToken,
        },
      ],
    };

    return response;
  }

  async clusterResponse(clusters: Cluster[]) {
    let result = [];
    for (let i = 0; i < clusters.length; i++) {
      let tagData = await this.clusterTagService.findAllByCluster(
        clusters[i].clusterId,
      );
      let tagsData = [];
      if (tagData.length > 0) {
        tagData.forEach((data) => {
          tagsData.push(data);
        });
      }
      result.push({
        clusterId: clusters[i].clusterId,
        name: clusters[i].name,
        clusterReport: clusters[i].clusterReport,
        type: clusters[i].type,
        userId: clusters[i].userId,
        mapId: clusters[i].mapId,
        defaultMapId: clusters[i].defaultMapId,
        SpawnableMaps: JSON.parse(clusters[i].SpawnableMaps),
        isAccepted: clusters[i].isAccepted,
        filterTags: tagsData,
        clusterVersion: clusters[i].clusterVersion,
        clusterToken: clusters[i].clusterToken,
      });
    }
    return { data: result };
  }
}
