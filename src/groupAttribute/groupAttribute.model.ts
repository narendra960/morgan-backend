import {
  Column,
  Table,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Groups } from 'src/groups/groups.model';
import { DataTypes } from 'sequelize';
import { Attribute } from 'src/attribute/attribute.model';

@Table
export class GroupAttribute extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  attributeId: string;

  @ForeignKey(() => Groups)
  @Column({
    type: DataType.UUID
  })
  @ApiProperty()
  groupId: string;

  @BelongsTo(() => Groups)
  group: Groups;

  @Column
  @ApiProperty()
  value: string;

  @ForeignKey(() => Attribute)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  attributesId: string;

  @BelongsTo(() => Attribute)
  attribute: Attribute;
}