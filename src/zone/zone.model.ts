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
import { Tag } from '../tag/tag.model';
import { ZoneAttribute } from 'src/zoneAttribute/zoneAttribute.model';
import { ZoneTag } from 'src/zoneTag/zoneTag.model';
import { Type } from 'src/type/type.model';
import { Attribute } from 'src/attribute/attribute.model';

class zoneAttributeDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  value: string;
}

@Table
export class Zone extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  zoneId: string;

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
  mapArrayList: string;

  @ForeignKey(() => Tag)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
  })
  tags: string[];

  @BelongsTo(() => Tag)
  tag: Tag;

  @ForeignKey(() => Attribute)
  @ApiProperty({ type: () => [zoneAttributeDto] })
  @Column({
    type: DataTypes.UUID,
  })
  attributes: zoneAttributeDto[];

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @HasMany(() => ZoneAttribute)
  zoneAttribute: ZoneAttribute[];

  @HasMany(() => ZoneTag)
  zoneTag: ZoneTag[];

  @Column
  @ApiProperty()
  InquiryPhases: string;
}
