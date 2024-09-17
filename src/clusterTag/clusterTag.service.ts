import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { ClusterTag } from './clusterTag.model';

@Injectable()
export class ClusterTagService {
    constructor(@InjectModel(ClusterTag) private clusterTagModel: typeof ClusterTag) { }

    async findAllByCluster(clusterId){
        let data = await this.clusterTagModel.sequelize.query(
            `SELECT t.tagId, t.tagString FROM ClusterTags AS ct LEFT JOIN Tags AS t ON ct.tagId = t.tagId WHERE ct.clusterId = '${clusterId}'`,
            { type: QueryTypes.SELECT }
        )
        return data;
    }
    
    // async remove(id: string): Promise<void> {
    //     await this.clusterTagModel.destroy({ where: { tagId: id } });
    // }    
    
}

