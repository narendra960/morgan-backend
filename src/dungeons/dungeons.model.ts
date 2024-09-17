import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    BelongsTo,
    ForeignKey,
    HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Groups } from '../groups/groups.model';
import { Sequelize, DataTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { DungeonAttribute } from 'src/dungeonAttribute/dungeonAttribute.model';
import { DungeonTags } from 'src/dungeonTags/dungeonTags.model';
import { Type } from 'src/type/type.model';
import { Attribute } from 'src/attribute/attribute.model';
import { Tag } from 'src/tag/tag.model';
class dungeonAttributeDto {
    @ApiProperty()
    attributeId: string;

    @ApiProperty()
    value: string;
}

@Table
export class Dungeons extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    dungeonsId: string;

    @ForeignKey(() => Groups)
    @Column({
        field: 'groupId',
        type: DataType.UUID
    })
    groupId: string;

    @BelongsTo(() => Groups)
    groups: Groups

    @ForeignKey(() => Type)
    @ApiProperty()
    @Column({
        type: DataTypes.UUID
    })
    type: string;

    @BelongsTo(() => Type)
    types: Type

    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    mapId: string;

    @ForeignKey(() => Attribute)
    @ApiProperty({ type: () => [dungeonAttributeDto] })
    @Column({
        type: DataTypes.UUID
    })
    attributes: dungeonAttributeDto[];

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

    @Column
    @ApiProperty()
    dungeonName: string;

    @Column
    @ApiProperty()
    dungeonDescription: string;

    @Column
    @ApiProperty()
    dungeonUrl: string;

    @Column
    @ApiProperty()
    tier: number;

    @HasMany(() => DungeonAttribute)
    dungeonAttribute: DungeonAttribute;

    @HasMany(() => DungeonTags)
    dungeonTags: DungeonTags;
}