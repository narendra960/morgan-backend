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
import { Tag } from 'src/tag/tag.model';
import { EntryAttribute } from 'src/entryAttribute/entryAttribute.model';
import { EntryTag } from 'src/entryTag/entryTag.model';
import { Type } from 'src/type/type.model';
import { Attribute } from 'src/attribute/attribute.model';

class entryAttributeDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  value: string;
}
@Table
export class Entry extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  entryId: string;

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
  regionId: string;

  @Column
  @ApiProperty()
  object: string;

  @Column({
    type: 'datetime',
  })
  @ApiProperty()
  historicdatetime: Date;

  @Column({
    type: DataTypes.TEXT,
  })
  @ApiProperty()
  summarydescription: string;

  @Column
  @ApiProperty()
  possessorEntity: string;

  @Column
  @ApiProperty()
  possessorRegion: string;

  @Column
  @ApiProperty()
  possessorZone: string;

  @Column
  @ApiProperty()
  possessorEntry: string;

  @Column
  @ApiProperty()
  location: string;

  @ForeignKey(() => Tag)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
  })
  tags: string[];

  @BelongsTo(() => Tag)
  tag: Tag;

  @ForeignKey(() => Attribute)
  @ApiProperty({ type: () => [entryAttributeDto] })
  @Column({
    type: DataTypes.UUID,
  })
  attributes: entryAttributeDto[];

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @HasMany(() => EntryAttribute)
  entryAttribute: EntryAttribute[];

  @HasMany(() => EntryTag)
  entryTag: EntryTag[];

  @Column
  @ApiProperty()
  InquiryPhases: string;
}
