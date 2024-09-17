import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Map } from 'src/map/map.model';
import { User } from 'src/user/user.model';

@Table
export class UserMaps extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userMapsId: string;

  // userid foreignkey
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  userId: string;

  @BelongsTo(() => User)
  user: User;

  //population limit
  @ForeignKey(() => Map)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  mapId: string;

  @BelongsTo(() => Map)
  map: Map;

  // last deploy

  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  lastDeploy: Date;

  //URL

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  url: string;

  // mapPVPtype
  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  mapPvpType: string;

  //mapTier
  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  mapTier: string;
}
