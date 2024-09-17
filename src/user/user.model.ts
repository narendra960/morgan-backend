import {
  Column,
  Table,
  Model,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Character } from 'src/character/character.model';
import { Cluster } from 'src/cluster/cluster.model';
import { UserMaps } from 'src/userMaps/userMaps.model';

@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  userId: string;

  @Column
  @ApiProperty()
  email: string;

  @Column
  @ApiProperty()
  password: string;

  @Column
  @ApiProperty()
  firstName: string;

  @Column
  @ApiProperty()
  lastName: string;

  @HasMany(() => Character)
  character: Character[];

  @HasMany(() => Cluster)
  cluster: Cluster[];

  @HasMany(() => UserMaps)
  userMap: UserMaps;
}
