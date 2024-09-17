import {
    Column,
    Table,
    Model,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Cluster } from 'src/cluster/cluster.model';
import { Tag } from 'src/tag/tag.model';

@Table
export class ClusterTag extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    clusterTagId: string;

    @ForeignKey(() => Cluster)
    @Column({
        type: DataType.UUID,
    })
    @ApiProperty()
    clusterId: string;

    @BelongsTo(() => Cluster)
    cluster: Cluster;

    @ForeignKey(() => Tag)
    @Column({
        type: DataType.UUID,
    })
    @ApiProperty()
    tagId: string;

    @BelongsTo(() => Tag)
    tag: Tag;
}
