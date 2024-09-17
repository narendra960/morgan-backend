import {
    Column,
    Table,
    Model,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    DataType,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { Map } from 'src/map/map.model';
  import { Tag } from 'src/tag/tag.model';
  
  @Table
  export class MapTag extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
    mapTagId: string;
  
    @ForeignKey(() => Map)
    @Column({
      type: DataType.UUID,
    })
    @ApiProperty()
    mapId: string;
  
    @BelongsTo(() => Map)
    map: Map;
  
    @ForeignKey(() => Tag)
    @Column({
      type: DataType.UUID,
    })
    @ApiProperty()
    tagId: string;
  
    @BelongsTo(() => Tag)
    tag: Tag;
  }
  