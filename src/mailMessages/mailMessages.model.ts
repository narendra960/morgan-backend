import {
    Column,
    Table,
    Model,
    PrimaryKey,
    AllowNull,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.model';

  @Table
  export class MailMessages extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    mailId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
    })
    @ApiProperty()
    mailRecipient: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
    })
    @ApiProperty()
    mailSender: string;

    @Column
    @ApiProperty()
    mailMessageText: string;

    @Column
    @ApiProperty()
    mailAttachments: string;

    @Column
    @ApiProperty()
    mailGateAddressTokens: string;

    @Column
    @ApiProperty()
    mailRead: boolean;

    @Column({
        defaultValue: false
    })
    @ApiProperty()
    isDeleted: boolean

    @BelongsTo(() => User, "mailRecipient")
    recipentUser: User;

    @BelongsTo(() => User, "mailSender")
    senderUser: User;
  }