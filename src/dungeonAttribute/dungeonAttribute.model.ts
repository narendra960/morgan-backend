import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
import { Dungeons } from 'src/dungeons/dungeons.model';
import { Attribute } from 'src/attribute/attribute.model';

  @Table
  export class DungeonAttribute extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    attributeId: string;


    @ForeignKey(() => Dungeons)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    dungeonsId: string;

    @BelongsTo(() => Dungeons)
    dungeons: Dungeons;

    @Column
    @ApiProperty()
    value: string;

    @ForeignKey(() => Attribute)
    @Column({
      type: DataType.UUID
    })
    @ApiProperty()
    attributesId: string;

    @BelongsTo(() => Attribute)
    attribute: Attribute;
  }