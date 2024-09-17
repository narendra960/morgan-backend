import {
  Column,
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AllowNull,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Cluster } from 'src/cluster/cluster.model';
import { ClusterPermission } from 'src/clusterPermission/clusterPermission.model';
import { Tag } from 'src/tag/tag.model';
import { MapTag } from '../mapTag/mapTag.model';
import { UserMaps } from 'src/userMaps/userMaps.model';

@Table
export class Map extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  mapId: string;

  @Column
  @ApiProperty()
  mapName: string;

  @Column
  @ApiProperty()
  mapDescription: string;

  @Column
  @ApiProperty()
  mapPath: string;

  @ForeignKey(() => Tag)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
  })
  tagsOfTypeCulture: string[];

  @BelongsTo(() => Tag)
  tag: Tag;

  @Column
  @ApiProperty()
  populationLimit: number;

  @Column
  @ApiProperty()
  currentPopulation: number;

  @Column
  @ApiProperty()
  currentMapStatus: string;

  @Column
  @ApiProperty()
  mapToken: string;

  @HasMany(() => Cluster)
  cluster: Cluster;

  @HasMany(() => ClusterPermission)
  clusterPermission: ClusterPermission;

  @HasMany(() => MapTag)
  mapTag: MapTag;

  @HasMany(() => UserMaps)
  userMap: UserMaps;
}
