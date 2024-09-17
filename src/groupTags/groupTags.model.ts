import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { DataTypes } from 'sequelize';
import { Groups } from 'src/groups/groups.model';
import { Tag } from 'src/tag/tag.model';

  @Table
  export class GroupTags extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    tagId: string;

    @ForeignKey(() => Groups)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupId: string;

    @BelongsTo(() => Groups)
    groups: Groups

    @Column({
      type: DataType.UUID
    })
    @ApiProperty()
    tagsId: string;
  }