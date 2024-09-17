import { Column, Table, Model, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Region } from 'src/region/region.model';
import { Attribute } from 'src/attribute/attribute.model';

@Table
export class RegionAttribute extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  raId: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  regionId: string;

  @BelongsTo(() => Region)
  region: Region;

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
