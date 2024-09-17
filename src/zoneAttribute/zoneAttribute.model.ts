import {
  Column,
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Zone } from 'src/zone/zone.model';
import { Attribute } from 'src/attribute/attribute.model';

@Table
export class ZoneAttribute extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  zaId: string;

  @ForeignKey(() => Zone)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  zoneId: string;

  @BelongsTo(() => Zone)
  zone: Zone;

  @ForeignKey(() => Attribute)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  attributeId: string;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @Column
  @ApiProperty()
  value: string;
}
