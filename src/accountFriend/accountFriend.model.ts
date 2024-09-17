import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, ForeignKey, PrimaryKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class AccountFriend extends Model<AccountFriend> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  accountFriendId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  userId: string;

  @Column({
    type: DataType.JSON, 
    allowNull: true,
    get() {
      const friendsArray = this.getDataValue('Friends');
      return friendsArray ? JSON.parse(friendsArray) : [];
    },
    set(val) {
      if (Array.isArray(val) && val.every((id) => typeof id === 'string')) {
        this.setDataValue('Friends', JSON.stringify(val));
      } else {
        throw new Error('Invalid format for the Friends field.');
      }
    },
  })
  @ApiProperty()
  Friends: string[];
}
