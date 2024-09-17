import { ApiProperty } from "@nestjs/swagger";
import { DataTypes } from "sequelize";
import { HasMany, Model } from "sequelize-typescript";
import { BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { Cluster } from "src/cluster/cluster.model";
import { ClusterPermission } from "src/clusterPermission/clusterPermission.model";
import { User } from "src/user/user.model";
import { Map } from "src/map/map.model";


@Table
export class Character extends Model {
    @PrimaryKey
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    })
    characterId: string;

    @Column
    @ApiProperty()
    nickName: string;


    @Column(DataType.JSON)
    @ApiProperty()
    characterData: Record<string, any>;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Cluster) 
    @Column({
        type: DataType.UUID,
        allowNull: true, 
    })
    @ApiProperty()
    clusterId: string;

    @BelongsTo(() => Cluster) 
    cluster: Cluster;

    @ForeignKey(() => Map)
    @Column({
        type: DataType.UUID,
        allowNull: true, 
    })
    @ApiProperty()
    mapId: string;

    @BelongsTo(() => Map) 
    map: Map;

    @ForeignKey(() => Map)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    @ApiProperty()
    defaultMapId: string;

    @BelongsTo(() => Map, 'defaultMapId')
    defaultMap: Map;

    @ForeignKey(() => Map)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    @ApiProperty()
    lastmapAcessed: string;

    @BelongsTo(() => Map, 'lastmapAcessed')
    lastMapAccess: Map;

    @Column
    @ApiProperty()
    lastportalAcessed: string;

    @Column
    @ApiProperty()
    characterStatus: string;

    @HasMany(() => ClusterPermission)
    clusterPermission: ClusterPermission;
}