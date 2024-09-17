import { Column, Table, Model, PrimaryKey, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Zone } from 'src/zone/zone.model';
import { Region } from 'src/region/region.model';
import { Dungeons } from 'src/dungeons/dungeons.model';
import { Groups } from 'src/groups/groups.model';
import { Entry } from 'src/entry/entry.model';

@Table
export class Type extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  typeId: string;

  @Column
  @ApiProperty()
  textString: string;

  @HasMany(() => Zone)
  zone: Zone[]

  @HasMany(() => Region)
  region: Region[];

  @HasMany(() => Dungeons)
  dungeon: Dungeons[];

  @HasMany(() => Groups)
  group: Groups[];

  @HasMany(() => Entry)
  type: Entry[];
}
