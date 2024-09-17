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
  import { Groups } from 'src/groups/groups.model';

  @Table
  export class GroupAffiliation extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    affiliatedGroupId: string;

    @ForeignKey(() => Groups)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupId: string;

    // This is also reref to the group as per the requirement
    @ForeignKey(()=> Groups)
    @Column({
      type: DataType.UUID
    })
    @ApiProperty()
    groupAffiliationId: string;

    @Column
    @ApiProperty()
    relationshipType: string;

    @Column
    @ApiProperty()
    strength: string;

    @BelongsTo(() => Groups, "groupId")
    groups: Groups

    @BelongsTo(()=> Groups, "groupAffiliationId")
    groupsAffiliation: Groups;
  }