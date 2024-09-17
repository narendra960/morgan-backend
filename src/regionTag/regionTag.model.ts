import { Column, Table, Model, PrimaryKey, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Region } from "../region/region.model"
import { Tag } from 'src/tag/tag.model';


@Table
export class RegionTag extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  rtId: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  regionId: string;

  @BelongsTo(() => Region)
  region: Region;

  @ForeignKey(() => Tag)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  tagId: string;

  @BelongsTo(() => Tag)
  tag: Tag;

  // @HasMany(() => Region)
  // regions: Region[];

  // @HasMany(() => Tag)
  // tag: Tag[];
}
