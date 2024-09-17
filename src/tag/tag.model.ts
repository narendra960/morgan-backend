  import { Column, Table, Model, PrimaryKey, HasMany } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
  import { DataTypes } from 'sequelize';
  import { Zone } from 'src/zone/zone.model';
import { RegionTag } from 'src/regionTag/regionTag.model';
import { Region } from 'src/region/region.model';
import { Entry } from 'src/entry/entry.model';
import { EntryTag } from 'src/entryTag/entryTag.model';
import { ZoneTag } from 'src/zoneTag/zoneTag.model';
import { GroupTags } from 'src/groupTags/groupTags.model';
import { DungeonTags } from 'src/dungeonTags/dungeonTags.model';
import { Groups } from 'src/groups/groups.model';
import { MapTag } from 'src/mapTag/mapTag.model';
import { ClusterTag } from 'src/clusterTag/clusterTag.model';

  @Table
  export class Tag extends Model {
    @PrimaryKey
    @Column({
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    })
    tagId: string;

    @Column
    @ApiProperty()
    tagString: string;

    @HasMany(() => Zone)
    zones: Zone[];

    @HasMany(() => Region)
    region: Region[];

    @HasMany(() => Entry)
    entry: Entry[];

    // @HasMany(() => EntryTag)
    // entryTag: EntryTag[];

    // @HasMany(() => ZoneTag)
    // zoneTag: ZoneTag[];

    // @HasMany(() => GroupTags)
    // groupTags: GroupTags[];

    @HasMany(() => Groups)
    group: Groups[];

    @HasMany(() => DungeonTags)
    dungeonTags: DungeonTags[];

    @HasMany(() => MapTag)
    mapTag: MapTag[];

    @HasMany(() => ClusterTag)
    clusterTag: ClusterTag[];
  }
