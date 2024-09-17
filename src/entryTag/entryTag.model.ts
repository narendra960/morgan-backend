import { Column, Table, Model, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Entry } from 'src/entry/entry.model';

@Table
export class EntryTag extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  etId: string;

  @ForeignKey(() => Entry)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  entryId: string;

  @BelongsTo(() => Entry)
  entry: Entry;

  @Column
  @ApiProperty()
  tagId: string;
}
