import { Column, Table, Model, ForeignKey, PrimaryKey, BelongsTo } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

@Table
export class Token extends Model {
    @PrimaryKey
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    })
    tokenId: string;

    @ForeignKey(() => User)
    @ApiProperty()   
    @Column({
        type: DataTypes.UUID,
        allowNull: false,
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @Column
    ({
        type: DataTypes.STRING,
        allowNull: false,
    })
    @ApiProperty()
    token: string;
}
