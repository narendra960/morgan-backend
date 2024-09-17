import { Column, Table, Model, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Zone } from 'src/zone/zone.model';

@Table
export class ZoneTag extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  ztId: string;

  @ForeignKey(() => Zone)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  zoneId: string;

  @BelongsTo(() => Zone)
  zone: Zone;

  @Column
  @ApiProperty()
  tagId: string;
}
