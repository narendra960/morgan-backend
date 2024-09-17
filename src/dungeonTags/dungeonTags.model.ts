import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { Dungeons } from 'src/dungeons/dungeons.model';
import { Tag } from 'src/tag/tag.model';
import { Attribute } from 'src/attribute/attribute.model';

  @Table
  export class DungeonTags extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    tagId: string;

    @ForeignKey(() => Dungeons)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    dungeonsId: string;

    @BelongsTo(() => Dungeons)
    dungeons: Dungeons;

    @ForeignKey(() => Tag)
    @Column({
      type: DataType.UUID
    })
    @ApiProperty()
    tagsId: string;

    @BelongsTo(() => Tag)
    tag: Tag;
  }
