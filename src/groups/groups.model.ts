import {
  Column,
  Table,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Dungeons } from 'src/dungeons/dungeons.model';
import { GroupTags } from 'src/groupTags/groupTags.model';
import { GroupAffiliation } from 'src/groupAffiliation/groupAffiliation.model';
import { GroupMessage } from 'src/groupMessage/groupMessage.model';
import { GroupAttribute } from 'src/groupAttribute/groupAttribute.model';
import { Type } from 'src/type/type.model';
import { Attribute } from 'src/attribute/attribute.model';
import { Tag } from 'src/tag/tag.model';
import { Channel } from 'src/channel/channel.model';

class groupAttributeDto {
  @ApiProperty()
  attributeId: string;

  @ApiProperty()
  value: string;
}
@Table
export class Groups extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  groupId: string;

  @Column
  @ApiProperty()
  groupName: string;

  @Column
  @ApiProperty()
  groupDescription: string;

  @ForeignKey(() => Type)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID
  })
  groupType: string;

  @BelongsTo(() => Type)
  types: Type

  @ForeignKey(() => Attribute)
  @ApiProperty({ type: () => [groupAttributeDto] })
  @Column({
    type: DataTypes.UUID
  })
  attributes: groupAttributeDto[];

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @ForeignKey(() => Tag)
  @ApiProperty()
  @Column({
    type: DataTypes.UUID
  })
  tags: string[];

  @BelongsTo(() => Tag)
  tag: Tag;

  @HasMany(() => Dungeons)
  dungeons: Dungeons[];

  @HasMany(() => GroupTags)
  groupTags: GroupTags[];

  @HasMany(() => GroupAffiliation)
  groupAffiliation: GroupAffiliation[];

  @HasMany(() => GroupAttribute)
  groupAttribute: GroupAttribute[];

  @HasMany(() => GroupMessage)
  groupMessage: GroupMessage[];

  @HasMany(() => Channel)
  channel: Channel[];
}
