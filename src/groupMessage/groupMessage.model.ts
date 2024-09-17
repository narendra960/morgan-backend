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
  import { Groups } from 'src/groups/groups.model';

  @Table
  export class GroupMessage extends Model {

    @ForeignKey(() => Groups)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupId: string;

    @BelongsTo(() => Groups)
    groups: Groups

    @Column
    @ApiProperty()
    serverAddress: string;
  }