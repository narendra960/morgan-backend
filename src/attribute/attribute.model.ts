import { Column, Table, Model, PrimaryKey, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { RegionAttribute } from 'src/regionAttribute/regionAttribute.model';
import { ZoneTag } from 'src/zoneTag/zoneTag.model';
import { ZoneAttribute } from 'src/zoneAttribute/zoneAttribute.model';
import { GroupAttribute } from 'src/groupAttribute/groupAttribute.model';
import { DungeonAttribute } from 'src/dungeonAttribute/dungeonAttribute.model';
import { Zone } from 'src/zone/zone.model';
import { Entry } from 'src/entry/entry.model';
import { Region } from 'src/region/region.model';
import { Groups } from 'src/groups/groups.model';
import { EntryAttribute } from 'src/entryAttribute/entryAttribute.model';

@Table
export class Attribute extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  attributeId: string;

  @Column
  @ApiProperty()
  attributeName: string;

  @HasMany(() => DungeonAttribute)
  dungeonAttributes: DungeonAttribute[];

  @HasMany(() => Zone)
  zone: Zone[];

  @HasMany(() => Entry)
  entry: Entry[];

  @HasMany(() => Region)
  region: Region[];

  @HasMany(() => Groups)
  group: Groups[];

  @HasMany(() => GroupAttribute)
  groupAttribute: GroupAttribute;

  @HasMany(() => RegionAttribute)
  regionAttribute: RegionAttribute;

  @HasMany(() => EntryAttribute)
  entryAttribute: EntryAttribute;

  @HasMany(() => ZoneAttribute)
  zoneAttribute: ZoneAttribute;
}
