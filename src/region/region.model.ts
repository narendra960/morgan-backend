import {
  Column,
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { RegionTag } from 'src/regionTag/regionTag.model';
import { Tag } from 'src/tag/tag.model';
import { RegionAttribute } from 'src/regionAttribute/regionAttribute.model';
import { Type } from 'src/type/type.model';
import { Attribute } from 'src/attribute/attribute.model';

class regionAttibuteDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  value: string;
}

@Table
export class Region extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  regionId: string;

  @Column
  @ApiProperty()
  textString: string;

  @ForeignKey(() => Type)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
  })
  type: string;

  @BelongsTo(() => Type)
  types: Type;

  @Column
  @ApiProperty()
  regionDimensions: string;

  @Column
  @ApiProperty()
  regionWorldPosition: string;

  @Column
  @ApiProperty()
  possessingZone: string;

  @Column
  @ApiProperty()
  possessorMap: string;

  @ForeignKey(() => Tag)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
  })
  tags: string[];

  @BelongsTo(() => Tag)
  tag: Tag;

  @ForeignKey(() => Attribute)
  @ApiProperty({ type: () => [regionAttibuteDto] })
  @Column({
    type: DataTypes.UUID,
  })
  attributes: regionAttibuteDto[];

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @HasMany(() => RegionAttribute)
  regionAttribute: RegionAttribute[];

  @HasMany(() => RegionTag)
  regionTag: RegionTag[];

  @Column
  @ApiProperty()
  InquiryPhases: string;
}
