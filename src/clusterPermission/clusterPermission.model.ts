import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Character } from "src/character/character.model";
import { Cluster } from "src/cluster/cluster.model";
import { Map } from "src/map/map.model";


@Table
export class ClusterPermission extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    permissionId: string;

    @ForeignKey(() => Character)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    characterId: string;

    @BelongsTo(() => Character)
    character: Character

    @ForeignKey(() => Map)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    mapId: string;

    @BelongsTo(() => Map)
    map: Map;

    @ForeignKey(() => Cluster)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    clusterId: string;

    @BelongsTo(() => Cluster)
    cluster: Cluster;
}