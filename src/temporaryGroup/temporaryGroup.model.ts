import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';

@Table
export class TemporaryGroup extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    groupTempId: string;

    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupMembers: string;

    @Column
    @ApiProperty()
    groupUnrealId: string;
}