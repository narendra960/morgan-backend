import { Column, Table, Model, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Entry } from 'src/entry/entry.model';
import { Attribute } from 'src/attribute/attribute.model';

@Table
export class EntryAttribute extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  eaId: string;

  @ForeignKey(() => Entry)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  @ApiProperty()
  entryId: string;

  @BelongsTo(() => Entry)
  entry: Entry;

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
