import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Groups } from "src/groups/groups.model";

@Table
export class Channel extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    channelId: string;

    @Column
    @ApiProperty()
    server: string;

    @ForeignKey(() => Groups)
    @Column({
        type: DataType.UUID
    })
    @ApiProperty()
    groupId: string;

    @BelongsTo(() => Groups)
    group: Groups

    @Column
    @ApiProperty()
    channelName: string;

}