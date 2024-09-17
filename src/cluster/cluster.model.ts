import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Character } from "src/character/character.model";
import { ClusterPermission } from "src/clusterPermission/clusterPermission.model";
import { Map } from "src/map/map.model";
import { User } from "src/user/user.model";
import { Tag } from "src/tag/tag.model";
import { DataTypes } from 'sequelize';
import { ClusterTag } from '../clusterTag/clusterTag.model';


@Table
export class Cluster extends Model {
    
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    clusterId: string;

    @Column
    @ApiProperty()
    name: string;

    @Column
    @ApiProperty()
    clusterReport: string;

    @Column
    @ApiProperty()
    type: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Map)
    @Column({
        type: DataType.UUID
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

    @Column(DataType.STRING) 
    @ApiProperty()
    SpawnableMaps: string;

    @ForeignKey(() => Tag)
    @ApiProperty()
    @Column({
        type: DataTypes.UUID
    })
    filterTags: string[];

    @BelongsTo(() => Tag)
    tag: Tag;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    @ApiProperty()
    clusterVersion: string;

    @Column({
        defaultValue: false
    })
    @ApiProperty()
    isAccepted: boolean;

    @Column({
        defaultValue: false
    })
    status: boolean;

    @Column({
        type: DataType.STRING,
    })
    @ApiProperty()
    clusterToken: string;

    @HasMany(() => ClusterPermission)
    clusterPermission: ClusterPermission

    @HasMany(() => ClusterTag)
    clusterTag: ClusterTag
}
