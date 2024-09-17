import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { DataTypes } from 'sequelize';
import { Groups } from 'src/groups/groups.model';

  @Table
  export class GroupUnrealAsset extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    unrealAssetId: string;

    @ForeignKey(() => Groups)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupId: string;

    @Column
    @ApiProperty()
    unRealAsset: string;

    @BelongsTo(() => Groups)
    groups: Groups
  }